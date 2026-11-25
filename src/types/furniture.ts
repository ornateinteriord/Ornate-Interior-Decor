export interface ApiProductImage {
  id: string;
  url: string;
  alt: string;
  order: number;
}

export interface ApiProductAttribute {
  key: string;
  value: string;
}

export interface ApiPricing {
  applicablePrice: number;
  mrp: number;
  sellingPrice: number;
  dealPrice: number | null;
  dealActive: boolean;
  savingsAmount: number;
  savingsPercent: number;
}

export interface ApiSubcategory {
  id?: string;
  _id?: string;
  name: string;
  slug: string;
  description?: string;
}

export interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  brand?: string;
  shortDescription?: string;
  longDescription?: string;
  categoryId: string;
  categoryName: string;
  subcategoryId: string;
  subcategoryName: string;
  subcategorySlug?: string;
  images?: ApiProductImage[];
  pricing: ApiPricing;
  stock: number;
  attributes?: ApiProductAttribute[];
  status?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  dimensions?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiSellerProductsResponse {
  success: boolean;
  data: {
    storeId: string;
    sellerId: string;
    sellerName: string;
    storeName: string;
    categoryId: string;
    categoryName: string;
    categorySlug: string;
    subcategoryId?: string;
    subcategoryName?: string;
    subcategorySlug?: string;
    subcategories?: ApiSubcategory[];
    products: ApiProduct[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface FurnitureSubcategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface FurnitureProduct {
  id: string;
  sku: string;
  name: string;
  slug: string;
  brand: string;
  shortDescription: string;
  longDescription: string;
  categoryName: string;
  subcategoryId: string;
  subcategoryName: string;
  subcategorySlug: string;
  price: number;
  mrp: number | null;
  sellingPrice: number;
  dealPrice: number | null;
  dealActive: boolean;
  savingsPercent: number;
  currency: "INR";
  inStock: boolean;
  stockCount: number;
  isFeatured: boolean;
  image: string;
  images: ApiProductImage[];
  attributes: ApiProductAttribute[];
  createdAt: string;
}

export interface FurnitureCatalogResponse {
  sellerName: string;
  storeId: string;
  categoryName: string;
  categorySlug: string;
  subcategories: FurnitureSubcategory[];
  products: FurnitureProduct[];
}

export type FurnitureSortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "discount-desc"
  | "newest"
  | "name-asc";

export interface FurnitureFilterState {
  search: string;
  subcategory: string;
  brand: string;
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  dealsOnly: boolean;
  sortBy: FurnitureSortOption;
}
