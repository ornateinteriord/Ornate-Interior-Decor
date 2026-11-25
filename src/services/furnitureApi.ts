import axios from "axios";
import type {
  ApiProduct,
  ApiSellerProductsResponse,
  FurnitureCatalogResponse,
  FurnitureProduct,
  FurnitureSubcategory,
} from "@/types/furniture";

const SELLER_PRODUCTS_PATH = "/api/v1/seller/SLR00003/products";
const PROD_API_BASE_URL = "https://api-geteway.vercel.app";
const LOCAL_API_BASE_URL = "http://localhost:4000";

const CONFIGURED_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim();

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=900&auto=format&fit=crop";

export const furnitureApiClient = axios.create({
  timeout: 12000,
  headers: {
    Accept: "application/json",
  },
});

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function paiseToRupees(paise: number | null | undefined): number {
  if (typeof paise !== "number" || !Number.isFinite(paise)) return 0;
  return Math.round(paise / 100);
}

function normalizeProduct(
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
    sku: raw.sku,
    name: raw.name,
    slug: raw.slug,
    brand: raw.brand?.trim() || "Ornate Studio",
    shortDescription: raw.shortDescription?.trim() || "",
    longDescription: raw.longDescription?.trim() || raw.shortDescription?.trim() || "",
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
    image: sortedImages[0]?.url || FALLBACK_IMAGE,
    images: sortedImages,
    attributes: raw.attributes ?? [],
    createdAt: raw.createdAt ?? "",
  };
}

function extractSubcategories(
  data: ApiSellerProductsResponse["data"],
  products: FurnitureProduct[]
): FurnitureSubcategory[] {
  // Prefer explicit subcategories array if backend provides it
  if (Array.isArray(data.subcategories) && data.subcategories.length > 0) {
    return data.subcategories.map((sub) => ({
      id: sub.id ?? sub._id ?? sub.slug,
      name: sub.name,
      slug: sub.slug || slugify(sub.name),
      description: sub.description,
    }));
  }

  // Otherwise derive unique subcategories present in the returned products
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

  // Fallback to top-level seller subcategory when products array is empty
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
    .filter((p) => p.status !== "inactive" && p.isPublished !== false)
    .map((p) => normalizeProduct(p, fallbackSub));

  const subcategories = extractSubcategories(data, activeProducts);

  return {
    sellerName: data.sellerName || data.storeName || "Ornate Interior Decor",
    storeId: data.storeId || "SLR00003",
    categoryName: data.categoryName || "Furnitures",
    categorySlug: data.categorySlug || "furnitures",
    subcategories,
    products: activeProducts,
  };
}

/**
 * Fetches seller SLR00003 furniture products from the backend API.
 * Uses VITE_API_BASE_URL if provided; in local dev tries localhost:4000 first and falls back to Vercel gateway.
 */
export async function fetchFurnitureCatalog(): Promise<FurnitureCatalogResponse> {
  if (CONFIGURED_BASE_URL) {
    const { data } = await furnitureApiClient.get<ApiSellerProductsResponse>(
      `${CONFIGURED_BASE_URL}${SELLER_PRODUCTS_PATH}`
    );
    return normalizeSellerCatalog(data);
  }

  if (import.meta.env.DEV) {
    try {
      const { data } = await furnitureApiClient.get<ApiSellerProductsResponse>(
        `${LOCAL_API_BASE_URL}${SELLER_PRODUCTS_PATH}`,
        { timeout: 3000 }
      );
      return normalizeSellerCatalog(data);
    } catch {
      const { data } = await furnitureApiClient.get<ApiSellerProductsResponse>(
        `${PROD_API_BASE_URL}${SELLER_PRODUCTS_PATH}`
      );
      return normalizeSellerCatalog(data);
    }
  }

  const { data } = await furnitureApiClient.get<ApiSellerProductsResponse>(
    `${PROD_API_BASE_URL}${SELLER_PRODUCTS_PATH}`
  );
  return normalizeSellerCatalog(data);
}
