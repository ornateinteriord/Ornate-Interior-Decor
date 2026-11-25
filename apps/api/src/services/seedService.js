import { env } from "../config/env.js";
import { getModels } from "../models/index.js";

const STARTER_SUBCATEGORIES = [
  {
    name: "Office Furniture",
    slug: "office-furniture",
    description: "Ergonomic seating, executive desks, and modular studio workstations.",
  },
  {
    name: "Living Room Furniture",
    slug: "living-room-furniture",
    description: "Sofas, accent armchairs, coffee tables, and media consoles.",
  },
  {
    name: "Bedroom Furniture",
    slug: "bedroom-furniture",
    description: "Platform beds, nightstands, dressers, and wardrobe systems.",
  },
  {
    name: "Dining Room Furniture",
    slug: "dining-room-furniture",
    description: "Solid wood dining tables, upholstered chairs, and crockery units.",
  },
  {
    name: "Storage Furniture",
    slug: "storage-furniture",
    description: "Sideboards, bookcases, display cabinets, and filing pedestals.",
  },
];

const STARTER_COUPONS = [
  {
    code: "ORNATE10",
    title: "10% Studio Privilege",
    description: "Get 10% off up to ₹5,000 on orders above ₹5,000.",
    discountType: "percentage",
    discountValue: 10,
    minOrderAmount: 5000,
    maxDiscountAmount: 5000,
    isActive: true,
  },
  {
    code: "WELCOME1000",
    title: "Flat ₹1,000 Off",
    description: "Save ₹1,000 instantly on your order above ₹10,000.",
    discountType: "flat",
    discountValue: 1000,
    minOrderAmount: 10000,
    maxDiscountAmount: null,
    isActive: true,
  },
  {
    code: "STUDIO15",
    title: "15% Architecture Offer",
    description: "Save 15% up to ₹7,500 on furniture orders ₹20,000 & above.",
    discountType: "percentage",
    discountValue: 15,
    minOrderAmount: 20000,
    maxDiscountAmount: 7500,
    isActive: true,
  },
];

export async function seedInitialData() {
  const { AdminUser, Subcategory, Coupon } = getModels();

  // Seed one default admin in ornate_admin database (plain password as requested)
  const existingAdmin = await AdminUser.findOne({
    email: env.defaultAdmin.email.toLowerCase(),
  });
  if (!existingAdmin) {
    await AdminUser.create({
      name: env.defaultAdmin.name,
      email: env.defaultAdmin.email.toLowerCase(),
      password: env.defaultAdmin.password,
      role: "superadmin",
      isActive: true,
    });
    console.log(
      `[Seed] Default admin created in ${env.dbNames.admin}: ${env.defaultAdmin.email}`
    );
  }

  const subCount = await Subcategory.countDocuments();
  if (subCount === 0) {
    await Subcategory.insertMany(STARTER_SUBCATEGORIES);
  }

  const couponCount = await Coupon.countDocuments();
  if (couponCount === 0) {
    await Coupon.insertMany(STARTER_COUPONS);
  }
}
