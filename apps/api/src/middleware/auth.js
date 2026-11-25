import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { getModels } from "../models/index.js";

export function signCustomerToken(user) {
  return jwt.sign(
    {
      sub: String(user._id),
      email: user.email,
      type: "customer",
    },
    env.jwtSecret,
    { expiresIn: "7d" }
  );
}

export function signAdminToken(admin) {
  return jwt.sign(
    {
      sub: String(admin._id),
      email: admin.email,
      role: admin.role,
      type: "admin",
    },
    env.adminJwtSecret,
    { expiresIn: "7d" }
  );
}

function extractBearerToken(req) {
  const header = req.headers.authorization || "";
  if (header.startsWith("Bearer ")) {
    return header.slice(7).trim();
  }
  return null;
}

export async function requireCustomerAuth(req, res, next) {
  try {
    const token = extractBearerToken(req);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in to continue.",
      });
    }

    const decoded = jwt.verify(token, env.jwtSecret);
    if (decoded.type !== "customer") {
      return res.status(401).json({ success: false, message: "Invalid token scope." });
    }

    const { User } = getModels();
    const user = await User.findById(decoded.sub);
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: "Account not found or inactive." });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Session expired or invalid. Please log in again.",
    });
  }
}

export async function optionalCustomerAuth(req, _res, next) {
  try {
    const token = extractBearerToken(req);
    if (!token) return next();
    const decoded = jwt.verify(token, env.jwtSecret);
    if (decoded.type === "customer") {
      const { User } = getModels();
      const user = await User.findById(decoded.sub);
      if (user && user.isActive) req.user = user;
    }
  } catch {
    // Ignore invalid optional token
  }
  next();
}

export async function requireAdminAuth(req, res, next) {
  try {
    const token = extractBearerToken(req);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Admin authentication required.",
      });
    }

    const decoded = jwt.verify(token, env.adminJwtSecret);
    if (decoded.type !== "admin") {
      return res.status(403).json({ success: false, message: "Admin access required." });
    }

    const { AdminUser } = getModels();
    const admin = await AdminUser.findById(decoded.sub);
    if (!admin || !admin.isActive) {
      return res.status(401).json({ success: false, message: "Admin account disabled." });
    }

    req.admin = admin;
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Admin session expired or invalid. Please sign in again.",
    });
  }
}
