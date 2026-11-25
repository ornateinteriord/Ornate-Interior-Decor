import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    items: { type: [cartItemSchema], default: [] },
    couponCode: { type: String, default: null },
  },
  { timestamps: true }
);

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    sku: { type: String, required: true },
    slug: { type: String, required: true },
    name: { type: String, required: true },
    brand: { type: String, default: "Ornate Studio" },
    image: { type: String, default: "" },
    source: { type: String, enum: ["external", "local"], default: "local" },
    unitPrice: { type: Number, required: true },
    mrp: { type: Number, default: null },
    quantity: { type: Number, required: true, min: 1 },
    lineTotal: { type: Number, required: true },
  },
  { _id: false }
);

const timelineSchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    note: { type: String, default: "" },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const paymentAttemptSchema = new mongoose.Schema(
  {
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String, default: "" },
    method: { type: String, default: "" },
    status: {
      type: String,
      enum: ["CREATED", "CAPTURED", "FAILED", "CANCELLED", "SIGNATURE_MISMATCH"],
      required: true,
    },
    reason: { type: String, default: "" },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      line1: { type: String, required: true },
      line2: { type: String, default: "" },
      landmark: { type: String, default: "" },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      type: { type: String, default: "Home" },
    },
    items: { type: [orderItemSchema], required: true },
    pricing: {
      subtotal: { type: Number, required: true },
      mrpTotal: { type: Number, required: true },
      productSavings: { type: Number, default: 0 },
      couponCode: { type: String, default: null },
      couponDiscount: { type: Number, default: 0 },
      shippingFee: { type: Number, default: 0 },
      freeShippingThreshold: { type: Number, default: 25000 },
      gstAmount: { type: Number, default: 0 },
      taxableValue: { type: Number, default: 0 },
      grandTotal: { type: Number, required: true },
    },
    paymentMethod: { type: String, default: "RAZORPAY_ONLINE" },
    paymentGatewayMode: {
      type: String,
      enum: ["razorpay_live_test", "razorpay_test_simulator"],
      default: "razorpay_test_simulator",
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "CANCELLED", "REFUNDED"],
      default: "PENDING",
    },
    orderStatus: {
      type: String,
      enum: [
        "PAYMENT_PENDING",
        "PAYMENT_FAILED",
        "CONFIRMED",
        "PACKED",
        "SHIPPED",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
      ],
      default: "PAYMENT_PENDING",
    },
    razorpayOrderId: { type: String, required: true, index: true },
    razorpayPaymentId: { type: String, default: "" },
    razorpaySignature: { type: String, default: "" },
    deliveryNotes: { type: String, default: "" },
    giftWrap: { type: Boolean, default: false },
    courierName: { type: String, default: "" },
    trackingNumber: { type: String, default: "" },
    estimatedDelivery: { type: String, default: "" },
    timeline: { type: [timelineSchema], default: [] },
    paymentAttempts: { type: [paymentAttemptSchema], default: [] },
  },
  { timestamps: true }
);

const paymentLogSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, index: true },
    orderNumber: { type: String, required: true },
    userId: { type: String, required: true },
    razorpayOrderId: { type: String, default: "" },
    razorpayPaymentId: { type: String, default: "" },
    event: {
      type: String,
      enum: [
        "ORDER_CREATED",
        "PAYMENT_CAPTURED",
        "PAYMENT_FAILED",
        "PAYMENT_CANCELLED",
        "SIGNATURE_MISMATCH",
        "STOCK_VALIDATION_FAILED",
        "IDEMPOTENT_REPLAY",
      ],
      required: true,
    },
    amountPaise: { type: Number, default: 0 },
    mode: { type: String, default: "razorpay_test_simulator" },
    details: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export function createOrdersModels(ordersConn) {
  return {
    Cart:
      ordersConn.models.Cart ||
      ordersConn.model("Cart", cartSchema, "carts"),
    Order:
      ordersConn.models.Order ||
      ordersConn.model("Order", orderSchema, "orders"),
    PaymentLog:
      ordersConn.models.PaymentLog ||
      ordersConn.model("PaymentLog", paymentLogSchema, "payment_logs"),
  };
}
