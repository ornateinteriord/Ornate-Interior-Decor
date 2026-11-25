export const FREE_SHIPPING_THRESHOLD = 25000;
export const STANDARD_SHIPPING_FEE = 999;
export const GST_RATE = 0.18;

export function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function paiseToRupees(paise) {
  if (typeof paise !== "number" || !Number.isFinite(paise)) return 0;
  return Math.round(paise / 100);
}

export function rupeesToPaise(rupees) {
  if (typeof rupees !== "number" || !Number.isFinite(rupees)) return 0;
  return Math.round(rupees * 100);
}

export function buildPricingFromRupees({ mrp, sellingPrice, dealPrice, dealActive }) {
  const safeMrp = Math.max(0, Number(mrp) || Number(sellingPrice) || 0);
  const safeSelling = Math.max(0, Number(sellingPrice) || safeMrp);
  const hasDeal = Boolean(dealActive) && Number(dealPrice) > 0 && Number(dealPrice) < safeSelling;
  const applicableInr = hasDeal ? Number(dealPrice) : safeSelling;
  const effectiveMrp = Math.max(safeMrp, applicableInr);
  const savingsInr = Math.max(0, effectiveMrp - applicableInr);
  const savingsPercent =
    effectiveMrp > 0 ? Math.round((savingsInr / effectiveMrp) * 100) : 0;

  return {
    applicablePrice: rupeesToPaise(applicableInr),
    mrp: rupeesToPaise(effectiveMrp),
    sellingPrice: rupeesToPaise(safeSelling),
    dealPrice: hasDeal ? rupeesToPaise(Number(dealPrice)) : null,
    dealActive: hasDeal,
    savingsAmount: rupeesToPaise(savingsInr),
    savingsPercent,
  };
}

export function calculateCouponDiscount(subtotal, coupon) {
  if (!coupon || !coupon.isActive) return 0;
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) return 0;
  if (subtotal < (coupon.minOrderAmount || 0)) return 0;

  let discount = 0;
  if (coupon.discountType === "percentage") {
    discount = Math.round((subtotal * coupon.discountValue) / 100);
    if (coupon.maxDiscountAmount && coupon.maxDiscountAmount > 0) {
      discount = Math.min(discount, coupon.maxDiscountAmount);
    }
  } else {
    discount = Math.round(coupon.discountValue);
  }

  return Math.min(discount, subtotal);
}

export function calculateOrderPricing(items, coupon = null) {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
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

export function generateOrderNumber() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `ORD-${y}${m}${d}-${rand}`;
}
