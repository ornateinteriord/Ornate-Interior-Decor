import { Router } from "express";
import { getModels } from "../models/index.js";
import { optionalCustomerAuth, requireCustomerAuth } from "../middleware/auth.js";
import {
  getCombinedCatalog,
  getProductByIdOrSlug,
} from "../services/catalogService.js";
import { calculateCouponDiscount } from "../utils/pricing.js";

const router = Router();

router.get("/products", async (_req, res, next) => {
  try {
    const catalog = await getCombinedCatalog({ includeHidden: false });
    res.json({ success: true, data: catalog });
  } catch (err) {
    next(err);
  }
});

// Backwards-compatible seller path used by the original storefront
router.get("/v1/seller/SLR00003/products", async (_req, res, next) => {
  try {
    const catalog = await getCombinedCatalog({ includeHidden: false });
    res.json({ success: true, data: catalog });
  } catch (err) {
    next(err);
  }
});

router.get("/products/:identifier", async (req, res, next) => {
  try {
    const product = await getProductByIdOrSlug(req.params.identifier, {
      includeHidden: false,
    });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const { Review } = getModels();
    const reviews = await Review.find({
      productId: product.id,
      isApproved: true,
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: {
        product,
        reviews: reviews.map((r) => ({
          id: String(r._id),
          productId: r.productId,
          userId: r.userId,
          userName: r.userName,
          rating: r.rating,
          title: r.title,
          comment: r.comment,
          verifiedPurchase: r.verifiedPurchase,
          createdAt: r.createdAt,
        })),
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get("/products/:productId/reviews", async (req, res, next) => {
  try {
    const { Review } = getModels();
    const reviews = await Review.find({
      productId: req.params.productId,
      isApproved: true,
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: reviews.map((r) => ({
        id: String(r._id),
        productId: r.productId,
        userId: r.userId,
        userName: r.userName,
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        verifiedPurchase: r.verifiedPurchase,
        createdAt: r.createdAt,
      })),
    });
  } catch (err) {
    next(err);
  }
});

router.post("/products/:productId/reviews", requireCustomerAuth, async (req, res, next) => {
  try {
    const product = await getProductByIdOrSlug(req.params.productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    const rating = Number(req.body.rating);
    const title = String(req.body.title || "").trim();
    const comment = String(req.body.comment || "").trim();

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be a whole number from 1 to 5.",
      });
    }
    if (title.length < 3 || comment.length < 5) {
      return res.status(400).json({
        success: false,
        message: "Please provide a short review headline and comment.",
      });
    }

    const { Order, Review } = getModels();
    const paidOrder = await Order.findOne({
      userId: String(req.user._id),
      paymentStatus: "PAID",
      "items.productId": product.id,
    }).lean();

    const review = await Review.findOneAndUpdate(
      { productId: product.id, userId: String(req.user._id) },
      {
        productId: product.id,
        productSlug: product.slug,
        userId: String(req.user._id),
        userName: req.user.name,
        rating,
        title,
        comment,
        verifiedPurchase: Boolean(paidOrder),
        isApproved: true,
      },
      { upsert: true, new: true }
    );

    res.status(201).json({
      success: true,
      data: {
        id: String(review._id),
        productId: review.productId,
        userId: review.userId,
        userName: review.userName,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        verifiedPurchase: review.verifiedPurchase,
        createdAt: review.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post("/products/:productId/stock-alert", optionalCustomerAuth, async (req, res, next) => {
  try {
    const email = String(req.body.email || req.user?.email || "")
      .trim()
      .toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address for stock alerts.",
      });
    }

    const product = await getProductByIdOrSlug(req.params.productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    const { StockAlert } = getModels();
    await StockAlert.findOneAndUpdate(
      { productId: product.id, email },
      {
        productId: product.id,
        productName: product.name,
        email,
        userId: req.user ? String(req.user._id) : null,
      },
      { upsert: true }
    );

    res.json({
      success: true,
      message: `We'll notify ${email} when "${product.name}" is restocked.`,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/coupons/active", async (_req, res, next) => {
  try {
    const { Coupon } = getModels();
    const now = new Date();
    const coupons = await Coupon.find({
      isActive: true,
      $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
    })
      .sort({ minOrderAmount: 1 })
      .lean();

    res.json({
      success: true,
      data: coupons.map((c) => ({
        id: String(c._id),
        code: c.code,
        title: c.title,
        description: c.description,
        discountType: c.discountType,
        discountValue: c.discountValue,
        minOrderAmount: c.minOrderAmount,
        maxDiscountAmount: c.maxDiscountAmount,
        isActive: c.isActive,
        usageCount: c.usageCount,
        expiresAt: c.expiresAt,
      })),
    });
  } catch (err) {
    next(err);
  }
});

router.post("/coupons/validate", async (req, res, next) => {
  try {
    const code = String(req.body.code || "")
      .trim()
      .toUpperCase();
    const subtotal = Number(req.body.subtotal || 0);

    if (!code) {
      return res.status(400).json({ success: false, message: "Coupon code is required." });
    }

    const { Coupon } = getModels();
    const coupon = await Coupon.findOne({ code, isActive: true }).lean();
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Invalid or inactive coupon code." });
    }
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return res.status(400).json({ success: false, message: "This coupon has expired." });
    }
    if (subtotal < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order value of ₹${coupon.minOrderAmount.toLocaleString("en-IN")} required for ${coupon.code}.`,
      });
    }

    const discountAmount = calculateCouponDiscount(subtotal, coupon);
    res.json({
      success: true,
      data: {
        code: coupon.code,
        title: coupon.title,
        discountAmount,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get("/delivery/check", (req, res) => {
  const pincode = String(req.query.pincode || "").trim();
  if (!/^\d{6}$/.test(pincode)) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid 6-digit Indian pincode.",
    });
  }

  const isBengaluru = pincode.startsWith("560");
  const isKarnataka = pincode.startsWith("56") || pincode.startsWith("57") || pincode.startsWith("58") || pincode.startsWith("59");

  res.json({
    success: true,
    data: {
      pincode,
      serviceable: true,
      zone: isBengaluru
        ? "Bengaluru Metro Studio Fleet"
        : isKarnataka
        ? "Karnataka Priority Freight"
        : "Pan-India Insured Furniture Freight",
      estimatedDays: isBengaluru ? "2–4 business days" : isKarnataka ? "4–6 business days" : "6–9 business days",
      freeInstallation: isBengaluru,
      note: isBengaluru
        ? "Includes complimentary white-glove delivery & assembly by Ornate Vijayanagar team."
        : "Delivered in custom protective crating with assembly guide & video assistance.",
    },
  });
});

export default router;
