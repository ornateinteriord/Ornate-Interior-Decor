import type {
  CartItem,
  CouponRecord,
  OrderStatus,
  PricingSummary,
} from "@ornate/types";

export const FREE_SHIPPING_THRESHOLD = 25000;
export const STANDARD_SHIPPING_FEE = 999;
export const GST_RATE = 0.18;

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatINR(amount: number): string {
  return inrFormatter.format(Math.round(amount || 0));
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function paiseToRupees(paise: number | null | undefined): number {
  if (typeof paise !== "number" || !Number.isFinite(paise)) return 0;
  return Math.round(paise / 100);
}

export function rupeesToPaise(rupees: number | null | undefined): number {
  if (typeof rupees !== "number" || !Number.isFinite(rupees)) return 0;
  return Math.round(rupees * 100);
}

export function formatAttributeKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (ch) => ch.toUpperCase())
    .trim();
}

export function calculateCouponDiscount(
  subtotal: number,
  coupon?: Pick<
    CouponRecord,
    "discountType" | "discountValue" | "minOrderAmount" | "maxDiscountAmount" | "isActive"
  > | null
): number {
  if (!coupon || !coupon.isActive || subtotal < coupon.minOrderAmount) {
    return 0;
  }

  let discount = 0;
  if (coupon.discountType === "percentage") {
    discount = Math.round((subtotal * coupon.discountValue) / 100);
    if (
      typeof coupon.maxDiscountAmount === "number" &&
      coupon.maxDiscountAmount > 0
    ) {
      discount = Math.min(discount, coupon.maxDiscountAmount);
    }
  } else {
    discount = Math.round(coupon.discountValue);
  }

  return Math.min(discount, subtotal);
}

export function calculateCartSummary(
  items: Pick<CartItem, "unitPrice" | "mrp" | "quantity">[],
  coupon?: Pick<
    CouponRecord,
    "code" | "discountType" | "discountValue" | "minOrderAmount" | "maxDiscountAmount" | "isActive"
  > | null
): PricingSummary {
  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const mrpTotal = items.reduce(
    (sum, item) => sum + (item.mrp ?? item.unitPrice) * item.quantity,
    0
  );
  const productSavings = Math.max(0, mrpTotal - subtotal);
  const couponDiscount = calculateCouponDiscount(subtotal, coupon);
  const discountedSubtotal = Math.max(0, subtotal - couponDiscount);
  const shippingFee =
    discountedSubtotal === 0 || discountedSubtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : STANDARD_SHIPPING_FEE;
  const grandTotal = discountedSubtotal + shippingFee;
  const taxableValue = Math.round(discountedSubtotal / (1 + GST_RATE));
  const gstAmount = Math.max(0, discountedSubtotal - taxableValue);

  return {
    subtotal,
    mrpTotal,
    productSavings,
    couponCode: coupon && couponDiscount > 0 ? coupon.code : null,
    couponDiscount,
    shippingFee,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    gstAmount,
    taxableValue,
    grandTotal,
  };
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PAYMENT_PENDING: "Payment Pending",
  PAYMENT_FAILED: "Payment Failed",
  CONFIRMED: "Order Confirmed",
  PACKED: "Packed at Studio",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const ORDER_PROGRESS_STEPS: OrderStatus[] = [
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

export function getApiErrorMessage(err: unknown, fallback: string): string {
  if (typeof err === "object" && err !== null) {
    const record = err as {
      message?: string;
      response?: { data?: { message?: string } };
    };
    if (record.response?.data?.message) {
      return record.response.data.message;
    }
    if (record.message) {
      return record.message;
    }
  }
  return fallback;
}
