import axios from "axios";
import { paiseToRupees, slugify } from "@ornate/utils";
import type {
  ApiProduct,
  ApiSellerProductsResponse,
  FurnitureCatalogResponse,
  FurnitureProduct,
  FurnitureSubcategory,
} from "@/types/furniture";

const COMBINED_PRODUCTS_PATH = "/api/products";
const FALLBACK_SELLER_PATH = "/api/v1/seller/SLR00003/products";
const PROD_EXTERNAL_API_BASE = "https://api-geteway.vercel.app";
export const LOCAL_API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:4000";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=900&auto=format&fit=crop";

export const furnitureApiClient = axios.create({
  timeout: 12000,
  headers: {
    Accept: "application/json",
  },
});

export function normalizeProduct(
  raw: ApiProduct,
  fallbackSubcategory?: { id?: string; name?: string; slug?: string }
): FurnitureProduct {
  const sortedImages = [...(raw.images ?? [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  const subSlug =
    raw.subcategorySlug ||
    (raw.subcategoryId && raw.subcategoryId === fallbackSubcategory?.id
      ? fallbackSubcategory.slug
      : undefined) ||
    slugify(raw.subcategoryName || fallbackSubcategory?.name || "furnitures");

  const applicableInr = paiseToRupees(raw.pricing?.applicablePrice);
  const mrpInr = paiseToRupees(raw.pricing?.mrp);
  const sellingInr = paiseToRupees(raw.pricing?.sellingPrice);
  const dealInr =
    raw.pricing?.dealPrice !== null && raw.pricing?.dealPrice !== undefined
      ? paiseToRupees(raw.pricing.dealPrice)
      : null;

  return {
    id: raw.id,
    externalId: raw.externalId,
    source: raw.source || "external",
    hasOverride: Boolean(raw.hasOverride),
    isHidden: Boolean(raw.isHidden),
    sku: raw.sku,
    name: raw.name,
    slug: raw.slug,
    brand: raw.brand?.trim() || "Ornate Studio",
    shortDescription: raw.shortDescription?.trim() || "",
    longDescription:
      raw.longDescription?.trim() || raw.shortDescription?.trim() || "",
    categoryName: raw.categoryName || "Furnitures",
    subcategoryId: raw.subcategoryId || fallbackSubcategory?.id || subSlug,
    subcategoryName:
      raw.subcategoryName || fallbackSubcategory?.name || "Furnitures",
    subcategorySlug: subSlug,
    price: applicableInr,
    mrp: mrpInr > applicableInr ? mrpInr : null,
    sellingPrice: sellingInr,
    dealPrice: dealInr,
    dealActive: Boolean(raw.pricing?.dealActive),
    savingsPercent: raw.pricing?.savingsPercent ?? 0,
    currency: "INR",
    inStock: (raw.stock ?? 0) > 0,
    stockCount: raw.stock ?? 0,
    isFeatured: Boolean(raw.isFeatured),
    isPublished: raw.isPublished !== false,
    status: raw.status || "active",
    image: sortedImages[0]?.url || FALLBACK_IMAGE,
    images: sortedImages,
    attributes: raw.attributes ?? [],
    averageRating: raw.averageRating ?? 0,
    reviewCount: raw.reviewCount ?? 0,
    createdAt: raw.createdAt ?? "",
  };
}

function extractSubcategories(
  data: ApiSellerProductsResponse["data"],
  products: FurnitureProduct[]
): FurnitureSubcategory[] {
  if (Array.isArray(data.subcategories) && data.subcategories.length > 0) {
    return data.subcategories.map((sub) => ({
      id: sub.id ?? sub._id ?? sub.slug,
      name: sub.name,
      slug: sub.slug || slugify(sub.name),
      description: sub.description,
      source: sub.source,
    }));
  }

  const bySlug = new Map<string, FurnitureSubcategory>();
  for (const product of products) {
    if (!bySlug.has(product.subcategorySlug)) {
      bySlug.set(product.subcategorySlug, {
        id: product.subcategoryId,
        name: product.subcategoryName,
        slug: product.subcategorySlug,
      });
    }
  }

  if (bySlug.size === 0 && data.subcategoryName) {
    const slug = data.subcategorySlug || slugify(data.subcategoryName);
    bySlug.set(slug, {
      id: data.subcategoryId ?? slug,
      name: data.subcategoryName,
      slug,
    });
  }

  return Array.from(bySlug.values());
}

function normalizeSellerCatalog(
  payload: ApiSellerProductsResponse
): FurnitureCatalogResponse {
  const data = payload.data;
  const fallbackSub = {
    id: data.subcategoryId,
    name: data.subcategoryName,
    slug: data.subcategorySlug,
  };

  const activeProducts = (data.products ?? [])
    .filter((p) => p.status !== "inactive" && p.isPublished !== false && !p.isHidden)
    .map((p) => normalizeProduct(p, fallbackSub));

  const subcategories = extractSubcategories(data, activeProducts);

  return {
    sellerName: data.sellerName || data.storeName || "Ornate Interior Decor",
    storeId: data.storeId || "SLR00003",
    categoryName: data.categoryName || "Furnitures",
    categorySlug: data.categorySlug || "furnitures",
    subcategories,
    products: activeProducts,
    meta: data.meta,
  };
}

/**
 * Fetches the combined MongoDB + external SLR00003 catalog from the Node+Express API.
 * Falls back to direct Vercel external gateway if local API isn't running.
 */
export async function fetchFurnitureCatalog(): Promise<FurnitureCatalogResponse> {
  try {
    const { data } = await furnitureApiClient.get<ApiSellerProductsResponse>(
      `${LOCAL_API_BASE_URL}${COMBINED_PRODUCTS_PATH}`
    );
    return normalizeSellerCatalog(data);
  } catch {
    const { data } = await furnitureApiClient.get<ApiSellerProductsResponse>(
      `${PROD_EXTERNAL_API_BASE}${FALLBACK_SELLER_PATH}`
    );
    return normalizeSellerCatalog(data);
  }
}
