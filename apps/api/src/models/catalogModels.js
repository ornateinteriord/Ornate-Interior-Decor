import mongoose from "mongoose";

const productImageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    url: { type: String, required: true },
    alt: { type: String, default: "" },
    order: { type: Number, default: 0 },
    fileId: { type: String, default: "" },
  },
  { _id: false }
);

const attributeSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const pricingSchema = new mongoose.Schema(
  {
    applicablePrice: { type: Number, required: true, min: 0 },
    mrp: { type: Number, required: true, min: 0 },
    sellingPrice: { type: Number, required: true, min: 0 },
    dealPrice: { type: Number, default: null },
    dealActive: { type: Boolean, default: false },
    savingsAmount: { type: Number, default: 0 },
    savingsPercent: { type: Number, default: 0 },
  },
  { _id: false }
);

const localProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    sku: { type: String, required: true, unique: true, trim: true },
    brand: { type: String, default: "Ornate Studio", trim: true },
    shortDescription: { type: String, default: "", trim: true },
    longDescription: { type: String, default: "", trim: true },
    categoryId: { type: String, default: "6b0694386a9fb643728beb6b" },
    categoryName: { type: String, default: "Furnitures" },
    subcategoryId: { type: String, required: true },
    subcategoryName: { type: String, required: true, trim: true },
    subcategorySlug: { type: String, required: true, trim: true },
    images: { type: [productImageSchema], default: [] },
    pricing: { type: pricingSchema, required: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    attributes: { type: [attributeSchema], default: [] },
    dimensions: { type: mongoose.Schema.Types.Mixed, default: {} },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    isPublished: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    source: { type: String, default: "local" },
  },
  { timestamps: true }
);

const externalOverrideSchema = new mongoose.Schema(
  {
    externalId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, default: null },
    brand: { type: String, default: null },
    shortDescription: { type: String, default: null },
    longDescription: { type: String, default: null },
    subcategoryName: { type: String, default: null },
    subcategorySlug: { type: String, default: null },
    images: { type: [productImageSchema], default: null },
    attributes: { type: [attributeSchema], default: null },
    mrp: { type: Number, default: null },
    sellingPrice: { type: Number, default: null },
    dealPrice: { type: Number, default: null },
    dealActive: { type: Boolean, default: null },
    stockOverride: { type: Number, default: null },
    stockSoldDelta: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: null },
    isHidden: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const subcategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "", trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    discountType: { type: String, enum: ["percentage", "flat"], required: true },
    discountValue: { type: Number, required: true, min: 1 },
    minOrderAmount: { type: Number, default: 0, min: 0 },
    maxDiscountAmount: { type: Number, default: null },
    isActive: { type: Boolean, default: true },
    usageCount: { type: Number, default: 0 },
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const reviewSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, index: true },
    productSlug: { type: String, required: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true },
    comment: { type: String, required: true, trim: true },
    verifiedPurchase: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export function createCatalogModels(catalogConn) {
  return {
    LocalProduct:
      catalogConn.models.LocalProduct ||
      catalogConn.model("LocalProduct", localProductSchema, "products"),
    ExternalOverride:
      catalogConn.models.ExternalOverride ||
      catalogConn.model("ExternalOverride", externalOverrideSchema, "external_overrides"),
    Subcategory:
      catalogConn.models.Subcategory ||
      catalogConn.model("Subcategory", subcategorySchema, "subcategories"),
    Coupon:
      catalogConn.models.Coupon ||
      catalogConn.model("Coupon", couponSchema, "coupons"),
    Review:
      catalogConn.models.Review ||
      catalogConn.model("Review", reviewSchema, "reviews"),
  };
}
