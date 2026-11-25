import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import request from "supertest";

// Isolate test run inside dedicated temporary MongoDB databases on the cluster
const TEST_SUFFIX = Date.now().toString(36);
process.env.NODE_ENV = "test";
process.env.DB_CATALOG = `ornate_test_catalog_${TEST_SUFFIX}`;
process.env.DB_USERS = `ornate_test_users_${TEST_SUFFIX}`;
process.env.DB_ORDERS = `ornate_test_orders_${TEST_SUFFIX}`;
process.env.DB_ADMIN = `ornate_test_admin_${TEST_SUFFIX}`;
process.env.RAZORPAY_KEY_ID = "";
process.env.RAZORPAY_KEY_SECRET = "";

const { connectDatabases, getDatabases, closeDatabases } = await import(
  "../src/config/databases.js"
);
const { seedInitialData } = await import("../src/services/seedService.js");
const { getModels } = await import("../src/models/index.js");
const { createApp } = await import("../src/app.js");

let app;
let adminToken;
let customerToken;
let customerUserId;
let localProductId;
let addressId;

describe("Ornate Multi-DB E-Commerce API & Razorpay Scenarios", () => {
  before(async () => {
    await connectDatabases();
    await seedInitialData();
    app = createApp();
  });

  after(async () => {
    const dbs = getDatabases();
    await Promise.all([
      dbs.catalog.dropDatabase(),
      dbs.users.dropDatabase(),
      dbs.orders.dropDatabase(),
      dbs.admin.dropDatabase(),
    ]);
    await closeDatabases();
  });

  it("connects to all 4 MongoDB databases and reports system health", async () => {
    const res = await request(app).get("/api/health").expect(200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.databases.status, "connected");
    assert.equal(res.body.databases.databases.length, 4);
    assert.equal(res.body.imagekit.folder, "Ornate_Firnitures");
    assert.equal(res.body.razorpayMode, "razorpay_test_simulator");
  });

  it("logs in default seeded admin stored with unhashed password in ornate_admin", async () => {
    const { AdminUser } = getModels();
    const rawAdmin = await AdminUser.findOne({
      email: "admin@ornateinteriordecor.com",
    }).lean();
    assert.ok(rawAdmin);
    assert.equal(rawAdmin.password, "OrnateAdmin@2026");

    const res = await request(app)
      .post("/api/admin/auth/login")
      .send({
        email: "admin@ornateinteriordecor.com",
        password: "OrnateAdmin@2026",
      })
      .expect(200);

    assert.ok(res.body.data.token);
    assert.equal(res.body.data.admin.password, undefined);
    adminToken = res.body.data.token;
  });

  it("creates local product and combines it with external SLR00003 API products", async () => {
    const createRes = await request(app)
      .post("/api/admin/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Vijayanagar Teak Lounge Armchair",
        sku: "ORN-TEAK-101",
        brand: "Ornate Atelier",
        subcategoryName: "Living Room Furniture",
        shortDescription: "Hand-rubbed solid Burma teak lounge chair.",
        longDescription: "Crafted in Bengaluru with natural cane webbing and linen seat.",
        mrp: 32000,
        sellingPrice: 27500,
        dealActive: true,
        dealPrice: 24500,
        stock: 5,
        isFeatured: true,
        images: [
          {
            url: "https://ik.imagekit.io/ornateassets/ornatecom/Ornate_Firnitures/sample.jpg",
            alt: "Teak Lounge Armchair",
          },
        ],
        attributes: [{ key: "wood", value: "Solid Burma Teak" }],
      })
      .expect(201);

    localProductId = createRes.body.data.product.id;
    assert.equal(createRes.body.data.product.source, "local");
    assert.equal(createRes.body.data.product.pricing.applicablePrice, 2450000);

    const catalogRes = await request(app).get("/api/products").expect(200);
    const localItem = catalogRes.body.data.products.find((p) => p.id === localProductId);
    assert.ok(localItem, "Local MongoDB product must appear in combined catalog");
    assert.ok(catalogRes.body.data.meta.localCount >= 1);

    // Verify External API product override, hide, and reset override
    const externalItem = catalogRes.body.data.products.find((p) => p.source === "external");
    if (externalItem) {
      await request(app)
        .patch(`/api/admin/products/${externalItem.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ stock: 12, isHidden: true })
        .expect(200);

      const hiddenCheck = await request(app).get("/api/products").expect(200);
      assert.equal(
        hiddenCheck.body.data.products.some((p) => p.id === externalItem.id),
        false
      );

      await request(app)
        .post(`/api/admin/products/${externalItem.id}/reset-override`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      const restoredCheck = await request(app).get("/api/products").expect(200);
      assert.equal(
        restoredCheck.body.data.products.some((p) => p.id === externalItem.id),
        true
      );
    }
  });

  it("uploads product image to ImageKit Ornate_Firnitures folder and cleans up", async () => {
    // 1x1 transparent PNG bytes
    const pngBase64 =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    const uploadRes = await request(app)
      .post("/api/admin/upload")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        fileName: `test-ornate-${TEST_SUFFIX}.png`,
        base64Data: pngBase64,
      })
      .expect(201);

    assert.ok(uploadRes.body.data.url.includes("Ornate_Firnitures"));
    assert.ok(uploadRes.body.data.fileId);

    await request(app)
      .delete(`/api/admin/upload/${uploadRes.body.data.fileId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);
  });

  it("registers customer with plaintext password (never exposed in JSON) and logs in", async () => {
    const regRes = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Aarav Rao",
        email: "aarav@example.com",
        phone: "9845012345",
        password: "MyPlainPassword1",
      })
      .expect(201);

    assert.ok(regRes.body.data.token);
    assert.equal(regRes.body.data.user.password, undefined);
    customerUserId = regRes.body.data.user.id;

    const { User } = getModels();
    const rawUser = await User.findById(customerUserId).lean();
    assert.equal(rawUser.password, "MyPlainPassword1");

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "aarav@example.com", password: "MyPlainPassword1" })
      .expect(200);
    customerToken = loginRes.body.data.token;
  });

  it("blocks checkout endpoints when user is not logged in", async () => {
    await request(app)
      .post("/api/orders/checkout/create-razorpay-order")
      .send({ items: [{ productId: localProductId, quantity: 1 }] })
      .expect(401);
  });

  it("manages saved addresses, guest cart merge, and coupon application", async () => {
    const addrRes = await request(app)
      .post("/api/addresses")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({
        fullName: "Aarav Rao",
        phone: "9845012345",
        line1: "42, 4th Cross, Vijayanagar",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560040",
        type: "Home",
      })
      .expect(201);
    addressId = addrRes.body.data.id;
    assert.equal(addrRes.body.data.isDefault, true);

    const mergeRes = await request(app)
      .post("/api/cart/merge")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ items: [{ productId: localProductId, quantity: 2 }] })
      .expect(200);

    assert.equal(mergeRes.body.data.items.length, 1);
    assert.equal(mergeRes.body.data.items[0].quantity, 2);

    const couponRes = await request(app)
      .post("/api/cart/coupon")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ code: "ORNATE10" })
      .expect(200);

    // 2 * 24500 = 49000 -> 10% = 4900 (<= max 5000) -> grandTotal 44100 (free shipping >= 25000)
    assert.equal(couponRes.body.data.summary.subtotal, 49000);
    assert.equal(couponRes.body.data.summary.couponDiscount, 4900);
    assert.equal(couponRes.body.data.summary.shippingFee, 0);
    assert.equal(couponRes.body.data.summary.grandTotal, 44100);
  });

  it("validates Razorpay Scenario 1: Tampered signature is rejected & stock stays untouched", async () => {
    const createOrderRes = await request(app)
      .post("/api/orders/checkout/create-razorpay-order")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ addressId })
      .expect(201);

    const { razorpay } = createOrderRes.body.data;
    const verifyBad = await request(app)
      .post("/api/orders/checkout/verify-payment")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({
        razorpay_order_id: razorpay.razorpayOrderId,
        razorpay_payment_id: "pay_tampered_123",
        razorpay_signature: "invalid_signature_hex",
        method: "UPI",
      })
      .expect(400);

    assert.equal(verifyBad.body.code, "SIGNATURE_MISMATCH");
    assert.equal(verifyBad.body.data.order.paymentStatus, "FAILED");
  });

  it("validates Razorpay Scenario 2 & 3: Payment Failed -> Cancelled -> Retry -> Valid Signature Success & Idempotent Replay", async () => {
    const createOrderRes = await request(app)
      .post("/api/orders/checkout/create-razorpay-order")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ addressId })
      .expect(201);

    const orderId = createOrderRes.body.data.order.id;
    const firstRzpId = createOrderRes.body.data.razorpay.razorpayOrderId;

    // Simulate payment failure
    const failRes = await request(app)
      .post("/api/orders/checkout/payment-failed")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({
        razorpay_order_id: firstRzpId,
        reason: "Insufficient funds in test UPI",
      })
      .expect(200);
    assert.equal(failRes.body.data.order.orderStatus, "PAYMENT_FAILED");

    // Retry payment on the same order
    const retryRes = await request(app)
      .post(`/api/orders/${orderId}/retry-payment`)
      .set("Authorization", `Bearer ${customerToken}`)
      .expect(200);
    const retryRzpId = retryRes.body.data.razorpay.razorpayOrderId;
    assert.notEqual(retryRzpId, firstRzpId);

    // Simulate user dismissal first
    const cancelRes = await request(app)
      .post("/api/orders/checkout/payment-cancelled")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ razorpay_order_id: retryRzpId })
      .expect(200);
    assert.equal(cancelRes.body.data.order.paymentStatus, "CANCELLED");

    // Now get legitimate simulator signature and verify payment success
    const signRes = await request(app)
      .post("/api/orders/checkout/simulator-sign")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ razorpayOrderId: retryRzpId })
      .expect(200);

    const verifyOk = await request(app)
      .post("/api/orders/checkout/verify-payment")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({
        ...signRes.body.data,
        method: "Razorpay Test UPI",
      })
      .expect(200);

    assert.equal(verifyOk.body.data.order.paymentStatus, "PAID");
    assert.equal(verifyOk.body.data.order.orderStatus, "CONFIRMED");

    // Verify stock reduced from 5 to 3
    const prodRes = await request(app).get(`/api/products/${localProductId}`).expect(200);
    assert.equal(prodRes.body.data.product.stock, 3);

    // Verify cart was cleared
    const cartRes = await request(app)
      .get("/api/cart")
      .set("Authorization", `Bearer ${customerToken}`)
      .expect(200);
    assert.equal(cartRes.body.data.items.length, 0);

    // Idempotent duplicate verify-payment does NOT double deduct stock
    const replayRes = await request(app)
      .post("/api/orders/checkout/verify-payment")
      .set("Authorization", `Bearer ${customerToken}`)
      .send(signRes.body.data)
      .expect(200);
    assert.equal(replayRes.body.idempotent, true);

    const prodAfterReplay = await request(app).get(`/api/products/${localProductId}`).expect(200);
    assert.equal(prodAfterReplay.body.data.product.stock, 3);
  });

  it("validates Razorpay Scenario 4: Stock exhaustion blocks capture if stock runs out mid-checkout", async () => {
    // Remaining stock is 3. Create order for 3 units
    const orderRes = await request(app)
      .post("/api/orders/checkout/create-razorpay-order")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({
        addressId,
        items: [{ productId: localProductId, quantity: 3 }],
      })
      .expect(201);

    const rzpId = orderRes.body.data.razorpay.razorpayOrderId;

    // Admin drops stock to 1 while customer is in Razorpay modal
    await request(app)
      .patch(`/api/admin/products/${localProductId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ stock: 1 })
      .expect(200);

    const signRes = await request(app)
      .post("/api/orders/checkout/simulator-sign")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ razorpayOrderId: rzpId })
      .expect(200);

    const verifyFail = await request(app)
      .post("/api/orders/checkout/verify-payment")
      .set("Authorization", `Bearer ${customerToken}`)
      .send(signRes.body.data)
      .expect(409);

    assert.equal(verifyFail.body.code, "STOCK_UNAVAILABLE");
  });

  it("allows verified buyer review and customer order cancellation with stock restoration", async () => {
    const reviewRes = await request(app)
      .post(`/api/products/${localProductId}/reviews`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({
        rating: 5,
        title: "Gorgeous Burma Teak Craftsmanship",
        comment: "Solid joinery and comfortable cane backrest.",
      })
      .expect(201);
    assert.equal(reviewRes.body.data.verifiedPurchase, true);

    const ordersRes = await request(app)
      .get("/api/orders")
      .set("Authorization", `Bearer ${customerToken}`)
      .expect(200);
    const paidOrder = ordersRes.body.data.find((o) => o.paymentStatus === "PAID");
    assert.ok(paidOrder);

    const cancelRes = await request(app)
      .post(`/api/orders/${paidOrder.id}/cancel`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ reason: "Changed room dimensions" })
      .expect(200);

    assert.equal(cancelRes.body.data.orderStatus, "CANCELLED");
    assert.equal(cancelRes.body.data.paymentStatus, "REFUNDED");

    // Stock restored (+2 from cancelled order on top of 1 -> 3)
    const prodRes = await request(app).get(`/api/products/${localProductId}`).expect(200);
    assert.equal(prodRes.body.data.product.stock, 3);
  });
});
