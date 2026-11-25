import { Router } from "express";
import multer from "multer";
import { getDatabaseHealth } from "../config/databases.js";
import { env } from "../config/env.js";
import { getModels } from "../models/index.js";
import { requireAdminAuth, signAdminToken } from "../middleware/auth.js";
import {
  clearExternalCache,
  getCombinedCatalog,
  getProductByIdOrSlug,
  restoreOrderStock,
} from "../services/catalogService.js";
import {
  deleteImageFromImageKit,
  getImageKitStatus,
  uploadImageToImageKit,
} from "../services/imagekitService.js";
import { getRazorpayMode } from "../services/paymentService.js";
import { buildPricingFromRupees, paiseToRupees, slugify } from "../utils/pricing.js";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});

async function writeAudit(admin, action, entityType, entityId, summary, metadata = {}) {
  const { AuditLog } = getModels();
  await AuditLog.create({
    adminId: String(admin._id),
    adminEmail: admin.email,
    action,
    entityType,
    entityId: String(entityId || ""),
    summary,
    metadata,
  });
}

router.post("/auth/login", async (req, res, next) => {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();
    const password = String(req.body.password || "");

    const { AdminUser } = getModels();
    const admin = await AdminUser.findOne({ email });
    // Plaintext comparison per explicit user requirement: "don't hash the password for users and admin both"
    if (!admin || admin.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin email or password.",
      });
    }
    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: "Admin account is disabled.",
      });
    }

    const token = signAdminToken(admin);
    res.json({
      success: true,
      data: {
        token,
        admin: admin.toSafeJSON(),
      },
    });
  } catch (err) {
    next(err);
  }
});

router.use(requireAdminAuth);

router.get("/auth/me", (req, res) => {
  res.json({ success: true, data: { admin: req.admin.toSafeJSON() } });
});

router.get("/dashboard", async (_req, res, next) => {
  try {
    const { Order, User, Coupon } = getModels();
    const [catalog, orders, customerCount, activeCoupons, dbHealth] = await Promise.all([
      getCombinedCatalog({ includeHidden: true, includeUnpublished: true }),
      Order.find().sort({ createdAt: -1 }).lean(),
      User.countDocuments(),
      Coupon.countDocuments({ isActive: true }),
      getDatabaseHealth(),
    ]);

    const paidOrders = orders.filter((o) => o.paymentStatus === "PAID");
    const totalRevenue = paidOrders.reduce(
      (sum, o) => sum + (o.pricing?.grandTotal || 0),
      0
    );
    const pendingOrders = orders.filter((o) =>
      ["CONFIRMED", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY"].includes(o.orderStatus)
    ).length;

    const lowStockProducts = catalog.products
      .filter((p) => p.stock <= 5)
      .slice(0, 8)
      .map((p) => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        stock: p.stock,
        source: p.source,
      }));

    res.json({
      success: true,
      data: {
        stats: {
          totalRevenue,
          totalOrders: orders.length,
          paidOrders: paidOrders.length,
          pendingFulfillment: pendingOrders,
          failedPayments: orders.filter((o) => o.paymentStatus === "FAILED").length,
          totalProducts: catalog.products.length,
          localProducts: catalog.meta.localCount,
          externalProducts: catalog.meta.externalCount,
          customerCount,
          activeCoupons,
        },
        lowStockProducts,
        recentOrders: orders.slice(0, 8).map((o) => ({
          id: String(o._id),
          orderNumber: o.orderNumber,
          customerName: o.customer?.name,
          customerEmail: o.customer?.email,
          total: o.pricing?.grandTotal || 0,
          paymentStatus: o.paymentStatus,
          orderStatus: o.orderStatus,
          createdAt: o.createdAt,
        })),
        databases: dbHealth.databases,
        razorpayMode: getRazorpayMode(),
        imagekit: getImageKitStatus(),
      },
    });
  } catch (err) {
    next(err);
  }
});

// Upload image to ImageKit folder Ornate_Firnitures and return URL
router.post("/upload", upload.single("image"), async (req, res, next) => {
  try {
    const fileBuffer = req.file?.buffer;
    const fileName = req.file?.originalname || req.body.fileName;
    const base64Data = req.body.base64Data;

    if (!fileBuffer && !base64Data) {
      return res.status(400).json({
        success: false,
        message: "Provide an image file (field 'image') or base64Data.",
      });
    }

    const uploaded = await uploadImageToImageKit({
      fileBuffer,
      fileName,
      base64Data,
      folder: env.imagekit.folder,
    });

    await writeAudit(
      req.admin,
      "UPLOAD_IMAGE",
      "ImageKit",
      uploaded.fileId,
      `Uploaded image ${uploaded.name} to ${env.imagekit.folder}`,
      { url: uploaded.url }
    );

    res.status(201).json({ success: true, data: uploaded });
  } catch (err) {
    next(err);
  }
});

router.delete("/upload/:fileId", async (req, res, next) => {
  try {
    await deleteImageFromImageKit(req.params.fileId);
    res.json({ success: true, message: "Image removed from ImageKit." });
  } catch (err) {
    next(err);
  }
});

router.get("/products", async (_req, res, next) => {
  try {
    const catalog = await getCombinedCatalog({
      includeHidden: true,
      includeUnpublished: true,
    });
    res.json({ success: true, data: catalog });
  } catch (err) {
    next(err);
  }
});

router.post("/products/refresh-external", async (req, res, next) => {
  try {
    clearExternalCache();
    const catalog = await getCombinedCatalog({
      includeHidden: true,
      includeUnpublished: true,
    });
    await writeAudit(
      req.admin,
      "REFRESH_EXTERNAL",
      "Catalog",
      "SLR00003",
      "Refreshed external API product cache"
    );
    res.json({ success: true, data: catalog });
  } catch (err) {
    next(err);
  }
});

router.post("/products", async (req, res, next) => {
  try {
    const name = String(req.body.name || "").trim();
    const sku = String(req.body.sku || "")
      .trim()
      .toUpperCase();
    const subcategoryName = String(req.body.subcategoryName || "Office Furniture").trim();
    const subcategorySlug = slugify(req.body.subcategorySlug || subcategoryName);

    if (name.length < 2 || !sku) {
      return res.status(400).json({
        success: false,
        message: "Product name and SKU are required.",
      });
    }

    const mrp = Number(req.body.mrp || req.body.sellingPrice || 0);
    const sellingPrice = Number(req.body.sellingPrice || mrp || 0);
    const dealPrice =
      req.body.dealPrice !== undefined && req.body.dealPrice !== null && req.body.dealPrice !== ""
        ? Number(req.body.dealPrice)
        : null;
    const dealActive = Boolean(req.body.dealActive);
    const stock = Math.max(0, Math.floor(Number(req.body.stock ?? 0)));

    if (sellingPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: "Selling price must be greater than 0 INR.",
      });
    }

    const { LocalProduct, Subcategory } = getModels();
    const existingSku = await LocalProduct.findOne({ sku });
    if (existingSku) {
      return res.status(409).json({
        success: false,
        message: `SKU "${sku}" already exists in Ornate DB.`,
      });
    }

    let subDoc = await Subcategory.findOne({ slug: subcategorySlug });
    if (!subDoc) {
      subDoc = await Subcategory.create({
        name: subcategoryName,
        slug: subcategorySlug,
        description: `${subcategoryName} curated by Ornate Interior Decor`,
      });
    }

    const baseSlug = slugify(`${name}-${sku}`);
    const existingSlug = await LocalProduct.findOne({ slug: baseSlug });
    const slug = existingSlug ? `${baseSlug}-${Date.now().toString(36)}` : baseSlug;

    const images = Array.isArray(req.body.images)
      ? req.body.images
          .filter((img) => img && img.url)
          .map((img, idx) => ({
            id: img.id || `${slugify(sku)}-${idx + 1}`,
            url: String(img.url).trim(),
            alt: String(img.alt || name).trim(),
            order: idx,
            fileId: img.fileId ? String(img.fileId) : "",
          }))
      : [];

    const attributes = Array.isArray(req.body.attributes)
      ? req.body.attributes
          .filter((a) => a?.key?.trim() && a?.value?.trim())
          .map((a) => ({ key: a.key.trim(), value: a.value.trim() }))
      : [];

    const created = await LocalProduct.create({
      name,
      slug,
      sku,
      brand: String(req.body.brand || "Ornate Studio").trim(),
      shortDescription: String(req.body.shortDescription || "").trim(),
      longDescription: String(req.body.longDescription || "").trim(),
      subcategoryId: String(subDoc._id),
      subcategoryName: subDoc.name,
      subcategorySlug: subDoc.slug,
      images,
      pricing: buildPricingFromRupees({ mrp, sellingPrice, dealPrice, dealActive }),
      stock,
      attributes,
      dimensions: req.body.dimensions || {},
      status: req.body.status === "inactive" ? "inactive" : "active",
      isPublished: req.body.isPublished !== false,
      isFeatured: Boolean(req.body.isFeatured),
      source: "local",
    });

    await writeAudit(
      req.admin,
      "CREATE_PRODUCT",
      "LocalProduct",
      created._id,
      `Created product ${created.name} (${created.sku})`
    );

    const product = await getProductByIdOrSlug(String(created._id), {
      includeHidden: true,
      includeUnpublished: true,
    });

    res.status(201).json({ success: true, data: { product } });
  } catch (err) {
    next(err);
  }
});

router.patch("/products/:id", async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const { LocalProduct, ExternalOverride, Subcategory } = getModels();

    const localDoc = /^[0-9a-fA-F]{24}$/.test(id)
      ? await LocalProduct.findById(id)
      : null;

    if (localDoc) {
      if (req.body.name !== undefined) localDoc.name = String(req.body.name).trim();
      if (req.body.brand !== undefined) localDoc.brand = String(req.body.brand).trim();
      if (req.body.shortDescription !== undefined) {
        localDoc.shortDescription = String(req.body.shortDescription).trim();
      }
      if (req.body.longDescription !== undefined) {
        localDoc.longDescription = String(req.body.longDescription).trim();
      }
      if (req.body.subcategoryName !== undefined) {
        const sName = String(req.body.subcategoryName).trim();
        const sSlug = slugify(req.body.subcategorySlug || sName);
        let subDoc = await Subcategory.findOne({ slug: sSlug });
        if (!subDoc) {
          subDoc = await Subcategory.create({ name: sName, slug: sSlug });
        }
        localDoc.subcategoryId = String(subDoc._id);
        localDoc.subcategoryName = subDoc.name;
        localDoc.subcategorySlug = subDoc.slug;
      }
      if (req.body.stock !== undefined) {
        localDoc.stock = Math.max(0, Math.floor(Number(req.body.stock)));
      }
      if (req.body.isFeatured !== undefined) localDoc.isFeatured = Boolean(req.body.isFeatured);
      if (req.body.isPublished !== undefined) localDoc.isPublished = Boolean(req.body.isPublished);
      if (req.body.status !== undefined) {
        localDoc.status = req.body.status === "inactive" ? "inactive" : "active";
      }
      if (Array.isArray(req.body.images)) {
        localDoc.images = req.body.images
          .filter((img) => img && img.url)
          .map((img, idx) => ({
            id: img.id || `${slugify(localDoc.sku)}-${idx + 1}`,
            url: String(img.url).trim(),
            alt: String(img.alt || localDoc.name).trim(),
            order: idx,
            fileId: img.fileId ? String(img.fileId) : "",
          }));
      }
      if (Array.isArray(req.body.attributes)) {
        localDoc.attributes = req.body.attributes
          .filter((a) => a?.key?.trim() && a?.value?.trim())
          .map((a) => ({ key: a.key.trim(), value: a.value.trim() }));
      }
      if (
        req.body.mrp !== undefined ||
        req.body.sellingPrice !== undefined ||
        req.body.dealPrice !== undefined ||
        req.body.dealActive !== undefined
      ) {
        const curMrp = paiseToRupees(localDoc.pricing.mrp);
        const curSelling = paiseToRupees(localDoc.pricing.sellingPrice);
        const curDeal =
          localDoc.pricing.dealPrice !== null
            ? paiseToRupees(localDoc.pricing.dealPrice)
            : null;
        localDoc.pricing = buildPricingFromRupees({
          mrp: req.body.mrp !== undefined ? Number(req.body.mrp) : curMrp,
          sellingPrice:
            req.body.sellingPrice !== undefined ? Number(req.body.sellingPrice) : curSelling,
          dealPrice:
            req.body.dealPrice !== undefined
              ? req.body.dealPrice === null || req.body.dealPrice === ""
                ? null
                : Number(req.body.dealPrice)
              : curDeal,
          dealActive:
            req.body.dealActive !== undefined
              ? Boolean(req.body.dealActive)
              : localDoc.pricing.dealActive,
        });
      }

      await localDoc.save();
      await writeAudit(
        req.admin,
        "UPDATE_PRODUCT",
        "LocalProduct",
        localDoc._id,
        `Updated local product ${localDoc.name}`
      );
    } else {
      // External API product override
      const existingExt = await getProductByIdOrSlug(id, {
        includeHidden: true,
        includeUnpublished: true,
      });
      if (!existingExt || existingExt.source !== "external") {
        return res.status(404).json({ success: false, message: "Product not found." });
      }

      const update = {};
      if (req.body.name !== undefined) update.name = String(req.body.name).trim();
      if (req.body.brand !== undefined) update.brand = String(req.body.brand).trim();
      if (req.body.shortDescription !== undefined) {
        update.shortDescription = String(req.body.shortDescription).trim();
      }
      if (req.body.longDescription !== undefined) {
        update.longDescription = String(req.body.longDescription).trim();
      }
      if (req.body.subcategoryName !== undefined) {
        update.subcategoryName = String(req.body.subcategoryName).trim();
        update.subcategorySlug = slugify(req.body.subcategorySlug || update.subcategoryName);
      }
      if (req.body.mrp !== undefined) update.mrp = Number(req.body.mrp);
      if (req.body.sellingPrice !== undefined) update.sellingPrice = Number(req.body.sellingPrice);
      if (req.body.dealPrice !== undefined) {
        update.dealPrice =
          req.body.dealPrice === null || req.body.dealPrice === ""
            ? null
            : Number(req.body.dealPrice);
      }
      if (req.body.dealActive !== undefined) update.dealActive = Boolean(req.body.dealActive);
      if (req.body.stock !== undefined) {
        update.stockOverride = Math.max(0, Math.floor(Number(req.body.stock)));
        update.stockSoldDelta = 0;
      }
      if (req.body.isFeatured !== undefined) update.isFeatured = Boolean(req.body.isFeatured);
      if (req.body.isHidden !== undefined) update.isHidden = Boolean(req.body.isHidden);
      if (req.body.isPublished !== undefined) update.isHidden = !Boolean(req.body.isPublished);
      if (Array.isArray(req.body.images)) {
        update.images = req.body.images
          .filter((img) => img && img.url)
          .map((img, idx) => ({
            id: img.id || `ext-${idx + 1}`,
            url: String(img.url).trim(),
            alt: String(img.alt || existingExt.name).trim(),
            order: idx,
            fileId: img.fileId ? String(img.fileId) : "",
          }));
      }
      if (Array.isArray(req.body.attributes)) {
        update.attributes = req.body.attributes
          .filter((a) => a?.key?.trim() && a?.value?.trim())
          .map((a) => ({ key: a.key.trim(), value: a.value.trim() }));
      }

      await ExternalOverride.findOneAndUpdate(
        { externalId: id },
        { $set: { externalId: id, ...update } },
        { upsert: true, new: true }
      );

      await writeAudit(
        req.admin,
        "OVERRIDE_EXTERNAL_PRODUCT",
        "ExternalOverride",
        id,
        `Updated override for external product ${existingExt.name}`
      );
    }

    const updated = await getProductByIdOrSlug(id, {
      includeHidden: true,
      includeUnpublished: true,
    });
    res.json({ success: true, data: { product: updated } });
  } catch (err) {
    next(err);
  }
});

router.post("/products/:id/reset-override", async (req, res, next) => {
  try {
    const { ExternalOverride } = getModels();
    await ExternalOverride.findOneAndDelete({ externalId: String(req.params.id) });
    await writeAudit(
      req.admin,
      "RESET_EXTERNAL_OVERRIDE",
      "ExternalOverride",
      req.params.id,
      `Reset external product override for ${req.params.id}`
    );
    const product = await getProductByIdOrSlug(String(req.params.id), {
      includeHidden: true,
      includeUnpublished: true,
    });
    res.json({ success: true, data: { product } });
  } catch (err) {
    next(err);
  }
});

router.delete("/products/:id", async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const { LocalProduct } = getModels();
    const localDoc = /^[0-9a-fA-F]{24}$/.test(id)
      ? await LocalProduct.findByIdAndDelete(id)
      : null;

    if (!localDoc) {
      return res.status(404).json({
        success: false,
        message: "Only MongoDB-added products can be permanently deleted. Use hide/override for external API items.",
      });
    }

    await writeAudit(
      req.admin,
      "DELETE_PRODUCT",
      "LocalProduct",
      id,
      `Deleted local product ${localDoc.name} (${localDoc.sku})`
    );
    res.json({ success: true, message: "Product deleted." });
  } catch (err) {
    next(err);
  }
});

router.get("/subcategories", async (_req, res, next) => {
  try {
    const catalog = await getCombinedCatalog({
      includeHidden: true,
      includeUnpublished: true,
    });
    res.json({ success: true, data: catalog.subcategories });
  } catch (err) {
    next(err);
  }
});

router.post("/subcategories", async (req, res, next) => {
  try {
    const name = String(req.body.name || "").trim();
    const slug = slugify(req.body.slug || name);
    const description = String(req.body.description || "").trim();

    if (name.length < 2) {
      return res.status(400).json({ success: false, message: "Subcategory name is required." });
    }

    const { Subcategory } = getModels();
    const existing = await Subcategory.findOne({ slug });
    if (existing) {
      return res.status(409).json({ success: false, message: "Subcategory already exists." });
    }

    const sub = await Subcategory.create({ name, slug, description, isActive: true });
    res.status(201).json({
      success: true,
      data: { id: String(sub._id), name: sub.name, slug: sub.slug, description: sub.description },
    });
  } catch (err) {
    next(err);
  }
});

router.delete("/subcategories/:id", async (req, res, next) => {
  try {
    const { Subcategory } = getModels();
    await Subcategory.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Subcategory removed." });
  } catch (err) {
    next(err);
  }
});

router.get("/orders", async (_req, res, next) => {
  try {
    const { Order } = getModels();
    const docs = await Order.find().sort({ createdAt: -1 }).lean();
    res.json({
      success: true,
      data: docs.map((o) => ({
        ...o,
        id: String(o._id),
      })),
    });
  } catch (err) {
    next(err);
  }
});

router.patch("/orders/:id/status", async (req, res, next) => {
  try {
    const { Order } = getModels();
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    const nextStatus = String(req.body.orderStatus || "").trim();
    const allowed = [
      "PAYMENT_PENDING",
      "PAYMENT_FAILED",
      "CONFIRMED",
      "PACKED",
      "SHIPPED",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "CANCELLED",
    ];
    if (!allowed.includes(nextStatus)) {
      return res.status(400).json({ success: false, message: "Invalid order status." });
    }

    if (nextStatus === "CANCELLED" && order.orderStatus !== "CANCELLED" && order.paymentStatus === "PAID") {
      await restoreOrderStock(order.items);
      order.paymentStatus = "REFUNDED";
    }

    order.orderStatus = nextStatus;
    if (req.body.courierName !== undefined) order.courierName = String(req.body.courierName).trim();
    if (req.body.trackingNumber !== undefined) {
      order.trackingNumber = String(req.body.trackingNumber).trim();
    }
    order.timeline.push({
      status: nextStatus,
      note: String(req.body.note || `Order status updated to ${nextStatus} by studio admin.`),
      timestamp: new Date(),
    });
    await order.save();

    await writeAudit(
      req.admin,
      "UPDATE_ORDER_STATUS",
      "Order",
      order._id,
      `Updated ${order.orderNumber} status to ${nextStatus}`
    );

    res.json({
      success: true,
      data: { ...order.toObject(), id: String(order._id) },
    });
  } catch (err) {
    next(err);
  }
});

router.get("/coupons", async (_req, res, next) => {
  try {
    const { Coupon } = getModels();
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
    res.json({
      success: true,
      data: coupons.map((c) => ({ ...c, id: String(c._id) })),
    });
  } catch (err) {
    next(err);
  }
});

router.post("/coupons", async (req, res, next) => {
  try {
    const code = String(req.body.code || "")
      .trim()
      .toUpperCase();
    const title = String(req.body.title || code).trim();
    const discountType = req.body.discountType === "flat" ? "flat" : "percentage";
    const discountValue = Number(req.body.discountValue || 0);
    const minOrderAmount = Math.max(0, Number(req.body.minOrderAmount || 0));
    const maxDiscountAmount =
      req.body.maxDiscountAmount !== null &&
      req.body.maxDiscountAmount !== undefined &&
      req.body.maxDiscountAmount !== ""
        ? Number(req.body.maxDiscountAmount)
        : null;

    if (!code || discountValue <= 0) {
      return res.status(400).json({
        success: false,
        message: "Coupon code and discount value are required.",
      });
    }

    const { Coupon } = getModels();
    const exists = await Coupon.findOne({ code });
    if (exists) {
      return res.status(409).json({ success: false, message: "Coupon code already exists." });
    }

    const created = await Coupon.create({
      code,
      title,
      description: String(req.body.description || "").trim(),
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      isActive: req.body.isActive !== false,
      expiresAt: req.body.expiresAt ? new Date(req.body.expiresAt) : null,
    });

    res.status(201).json({
      success: true,
      data: { ...created.toObject(), id: String(created._id) },
    });
  } catch (err) {
    next(err);
  }
});

router.patch("/coupons/:id", async (req, res, next) => {
  try {
    const { Coupon } = getModels();
    const updated = await Coupon.findByIdAndUpdate(
      req.params.id,
      { $set: { isActive: Boolean(req.body.isActive) } },
      { new: true }
    ).lean();
    if (!updated) {
      return res.status(404).json({ success: false, message: "Coupon not found." });
    }
    res.json({ success: true, data: { ...updated, id: String(updated._id) } });
  } catch (err) {
    next(err);
  }
});

router.delete("/coupons/:id", async (req, res, next) => {
  try {
    const { Coupon } = getModels();
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Coupon deleted." });
  } catch (err) {
    next(err);
  }
});

router.get("/customers", async (_req, res, next) => {
  try {
    const { User, Address, Order } = getModels();
    const [users, addresses, orders] = await Promise.all([
      User.find().select("-password").sort({ createdAt: -1 }).lean(),
      Address.find().lean(),
      Order.find({ paymentStatus: "PAID" }).lean(),
    ]);

    const addrCountByUser = new Map();
    for (const a of addresses) {
      addrCountByUser.set(a.userId, (addrCountByUser.get(a.userId) || 0) + 1);
    }

    const orderStatsByUser = new Map();
    for (const o of orders) {
      const cur = orderStatsByUser.get(o.userId) || { count: 0, spent: 0 };
      cur.count += 1;
      cur.spent += o.pricing?.grandTotal || 0;
      orderStatsByUser.set(o.userId, cur);
    }

    res.json({
      success: true,
      data: users.map((u) => {
        const uid = String(u._id);
        const stats = orderStatsByUser.get(uid) || { count: 0, spent: 0 };
        return {
          id: uid,
          name: u.name,
          email: u.email,
          phone: u.phone,
          wishlistCount: (u.wishlist || []).length,
          addressCount: addrCountByUser.get(uid) || 0,
          paidOrdersCount: stats.count,
          totalSpent: stats.spent,
          createdAt: u.createdAt,
        };
      }),
    });
  } catch (err) {
    next(err);
  }
});

router.get("/reviews", async (_req, res, next) => {
  try {
    const { Review } = getModels();
    const reviews = await Review.find().sort({ createdAt: -1 }).lean();
    res.json({
      success: true,
      data: reviews.map((r) => ({ ...r, id: String(r._id) })),
    });
  } catch (err) {
    next(err);
  }
});

router.delete("/reviews/:id", async (req, res, next) => {
  try {
    const { Review } = getModels();
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Review deleted." });
  } catch (err) {
    next(err);
  }
});

router.get("/system", async (_req, res, next) => {
  try {
    const { AuditLog, PaymentLog } = getModels();
    const [dbHealth, auditLogs, paymentLogs] = await Promise.all([
      getDatabaseHealth(),
      AuditLog.find().sort({ createdAt: -1 }).limit(25).lean(),
      PaymentLog.find().sort({ createdAt: -1 }).limit(25).lean(),
    ]);

    res.json({
      success: true,
      data: {
        databases: dbHealth,
        imagekit: getImageKitStatus(),
        razorpayMode: getRazorpayMode(),
        externalApiUrl: env.externalProductsApi,
        auditLogs: auditLogs.map((l) => ({ ...l, id: String(l._id) })),
        paymentLogs: paymentLogs.map((l) => ({ ...l, id: String(l._id) })),
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
