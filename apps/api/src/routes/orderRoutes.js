import { Router } from "express";
import { getModels } from "../models/index.js";
import { requireCustomerAuth } from "../middleware/auth.js";
import {
  getCombinedCatalog,
  restoreOrderStock,
  validateAndDeductStock,
} from "../services/catalogService.js";
import {
  createGatewayOrder,
  generateSimulatorPaymentCredentials,
  getRazorpayMode,
  verifyRazorpaySignature,
} from "../services/paymentService.js";
import {
  calculateOrderPricing,
  generateOrderNumber,
  paiseToRupees,
  rupeesToPaise,
} from "../utils/pricing.js";

const router = Router();
router.use(requireCustomerAuth);

function extractRazorpayFields(body = {}) {
  return {
    razorpayOrderId: String(
      body.razorpay_order_id || body.razorpayOrderId || ""
    ).trim(),
    razorpayPaymentId: String(
      body.razorpay_payment_id || body.razorpayPaymentId || ""
    ).trim(),
    razorpaySignature: String(
      body.razorpay_signature || body.razorpaySignature || ""
    ).trim(),
  };
}

function serializeOrder(doc) {
  return {
    id: String(doc._id),
    orderNumber: doc.orderNumber,
    userId: doc.userId,
    customer: doc.customer,
    shippingAddress: doc.shippingAddress,
    items: doc.items,
    pricing: doc.pricing,
    paymentMethod: doc.paymentMethod,
    paymentGatewayMode: doc.paymentGatewayMode,
    paymentStatus: doc.paymentStatus,
    orderStatus: doc.orderStatus,
    razorpayOrderId: doc.razorpayOrderId,
    razorpayPaymentId: doc.razorpayPaymentId || "",
    deliveryNotes: doc.deliveryNotes || "",
    giftWrap: Boolean(doc.giftWrap),
    courierName: doc.courierName || "",
    trackingNumber: doc.trackingNumber || "",
    estimatedDelivery: doc.estimatedDelivery || "",
    timeline: doc.timeline || [],
    paymentAttempts: doc.paymentAttempts || [],
    createdAt: doc.createdAt?.toISOString?.() || new Date().toISOString(),
    updatedAt: doc.updatedAt?.toISOString?.() || new Date().toISOString(),
  };
}

async function resolveShippingAddress(userId, body) {
  const { Address } = getModels();
  if (body.addressId) {
    const addr = await Address.findOne({ _id: body.addressId, userId }).lean();
    if (!addr) {
      return { error: "Selected shipping address was not found." };
    }
    return {
      address: {
        fullName: addr.fullName,
        phone: addr.phone,
        line1: addr.line1,
        line2: addr.line2 || "",
        landmark: addr.landmark || "",
        city: addr.city,
        state: addr.state,
        pincode: addr.pincode,
        type: addr.type || "Home",
      },
    };
  }

  const raw = body.shippingAddress || {};
  if (
    !raw.fullName?.trim() ||
    !raw.phone?.trim() ||
    !raw.line1?.trim() ||
    !raw.city?.trim() ||
    !raw.state?.trim() ||
    !/^\d{6}$/.test(String(raw.pincode || "").trim())
  ) {
    return { error: "Complete delivery address with a valid 6-digit pincode is required." };
  }

  return {
    address: {
      fullName: raw.fullName.trim(),
      phone: raw.phone.trim(),
      line1: raw.line1.trim(),
      line2: String(raw.line2 || "").trim(),
      landmark: String(raw.landmark || "").trim(),
      city: raw.city.trim(),
      state: raw.state.trim(),
      pincode: String(raw.pincode).trim(),
      type: raw.type || "Home",
    },
  };
}

router.post("/checkout/create-razorpay-order", async (req, res, next) => {
  try {
    const userId = String(req.user._id);
    const { Cart, Coupon, Order, PaymentLog } = getModels();

    const { error: addrError, address } = await resolveShippingAddress(userId, req.body);
    if (addrError) {
      return res.status(400).json({ success: false, message: addrError });
    }

    const dbCart = await Cart.findOne({ userId });
    const requestedItems = Array.isArray(req.body.items) && req.body.items.length > 0
      ? req.body.items
      : dbCart?.items || [];

    if (requestedItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty. Add furniture before checking out.",
      });
    }

    const catalog = await getCombinedCatalog({ includeHidden: false });
    const byId = new Map(catalog.products.map((p) => [p.id, p]));

    const orderItems = [];
    for (const row of requestedItems) {
      const prod = byId.get(String(row.productId));
      const qty = Math.floor(Number(row.quantity || 1));

      if (!prod) {
        return res.status(409).json({
          success: false,
          message: "One or more items in your cart are no longer available.",
        });
      }
      if (prod.stock <= 0 || qty < 1 || qty > prod.stock) {
        return res.status(409).json({
          success: false,
          message: `Insufficient stock for "${prod.name}". Available: ${prod.stock}.`,
        });
      }

      const unitPrice = paiseToRupees(prod.pricing?.applicablePrice);
      const mrp = paiseToRupees(prod.pricing?.mrp);
      orderItems.push({
        productId: prod.id,
        sku: prod.sku,
        slug: prod.slug,
        name: prod.name,
        brand: prod.brand,
        image: prod.images?.[0]?.url || "",
        source: prod.source,
        unitPrice,
        mrp: mrp > unitPrice ? mrp : null,
        quantity: qty,
        lineTotal: unitPrice * qty,
      });
    }

    const couponCode = (req.body.couponCode ?? dbCart?.couponCode ?? "")
      .toString()
      .trim()
      .toUpperCase();
    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({ code: couponCode, isActive: true }).lean();
    }

    const pricing = calculateOrderPricing(orderItems, coupon);
    if (pricing.grandTotal <= 0) {
      return res.status(400).json({
        success: false,
        message: "Order total must be greater than ₹0.",
      });
    }

    const orderNumber = generateOrderNumber();
    const amountPaise = rupeesToPaise(pricing.grandTotal);
    const gatewayOrder = await createGatewayOrder({
      amountPaise,
      receipt: orderNumber,
      notes: {
        orderNumber,
        userId,
        customerEmail: req.user.email,
      },
    });

    const isBengaluru = address.pincode.startsWith("560");
    const estimatedDelivery = isBengaluru ? "2–4 business days" : "5–8 business days";

    const order = await Order.create({
      orderNumber,
      userId,
      customer: {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
      },
      shippingAddress: address,
      items: orderItems,
      pricing,
      paymentMethod: "RAZORPAY_ONLINE",
      paymentGatewayMode: gatewayOrder.mode,
      paymentStatus: "PENDING",
      orderStatus: "PAYMENT_PENDING",
      razorpayOrderId: gatewayOrder.razorpayOrderId,
      deliveryNotes: String(req.body.deliveryNotes || "").trim(),
      giftWrap: Boolean(req.body.giftWrap),
      estimatedDelivery,
      timeline: [
        {
          status: "PAYMENT_PENDING",
          note: "Razorpay checkout initiated. Awaiting online payment confirmation.",
          timestamp: new Date(),
        },
      ],
      paymentAttempts: [
        {
          razorpayOrderId: gatewayOrder.razorpayOrderId,
          status: "CREATED",
          reason: "Order created at Razorpay gateway",
          timestamp: new Date(),
        },
      ],
    });

    await PaymentLog.create({
      orderId: String(order._id),
      orderNumber,
      userId,
      razorpayOrderId: gatewayOrder.razorpayOrderId,
      event: "ORDER_CREATED",
      amountPaise,
      mode: gatewayOrder.mode,
      details: { itemCount: orderItems.length, couponCode: pricing.couponCode },
    });

    res.status(201).json({
      success: true,
      data: {
        order: serializeOrder(order),
        razorpay: gatewayOrder,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post("/checkout/simulator-sign", async (req, res, next) => {
  try {
    if (getRazorpayMode() !== "razorpay_test_simulator") {
      return res.status(403).json({
        success: false,
        message: "Test simulator helper is disabled when live Razorpay keys are configured.",
      });
    }

    const razorpayOrderId = String(req.body.razorpayOrderId || "").trim();
    const { Order } = getModels();
    const order = await Order.findOne({
      razorpayOrderId,
      userId: String(req.user._id),
    }).lean();

    if (!order) {
      return res.status(404).json({ success: false, message: "Pending Razorpay order not found." });
    }

    const credentials = generateSimulatorPaymentCredentials(razorpayOrderId);
    res.json({ success: true, data: credentials });
  } catch (err) {
    next(err);
  }
});

router.post("/checkout/verify-payment", async (req, res, next) => {
  try {
    const userId = String(req.user._id);
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } =
      extractRazorpayFields(req.body);
    const method = req.body.method || "UPI / Card";

    const { Order, Cart, Coupon, PaymentLog } = getModels();
    const order = await Order.findOne({ razorpayOrderId, userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Matching checkout order was not found.",
      });
    }

    // Idempotent handling if client retries verification on already-paid order
    if (order.paymentStatus === "PAID") {
      await PaymentLog.create({
        orderId: String(order._id),
        orderNumber: order.orderNumber,
        userId,
        razorpayOrderId,
        razorpayPaymentId: order.razorpayPaymentId,
        event: "IDEMPOTENT_REPLAY",
        amountPaise: rupeesToPaise(order.pricing.grandTotal),
        mode: order.paymentGatewayMode,
        details: { message: "Duplicate verify-payment safely returned existing PAID order." },
      });

      return res.json({
        success: true,
        idempotent: true,
        data: { order: serializeOrder(order) },
      });
    }

    const signatureValid = verifyRazorpaySignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    if (!signatureValid) {
      order.paymentStatus = "FAILED";
      order.orderStatus = "PAYMENT_FAILED";
      order.paymentAttempts.push({
        razorpayOrderId,
        razorpayPaymentId: razorpayPaymentId || "",
        method,
        status: "SIGNATURE_MISMATCH",
        reason: "Razorpay HMAC-SHA256 signature verification failed.",
        timestamp: new Date(),
      });
      order.timeline.push({
        status: "PAYMENT_FAILED",
        note: "Payment signature verification failed. Order was not confirmed.",
        timestamp: new Date(),
      });
      await order.save();

      await PaymentLog.create({
        orderId: String(order._id),
        orderNumber: order.orderNumber,
        userId,
        razorpayOrderId,
        razorpayPaymentId: razorpayPaymentId || "",
        event: "SIGNATURE_MISMATCH",
        amountPaise: rupeesToPaise(order.pricing.grandTotal),
        mode: order.paymentGatewayMode,
        details: { receivedSignature: razorpaySignature || null },
      });

      return res.status(400).json({
        success: false,
        code: "SIGNATURE_MISMATCH",
        message: "Payment verification failed: invalid Razorpay signature.",
        data: { order: serializeOrder(order) },
      });
    }

    // Re-check stock atomically before confirming
    const stockResult = await validateAndDeductStock(order.items);
    if (!stockResult.ok) {
      order.paymentStatus = "FAILED";
      order.orderStatus = "PAYMENT_FAILED";
      order.paymentAttempts.push({
        razorpayOrderId,
        razorpayPaymentId,
        method,
        status: "FAILED",
        reason: stockResult.reason,
        timestamp: new Date(),
      });
      order.timeline.push({
        status: "PAYMENT_FAILED",
        note: `Stock check failed during capture: ${stockResult.reason}`,
        timestamp: new Date(),
      });
      await order.save();

      await PaymentLog.create({
        orderId: String(order._id),
        orderNumber: order.orderNumber,
        userId,
        razorpayOrderId,
        razorpayPaymentId,
        event: "STOCK_VALIDATION_FAILED",
        amountPaise: rupeesToPaise(order.pricing.grandTotal),
        mode: order.paymentGatewayMode,
        details: { reason: stockResult.reason },
      });

      return res.status(409).json({
        success: false,
        code: "STOCK_UNAVAILABLE",
        message: stockResult.reason,
        data: { order: serializeOrder(order) },
      });
    }

    order.paymentStatus = "PAID";
    order.orderStatus = "CONFIRMED";
    order.razorpayPaymentId = razorpayPaymentId;
    order.razorpaySignature = razorpaySignature;
    order.paymentAttempts.push({
      razorpayOrderId,
      razorpayPaymentId,
      method,
      status: "CAPTURED",
      reason: "Razorpay signature verified and payment captured.",
      timestamp: new Date(),
    });
    order.timeline.push({
      status: "CONFIRMED",
      note: `Payment verified via Razorpay (${method}). Order confirmed.`,
      timestamp: new Date(),
    });
    await order.save();

    if (order.pricing?.couponCode) {
      await Coupon.updateOne(
        { code: order.pricing.couponCode },
        { $inc: { usageCount: 1 } }
      );
    }

    await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [], couponCode: null } }
    );

    await PaymentLog.create({
      orderId: String(order._id),
      orderNumber: order.orderNumber,
      userId,
      razorpayOrderId,
      razorpayPaymentId,
      event: "PAYMENT_CAPTURED",
      amountPaise: rupeesToPaise(order.pricing.grandTotal),
      mode: order.paymentGatewayMode,
      details: { method },
    });

    res.json({
      success: true,
      data: { order: serializeOrder(order) },
    });
  } catch (err) {
    next(err);
  }
});

router.post("/checkout/payment-failed", async (req, res, next) => {
  try {
    const userId = String(req.user._id);
    const { razorpayOrderId, razorpayPaymentId } = extractRazorpayFields(req.body);
    const reason = req.body.reason || "Payment declined by issuing bank.";
    const method = req.body.method || "Card / UPI";

    const { Order, PaymentLog } = getModels();
    const order = await Order.findOne({ razorpayOrderId, userId });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }
    if (order.paymentStatus === "PAID") {
      return res.json({ success: true, data: { order: serializeOrder(order) } });
    }

    order.paymentStatus = "FAILED";
    order.orderStatus = "PAYMENT_FAILED";
    order.paymentAttempts.push({
      razorpayOrderId,
      razorpayPaymentId,
      method,
      status: "FAILED",
      reason,
      timestamp: new Date(),
    });
    order.timeline.push({
      status: "PAYMENT_FAILED",
      note: reason,
      timestamp: new Date(),
    });
    await order.save();

    await PaymentLog.create({
      orderId: String(order._id),
      orderNumber: order.orderNumber,
      userId,
      razorpayOrderId,
      razorpayPaymentId,
      event: "PAYMENT_FAILED",
      amountPaise: rupeesToPaise(order.pricing.grandTotal),
      mode: order.paymentGatewayMode,
      details: { reason, method },
    });

    res.json({
      success: true,
      data: { order: serializeOrder(order) },
    });
  } catch (err) {
    next(err);
  }
});

router.post("/checkout/payment-cancelled", async (req, res, next) => {
  try {
    const userId = String(req.user._id);
    const { razorpayOrderId } = extractRazorpayFields(req.body);
    const reason =
      req.body.reason || "Checkout dismissed by customer before completing payment.";

    const { Order, PaymentLog } = getModels();
    const order = await Order.findOne({ razorpayOrderId, userId });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }
    if (order.paymentStatus === "PAID") {
      return res.json({ success: true, data: { order: serializeOrder(order) } });
    }

    order.paymentStatus = "CANCELLED";
    order.paymentAttempts.push({
      razorpayOrderId,
      status: "CANCELLED",
      reason,
      timestamp: new Date(),
    });
    order.timeline.push({
      status: "PAYMENT_PENDING",
      note: reason,
      timestamp: new Date(),
    });
    await order.save();

    await PaymentLog.create({
      orderId: String(order._id),
      orderNumber: order.orderNumber,
      userId,
      razorpayOrderId,
      event: "PAYMENT_CANCELLED",
      amountPaise: rupeesToPaise(order.pricing.grandTotal),
      mode: order.paymentGatewayMode,
      details: { reason },
    });

    res.json({
      success: true,
      data: { order: serializeOrder(order) },
    });
  } catch (err) {
    next(err);
  }
});

router.post("/:orderId/retry-payment", async (req, res, next) => {
  try {
    const userId = String(req.user._id);
    const { Order, PaymentLog } = getModels();
    const order = await Order.findOne({ _id: req.params.orderId, userId });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }
    if (order.paymentStatus === "PAID") {
      return res.status(400).json({ success: false, message: "Order is already paid." });
    }

    const catalog = await getCombinedCatalog({ includeHidden: false });
    const byId = new Map(catalog.products.map((p) => [p.id, p]));
    for (const item of order.items) {
      const prod = byId.get(item.productId);
      if (!prod || prod.stock < item.quantity) {
        return res.status(409).json({
          success: false,
          message: `Stock is no longer sufficient for "${item.name}".`,
        });
      }
    }

    const amountPaise = rupeesToPaise(order.pricing.grandTotal);
    const gatewayOrder = await createGatewayOrder({
      amountPaise,
      receipt: `${order.orderNumber}-R`,
      notes: { orderNumber: order.orderNumber, retry: "true" },
    });

    order.razorpayOrderId = gatewayOrder.razorpayOrderId;
    order.paymentStatus = "PENDING";
    order.orderStatus = "PAYMENT_PENDING";
    order.paymentAttempts.push({
      razorpayOrderId: gatewayOrder.razorpayOrderId,
      status: "CREATED",
      reason: "Payment retry initiated",
      timestamp: new Date(),
    });
    order.timeline.push({
      status: "PAYMENT_PENDING",
      note: "New Razorpay payment session created for retry.",
      timestamp: new Date(),
    });
    await order.save();

    await PaymentLog.create({
      orderId: String(order._id),
      orderNumber: order.orderNumber,
      userId,
      razorpayOrderId: gatewayOrder.razorpayOrderId,
      event: "ORDER_CREATED",
      amountPaise,
      mode: gatewayOrder.mode,
      details: { retry: true },
    });

    res.json({
      success: true,
      data: {
        order: serializeOrder(order),
        razorpay: gatewayOrder,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const { Order } = getModels();
    const docs = await Order.find({ userId: String(req.user._id) })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, data: docs.map(serializeOrder) });
  } catch (err) {
    next(err);
  }
});

router.get("/:identifier", async (req, res, next) => {
  try {
    const { Order } = getModels();
    const id = req.params.identifier;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    const doc = await Order.findOne({
      userId: String(req.user._id),
      ...(isObjectId ? { $or: [{ _id: id }, { orderNumber: id }] } : { orderNumber: id }),
    }).lean();

    if (!doc) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }
    res.json({ success: true, data: serializeOrder(doc) });
  } catch (err) {
    next(err);
  }
});

router.post("/:orderId/cancel", async (req, res, next) => {
  try {
    const { Order } = getModels();
    const order = await Order.findOne({
      _id: req.params.orderId,
      userId: String(req.user._id),
    });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    if (["SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled once it is ${order.orderStatus}.`,
      });
    }

    const wasPaid = order.paymentStatus === "PAID";
    if (wasPaid) {
      await restoreOrderStock(order.items);
      order.paymentStatus = "REFUNDED";
    }

    order.orderStatus = "CANCELLED";
    order.timeline.push({
      status: "CANCELLED",
      note:
        req.body.reason?.trim() ||
        (wasPaid
          ? "Cancelled by customer. Refund initiated to original online payment method."
          : "Cancelled by customer."),
      timestamp: new Date(),
    });
    await order.save();

    res.json({ success: true, data: serializeOrder(order) });
  } catch (err) {
    next(err);
  }
});

export default router;
