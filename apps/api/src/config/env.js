import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const env = {
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || "development",
  mongodbUri:
    process.env.MONGODB_URI ||
    "mongodb+srv://ornateinteriord_db_user:ca3bBXtakrgwY5PI@cluster0.siv9bnk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  dbNames: {
    catalog: process.env.DB_CATALOG || "ornate_catalog",
    users: process.env.DB_USERS || "ornate_users",
    orders: process.env.DB_ORDERS || "ornate_orders",
    admin: process.env.DB_ADMIN || "ornate_admin",
  },
  jwtSecret: process.env.JWT_SECRET || "ornate_customer_jwt_secret_2026",
  adminJwtSecret: process.env.ADMIN_JWT_SECRET || "ornate_admin_jwt_secret_2026",
  defaultAdmin: {
    name: process.env.DEFAULT_ADMIN_NAME || "Ornate Studio Admin",
    email: process.env.DEFAULT_ADMIN_EMAIL || "admin@ornateinteriordecor.com",
    password: process.env.DEFAULT_ADMIN_PASSWORD || "OrnateAdmin@2026",
  },
  externalProductsApi:
    process.env.EXTERNAL_PRODUCTS_API ||
    "https://api-geteway.vercel.app/api/v1/seller/SLR00003/products",
  imagekit: {
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "",
    folder: process.env.IMAGEKIT_FOLDER || "Ornate_Firnitures",
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID?.trim() || "",
    keySecret: process.env.RAZORPAY_KEY_SECRET?.trim() || "",
    simulatorSecret:
      process.env.RAZORPAY_TEST_SIMULATOR_SECRET || "ornate_rzp_test_sim_secret_2026",
  },
  corsOrigins: (
    process.env.CORS_ORIGINS ||
    "http://localhost:8080,http://localhost:5174,http://127.0.0.1:8080,http://127.0.0.1:5174"
  )
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};
