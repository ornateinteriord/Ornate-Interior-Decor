import { env } from "../config/env.js";
import { getModels } from "../models/index.js";
import { buildPricingFromRupees, paiseToRupees, slugify } from "../utils/pricing.js";

const CACHE_TTL_MS = 60 * 1000;
let externalCache = {
  fetchedAt: 0,
  payload: null,
};

// Built-in fallback snapshot matching SLR00003 if external gateway is temporarily offline
const FALLBACK_EXTERNAL_PAYLOAD = {
  storeId: "SLR00003",
  sellerId: "SLR00003",
  sellerName: "Ornate Interior Decor",
  storeName: "Ornate Interior Decor",
  categoryId: "6b0694386a9fb643728beb6b",
  categoryName: "Furnitures",
  categorySlug: "furnitures",
  products: [],
};

async function fetchExternalSellerData() {
  const now = Date.now();
  if (externalCache.payload && now - externalCache.fetchedAt < CACHE_TTL_MS) {
    return { data: externalCache.payload, status: "cached" };
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(env.externalProductsApi, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!res.ok) {
      throw new Error(`External API responded with ${res.status}`);
    }

    const json = await res.json();
    if (!json?.success || !json?.data) {
      throw new Error("Invalid external catalog payload");
    }

    externalCache = { fetchedAt: now, payload: json.data };
    return { data: json.data, status: "live" };
  } catch (err) {
    if (externalCache.payload) {
      return { data: externalCache.payload, status: "cached" };
    }
    console.warn("[Catalog] External API unreachable, using fallback:", err.message);
    return { data: FALLBACK_EXTERNAL_PAYLOAD, status: "fallback" };
  }
}

export function clearExternalCache() {
  externalCache = { fetchedAt: 0, payload: null };
}

function normalizeExternalProduct(raw, override, fallbackSub, reviewStats) {
  const subName =
    override?.subcategoryName ||
    raw.subcategoryName ||
    fallbackSub.subcategoryName ||
    "Office Furniture";
  const subSlug =
    override?.subcategorySlug ||
    raw.subcategorySlug ||
    slugify(subName);

  const baseMrpInr = paiseToRupees(raw.pricing?.mrp);
  const baseSellingInr = paiseToRupees(raw.pricing?.sellingPrice);
  const baseDealInr =
    raw.pricing?.dealPrice !== null && raw.pricing?.dealPrice !== undefined
      ? paiseToRupees(raw.pricing.dealPrice)
      : null;

  const hasPricingOverride =
    override &&
    (override.mrp !== null ||
      override.sellingPrice !== null ||
      override.dealPrice !== null ||
      override.dealActive !== null);

  const pricing = hasPricingOverride
    ? buildPricingFromRupees({
        mrp: override.mrp ?? baseMrpInr,
        sellingPrice: override.sellingPrice ?? baseSellingInr,
        dealPrice:
          override.dealPrice !== null && override.dealPrice !== undefined
            ? override.dealPrice
            : baseDealInr,
        dealActive:
          override.dealActive !== null && override.dealActive !== undefined
            ? override.dealActive
            : raw.pricing?.dealActive,
      })
    : raw.pricing;

  const baseStock =
    override?.stockOverride !== null && override?.stockOverride !== undefined
      ? override.stockOverride
      : Number(raw.stock ?? 0);
  const soldDelta = Number(override?.stockSoldDelta ?? 0);
  const effectiveStock = Math.max(0, baseStock - soldDelta);

  const images =
    Array.isArray(override?.images) && override.images.length > 0
      ? override.images
      : raw.images || [];

  const attributes =
    Array.isArray(override?.attributes) && override.attributes.length > 0
      ? override.attributes
      : raw.attributes || [];

  const stats = reviewStats.get(String(raw.id)) || { avg: 0, count: 0 };

  return {
    id: String(raw.id),
    externalId: String(raw.id),
    source: "external",
    hasOverride: Boolean(override),
    isHidden: Boolean(override?.isHidden),
    name: override?.name || raw.name,
    slug: raw.slug,
    sku: raw.sku,
    brand: override?.brand || raw.brand || "Ornate Studio",
    shortDescription: override?.shortDescription ?? raw.shortDescription ?? "",
    longDescription:
      override?.longDescription ?? raw.longDescription ?? raw.shortDescription ?? "",
    categoryId: raw.categoryId || fallbackSub.categoryId || "6b0694386a9fb643728beb6b",
    categoryName: raw.categoryName || "Furnitures",
    subcategoryId: raw.subcategoryId || subSlug,
    subcategoryName: subName,
    subcategorySlug: subSlug,
    images,
    pricing,
    stock: effectiveStock,
    attributes,
    dimensions: raw.dimensions || {},
    status: raw.status || "active",
    isPublished: raw.isPublished !== false && !override?.isHidden,
    isFeatured:
      override?.isFeatured !== null && override?.isFeatured !== undefined
        ? override.isFeatured
        : Boolean(raw.isFeatured),
    averageRating: stats.avg,
    reviewCount: stats.count,
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: override?.updatedAt?.toISOString?.() || raw.updatedAt || new Date().toISOString(),
  };
}

function normalizeLocalProduct(doc, reviewStats) {
  const id = String(doc._id);
  const stats = reviewStats.get(id) || { avg: 0, count: 0 };

  return {
    id,
    source: "local",
    hasOverride: false,
    isHidden: false,
    name: doc.name,
    slug: doc.slug,
    sku: doc.sku,
    brand: doc.brand || "Ornate Studio",
    shortDescription: doc.shortDescription || "",
    longDescription: doc.longDescription || doc.shortDescription || "",
    categoryId: doc.categoryId || "6b0694386a9fb643728beb6b",
    categoryName: doc.categoryName || "Furnitures",
    subcategoryId: doc.subcategoryId || doc.subcategorySlug,
    subcategoryName: doc.subcategoryName,
    subcategorySlug: doc.subcategorySlug,
    images: doc.images || [],
    pricing: doc.pricing,
    stock: Math.max(0, Number(doc.stock ?? 0)),
    attributes: doc.attributes || [],
    dimensions: doc.dimensions || {},
    status: doc.status || "active",
    isPublished: doc.isPublished !== false,
    isFeatured: Boolean(doc.isFeatured),
    averageRating: stats.avg,
    reviewCount: stats.count,
    createdAt: doc.createdAt?.toISOString?.() || new Date().toISOString(),
    updatedAt: doc.updatedAt?.toISOString?.() || new Date().toISOString(),
  };
}

export async function getCombinedCatalog({
  includeHidden = false,
  includeUnpublished = false,
} = {}) {
  const { LocalProduct, ExternalOverride, Subcategory, Review } = getModels();

  const [externalResult, localDocs, overrideDocs, dbSubcategories, reviewAgg] =
    await Promise.all([
      fetchExternalSellerData(),
      LocalProduct.find().sort({ createdAt: -1 }).lean(),
      ExternalOverride.find().lean(),
      Subcategory.find({ isActive: true }).sort({ name: 1 }).lean(),
      Review.aggregate([
        { $match: { isApproved: true } },
        {
          $group: {
            _id: "$productId",
            avgRating: { $avg: "$rating" },
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

  const reviewStats = new Map();
  for (const row of reviewAgg) {
    reviewStats.set(String(row._id), {
      avg: Math.round((row.avgRating || 0) * 10) / 10,
      count: row.count || 0,
    });
  }

  const overrideMap = new Map(overrideDocs.map((o) => [String(o.externalId), o]));
  const extData = externalResult.data || FALLBACK_EXTERNAL_PAYLOAD;
  const fallbackSub = {
    categoryId: extData.categoryId,
    subcategoryId: extData.subcategoryId,
    subcategoryName: extData.subcategoryName,
    subcategorySlug: extData.subcategorySlug,
  };

  const externalProductsAll = (extData.products || []).map((raw) =>
    normalizeExternalProduct(
      raw,
      overrideMap.get(String(raw.id)),
      fallbackSub,
      reviewStats
    )
  );

  const localProductsAll = localDocs.map((doc) =>
    normalizeLocalProduct(doc, reviewStats)
  );

  // Merge local (MongoDB) first, then external API items
  const combinedAll = [...localProductsAll, ...externalProductsAll];

  const filteredProducts = combinedAll.filter((product) => {
    if (!includeHidden && product.isHidden) return false;
    if (!includeUnpublished && (product.status === "inactive" || !product.isPublished)) {
      return false;
    }
    return true;
  });

  // Combine subcategories from DB + active products
  const subcategoryMap = new Map();
  for (const sub of dbSubcategories) {
    subcategoryMap.set(sub.slug, {
      id: String(sub._id),
      name: sub.name,
      slug: sub.slug,
      description: sub.description || "",
      source: "local",
    });
  }
  for (const prod of filteredProducts) {
    if (!subcategoryMap.has(prod.subcategorySlug)) {
      subcategoryMap.set(prod.subcategorySlug, {
        id: prod.subcategoryId,
        name: prod.subcategoryName,
        slug: prod.subcategorySlug,
        source: prod.source,
      });
    }
  }

  return {
    storeId: extData.storeId || "SLR00003",
    sellerId: extData.sellerId || "SLR00003",
    sellerName: extData.sellerName || "Ornate Interior Decor",
    storeName: extData.storeName || "Ornate Interior Decor",
    categoryId: extData.categoryId || "6b0694386a9fb643728beb6b",
    categoryName: extData.categoryName || "Furnitures",
    categorySlug: extData.categorySlug || "furnitures",
    subcategories: Array.from(subcategoryMap.values()),
    products: filteredProducts,
    meta: {
      externalCount: externalProductsAll.length,
      localCount: localProductsAll.length,
      overriddenCount: overrideDocs.length,
      hiddenCount: externalProductsAll.filter((p) => p.isHidden).length,
      externalStatus: externalResult.status,
    },
  };
}

export async function getProductByIdOrSlug(identifier, options = {}) {
  const catalog = await getCombinedCatalog(options);
  return (
    catalog.products.find(
      (p) => p.id === identifier || p.slug === identifier || p.sku === identifier
    ) || null
  );
}

export async function validateAndDeductStock(orderItems) {
  const catalog = await getCombinedCatalog({ includeHidden: false });
  const byId = new Map(catalog.products.map((p) => [p.id, p]));

  for (const item of orderItems) {
    const prod = byId.get(String(item.productId));
    if (!prod) {
      return {
        ok: false,
        reason: `Product "${item.name}" is no longer available.`,
      };
    }
    if (prod.stock < item.quantity) {
      return {
        ok: false,
        reason: `Only ${prod.stock} unit(s) left in stock for "${prod.name}".`,
      };
    }
  }

  const { LocalProduct, ExternalOverride } = getModels();

  for (const item of orderItems) {
    const prod = byId.get(String(item.productId));
    if (prod.source === "local") {
      const updated = await LocalProduct.findOneAndUpdate(
        { _id: prod.id, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
      if (!updated) {
        return {
          ok: false,
          reason: `Insufficient stock while reserving "${prod.name}".`,
        };
      }
    } else {
      await ExternalOverride.findOneAndUpdate(
        { externalId: prod.id },
        {
          $setOnInsert: { externalId: prod.id },
          $inc: { stockSoldDelta: item.quantity },
        },
        { upsert: true, new: true }
      );
    }
  }

  return { ok: true };
}

export async function restoreOrderStock(orderItems) {
  const { LocalProduct, ExternalOverride } = getModels();

  for (const item of orderItems) {
    if (item.source === "local") {
      await LocalProduct.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity },
      });
    } else {
      await ExternalOverride.findOneAndUpdate(
        { externalId: item.productId },
        { $inc: { stockSoldDelta: -item.quantity } }
      );
    }
  }
}
