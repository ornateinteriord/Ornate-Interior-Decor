import express from "express";
import cors from "cors";
import morgan from "morgan";
import { env } from "./config/env.js";
import { getDatabaseHealth } from "./config/databases.js";
import { getImageKitStatus } from "./services/imagekitService.js";
import { getRazorpayMode } from "./services/paymentService.js";
import catalogRoutes from "./routes/catalogRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || env.corsOrigins.includes(origin) || env.corsOrigins.includes("*")) {
          return callback(null, true);
        }
        return callback(null, true);
      },
      credentials: true,
    })
  );

  app.use(express.json({ limit: "12mb" }));
  app.use(express.urlencoded({ extended: true, limit: "12mb" }));

  if (env.nodeEnv !== "test") {
    app.use(morgan("dev"));
  }

  app.get("/api/health", async (_req, res) => {
    const db = await getDatabaseHealth();
    res.json({
      success: true,
      service: "@ornate/api",
      databases: db,
      imagekit: getImageKitStatus(),
      razorpayMode: getRazorpayMode(),
      timestamp: new Date().toISOString(),
    });
  });

  app.use("/api", catalogRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/addresses", addressRoutes);
  app.use("/api/cart", cartRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/admin", adminRoutes);

  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      message: "API endpoint not found.",
    });
  });

  app.use((err, _req, res, _next) => {
    console.error("[API Error]", err);
    const status = err.status || err.statusCode || 500;
    res.status(status).json({
      success: false,
      message: err.message || "Internal server error.",
    });
  });

  return app;
}
