export type ProductSource = "external" | "local";

export interface ApiProductImage {
  id: string;
  url: string;
  alt: string;
  order: number;
  fileId?: string;
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
  source?: ProductSource;
}

export interface ApiProduct {
  id: string;
  externalId?: string;
  source?: ProductSource;
  hasOverride?: boolean;
  isHidden?: boolean;
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
  averageRating?: number;
  reviewCount?: number;
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
    meta?: {
      externalCount: number;
      localCount: number;
      overriddenCount: number;
      hiddenCount: number;
      externalStatus: "live" | "cached" | "fallback" | "error";
    };
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
  source?: ProductSource;
}

export interface FurnitureProduct {
  id: string;
  externalId?: string;
  source: ProductSource;
  hasOverride: boolean;
  isHidden: boolean;
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
  isPublished: boolean;
  status: string;
  image: string;
  images: ApiProductImage[];
  attributes: ApiProductAttribute[];
  averageRating: number;
  reviewCount: number;
  createdAt: string;
}

export interface FurnitureCatalogResponse {
  sellerName: string;
  storeId: string;
  categoryName: string;
  categorySlug: string;
  subcategories: FurnitureSubcategory[];
  products: FurnitureProduct[];
  meta?: {
    externalCount: number;
    localCount: number;
    overriddenCount: number;
    hiddenCount: number;
    externalStatus: "live" | "cached" | "fallback" | "error";
  };
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

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  wishlist: string[];
  createdAt: string;
}

export type AddressType = "Home" | "Office" | "Studio" | "Other";

export interface UserAddress {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  type: AddressType;
  isDefault: boolean;
}

export interface CartItem {
  productId: string;
  sku: string;
  slug: string;
  name: string;
  brand: string;
  image: string;
  subcategoryName: string;
  source: ProductSource;
  unitPrice: number;
  mrp: number | null;
  quantity: number;
  stockCount: number;
  inStock: boolean;
}

export interface PricingSummary {
  subtotal: number;
  mrpTotal: number;
  productSavings: number;
  couponCode: string | null;
  couponDiscount: number;
  shippingFee: number;
  freeShippingThreshold: number;
  gstAmount: number;
  taxableValue: number;
  grandTotal: number;
}

export type OrderStatus =
  | "PAYMENT_PENDING"
  | "PAYMENT_FAILED"
  | "CONFIRMED"
  | "PACKED"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";

export interface OrderItem {
  productId: string;
  sku: string;
  slug: string;
  name: string;
  brand: string;
  image: string;
  source: ProductSource;
  unitPrice: number;
  mrp: number | null;
  quantity: number;
  lineTotal: number;
}

export interface OrderTimelineEntry {
  status: OrderStatus;
  note: string;
  timestamp: string;
}

export interface PaymentAttempt {
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  method?: string;
  status: "CREATED" | "CAPTURED" | "FAILED" | "CANCELLED" | "SIGNATURE_MISMATCH";
  reason?: string;
  timestamp: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  userId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: Omit<UserAddress, "id" | "isDefault">;
  items: OrderItem[];
  pricing: PricingSummary;
  paymentMethod: "RAZORPAY_ONLINE";
  paymentGatewayMode: "razorpay_live_test" | "razorpay_test_simulator";
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  deliveryNotes?: string;
  giftWrap?: boolean;
  courierName?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  timeline: OrderTimelineEntry[];
  paymentAttempts: PaymentAttempt[];
  createdAt: string;
  updatedAt: string;
}

export interface CouponRecord {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount: number | null;
  isActive: boolean;
  usageCount: number;
  expiresAt?: string | null;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}
