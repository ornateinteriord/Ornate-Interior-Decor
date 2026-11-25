import { Router } from "express";
import { getModels } from "../models/index.js";
import { requireCustomerAuth } from "../middleware/auth.js";
import { getCombinedCatalog } from "../services/catalogService.js";
import { calculateOrderPricing, paiseToRupees } from "../utils/pricing.js";

const router = Router();
router.use(requireCustomerAuth);

async function hydrateCart(cartDoc) {
  const { Coupon } = getModels();
  const catalog = await getCombinedCatalog({ includeHidden: false });
  const byId = new Map(catalog.products.map((p) => [p.id, p]));

  const items = [];
  for (const row of cartDoc.items || []) {
    const prod = byId.get(String(row.productId));
    if (!prod) continue;
    const unitPrice = paiseToRupees(prod.pricing?.applicablePrice);
    const mrpInr = paiseToRupees(prod.pricing?.mrp);
    const quantity = Math.max(1, Math.min(row.quantity, Math.max(1, prod.stock)));

    items.push({
      productId: prod.id,
      sku: prod.sku,
      slug: prod.slug,
      name: prod.name,
      brand: prod.brand,
      image: prod.images?.[0]?.url || "",
      subcategoryName: prod.subcategoryName,
      source: prod.source,
      unitPrice,
      mrp: mrpInr > unitPrice ? mrpInr : null,
      quantity,
      stockCount: prod.stock,
      inStock: prod.stock > 0,
    });
  }

  let coupon = null;
  if (cartDoc.couponCode) {
    coupon = await Coupon.findOne({ code: cartDoc.couponCode, isActive: true }).lean();
  }

  const summary = calculateOrderPricing(items, coupon);
  return {
    items,
    couponCode: summary.couponCode,
    summary,
  };
}

async function getOrCreateCart(userId) {
  const { Cart } = getModels();
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [], couponCode: null });
  }
  return cart;
}

router.get("/", async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(String(req.user._id));
    const hydrated = await hydrateCart(cart);
    res.json({ success: true, data: hydrated });
  } catch (err) {
    next(err);
  }
});

router.post("/items", async (req, res, next) => {
  try {
    const productId = String(req.body.productId || "").trim();
    const qtyDelta = Math.max(1, Number(req.body.quantity || 1));

    const catalog = await getCombinedCatalog({ includeHidden: false });
    const product = catalog.products.find((p) => p.id === productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }
    if (product.stock <= 0) {
      return res.status(409).json({ success: false, message: "Product is out of stock." });
    }

    const cart = await getOrCreateCart(String(req.user._id));
    const existing = cart.items.find((i) => i.productId === productId);
    const nextQty = Math.min(product.stock, (existing?.quantity || 0) + qtyDelta);

    if (existing) {
      existing.quantity = nextQty;
    } else {
      cart.items.push({ productId, quantity: nextQty });
    }
    await cart.save();

    res.json({ success: true, data: await hydrateCart(cart) });
  } catch (err) {
    next(err);
  }
});

router.patch("/items/:productId", async (req, res, next) => {
  try {
    const productId = String(req.params.productId);
    const quantity = Number(req.body.quantity);
    const cart = await getOrCreateCart(String(req.user._id));

    if (!Number.isFinite(quantity) || quantity <= 0) {
      cart.items = cart.items.filter((i) => i.productId !== productId);
      await cart.save();
      return res.json({ success: true, data: await hydrateCart(cart) });
    }

    const catalog = await getCombinedCatalog({ includeHidden: false });
    const product = catalog.products.find((p) => p.id === productId);
    if (!product) {
      cart.items = cart.items.filter((i) => i.productId !== productId);
      await cart.save();
      return res.status(404).json({ success: false, message: "Product no longer available." });
    }

    const clamped = Math.min(Math.max(1, Math.floor(quantity)), Math.max(1, product.stock));
    const existing = cart.items.find((i) => i.productId === productId);
    if (existing) {
      existing.quantity = clamped;
    } else {
      cart.items.push({ productId, quantity: clamped });
    }
    await cart.save();

    res.json({ success: true, data: await hydrateCart(cart) });
  } catch (err) {
    next(err);
  }
});

router.delete("/items/:productId", async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(String(req.user._id));
    cart.items = cart.items.filter((i) => i.productId !== String(req.params.productId));
    await cart.save();
    res.json({ success: true, data: await hydrateCart(cart) });
  } catch (err) {
    next(err);
  }
});

router.post("/merge", async (req, res, next) => {
  try {
    const incoming = Array.isArray(req.body.items) ? req.body.items : [];
    const cart = await getOrCreateCart(String(req.user._id));

    if (incoming.length > 0) {
      const catalog = await getCombinedCatalog({ includeHidden: false });
      const byId = new Map(catalog.products.map((p) => [p.id, p]));

      for (const item of incoming) {
        const pid = String(item.productId || "");
        const qty = Math.max(1, Math.floor(Number(item.quantity || 1)));
        const prod = byId.get(pid);
        if (!prod || prod.stock <= 0) continue;

        const existing = cart.items.find((i) => i.productId === pid);
        if (existing) {
          existing.quantity = Math.min(prod.stock, existing.quantity + qty);
        } else {
          cart.items.push({ productId: pid, quantity: Math.min(prod.stock, qty) });
        }
      }
      await cart.save();
    }

    res.json({ success: true, data: await hydrateCart(cart) });
  } catch (err) {
    next(err);
  }
});

router.post("/coupon", async (req, res, next) => {
  try {
    const rawCode = req.body.code ? String(req.body.code).trim().toUpperCase() : null;
    const cart = await getOrCreateCart(String(req.user._id));

    if (!rawCode) {
      cart.couponCode = null;
      await cart.save();
      return res.json({ success: true, data: await hydrateCart(cart) });
    }

    const { Coupon } = getModels();
    const coupon = await Coupon.findOne({ code: rawCode, isActive: true }).lean();
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Invalid or inactive coupon code." });
    }
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return res.status(400).json({ success: false, message: "Coupon has expired." });
    }

    const hydratedBefore = await hydrateCart({ ...cart.toObject(), couponCode: null });
    if (hydratedBefore.summary.subtotal < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Add ₹${(coupon.minOrderAmount - hydratedBefore.summary.subtotal).toLocaleString("en-IN")} more to unlock ${coupon.code}.`,
      });
    }

    cart.couponCode = coupon.code;
    await cart.save();
    res.json({ success: true, data: await hydrateCart(cart) });
  } catch (err) {
    next(err);
  }
});

router.delete("/", async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(String(req.user._id));
    cart.items = [];
    cart.couponCode = null;
    await cart.save();
    res.json({ success: true, data: await hydrateCart(cart) });
  } catch (err) {
    next(err);
  }
});

export default router;
