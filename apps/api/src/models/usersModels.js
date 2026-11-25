import mongoose from "mongoose";

// User explicitly requested: "don't hash the password for users and admin both"
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    wishlist: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.methods.toSafeJSON = function toSafeJSON() {
  return {
    id: String(this._id),
    name: this.name,
    email: this.email,
    phone: this.phone,
    wishlist: this.wishlist || [],
    createdAt: this.createdAt?.toISOString?.() || new Date().toISOString(),
  };
};

const addressSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    line1: { type: String, required: true, trim: true },
    line2: { type: String, default: "", trim: true },
    landmark: { type: String, default: "", trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["Home", "Office", "Studio", "Other"],
      default: "Home",
    },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const stockAlertSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, index: true },
    productName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    userId: { type: String, default: null },
  },
  { timestamps: true }
);

export function createUsersModels(usersConn) {
  return {
    User:
      usersConn.models.User ||
      usersConn.model("User", userSchema, "users"),
    Address:
      usersConn.models.Address ||
      usersConn.model("Address", addressSchema, "addresses"),
    StockAlert:
      usersConn.models.StockAlert ||
      usersConn.model("StockAlert", stockAlertSchema, "stock_alerts"),
  };
}
