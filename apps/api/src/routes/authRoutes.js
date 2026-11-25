import { Router } from "express";
import { getModels } from "../models/index.js";
import { requireCustomerAuth, signCustomerToken } from "../middleware/auth.js";

const router = Router();

router.post("/register", async (req, res, next) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();
    const phone = String(req.body.phone || "").trim();
    const password = String(req.body.password || "");

    if (name.length < 2) {
      return res.status(400).json({ success: false, message: "Full name is required." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: "Valid email address is required." });
    }
    if (!/^\+?[\d\s-]{8,15}$/.test(phone)) {
      return res.status(400).json({ success: false, message: "Valid phone number is required." });
    }
    if (password.length < 4) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 4 characters long.",
      });
    }

    const { User } = getModels();
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists. Please log in.",
      });
    }

    // Stored in plaintext per user instruction: "don't hash the password for users and admin both"
    const user = await User.create({
      name,
      email,
      phone,
      password,
      wishlist: [],
    });

    const token = signCustomerToken(user);
    res.status(201).json({
      success: true,
      data: {
        token,
        user: user.toSafeJSON(),
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const { User } = getModels();
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account is deactivated. Contact support.",
      });
    }

    const token = signCustomerToken(user);
    res.json({
      success: true,
      data: {
        token,
        user: user.toSafeJSON(),
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get("/me", requireCustomerAuth, (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user.toSafeJSON(),
    },
  });
});

router.patch("/me", requireCustomerAuth, async (req, res, next) => {
  try {
    const name = req.body.name !== undefined ? String(req.body.name).trim() : req.user.name;
    const phone = req.body.phone !== undefined ? String(req.body.phone).trim() : req.user.phone;

    if (name.length < 2) {
      return res.status(400).json({ success: false, message: "Name must be at least 2 characters." });
    }
    if (!/^\+?[\d\s-]{8,15}$/.test(phone)) {
      return res.status(400).json({ success: false, message: "Valid phone number is required." });
    }

    if (req.body.newPassword) {
      const currentPassword = String(req.body.currentPassword || "");
      const newPassword = String(req.body.newPassword || "");
      if (req.user.password !== currentPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password does not match.",
        });
      }
      if (newPassword.length < 4) {
        return res.status(400).json({
          success: false,
          message: "New password must be at least 4 characters.",
        });
      }
      req.user.password = newPassword;
    }

    req.user.name = name;
    req.user.phone = phone;
    await req.user.save();

    res.json({
      success: true,
      data: {
        user: req.user.toSafeJSON(),
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post("/wishlist/toggle", requireCustomerAuth, async (req, res, next) => {
  try {
    const productId = String(req.body.productId || "").trim();
    if (!productId) {
      return res.status(400).json({ success: false, message: "productId is required." });
    }

    const current = new Set(req.user.wishlist || []);
    let added = false;
    if (current.has(productId)) {
      current.delete(productId);
    } else {
      current.add(productId);
      added = true;
    }

    req.user.wishlist = Array.from(current);
    await req.user.save();

    res.json({
      success: true,
      data: {
        added,
        wishlist: req.user.wishlist,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post("/wishlist/sync", requireCustomerAuth, async (req, res, next) => {
  try {
    const incoming = Array.isArray(req.body.productIds)
      ? req.body.productIds.map(String)
      : [];
    const merged = Array.from(new Set([...(req.user.wishlist || []), ...incoming]));
    req.user.wishlist = merged;
    await req.user.save();

    res.json({
      success: true,
      data: {
        wishlist: merged,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
