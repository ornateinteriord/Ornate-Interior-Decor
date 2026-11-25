import { Router } from "express";
import { getModels } from "../models/index.js";
import { requireCustomerAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireCustomerAuth);

function serializeAddress(doc) {
  return {
    id: String(doc._id),
    fullName: doc.fullName,
    phone: doc.phone,
    line1: doc.line1,
    line2: doc.line2 || "",
    landmark: doc.landmark || "",
    city: doc.city,
    state: doc.state,
    pincode: doc.pincode,
    type: doc.type || "Home",
    isDefault: Boolean(doc.isDefault),
  };
}

function validateAddressPayload(body) {
  const fullName = String(body.fullName || "").trim();
  const phone = String(body.phone || "").trim();
  const line1 = String(body.line1 || "").trim();
  const line2 = String(body.line2 || "").trim();
  const landmark = String(body.landmark || "").trim();
  const city = String(body.city || "").trim();
  const state = String(body.state || "").trim();
  const pincode = String(body.pincode || "").trim();
  const type = ["Home", "Office", "Studio", "Other"].includes(body.type)
    ? body.type
    : "Home";

  if (fullName.length < 2) return { error: "Recipient name is required." };
  if (!/^\+?[\d\s-]{8,15}$/.test(phone)) return { error: "Valid phone number is required." };
  if (line1.length < 4) return { error: "Street / flat address line is required." };
  if (city.length < 2) return { error: "City is required." };
  if (state.length < 2) return { error: "State is required." };
  if (!/^\d{6}$/.test(pincode)) return { error: "Valid 6-digit pincode is required." };

  return {
    value: {
      fullName,
      phone,
      line1,
      line2,
      landmark,
      city,
      state,
      pincode,
      type,
      isDefault: Boolean(body.isDefault),
    },
  };
}

router.get("/", async (req, res, next) => {
  try {
    const { Address } = getModels();
    const docs = await Address.find({ userId: String(req.user._id) })
      .sort({ isDefault: -1, createdAt: -1 })
      .lean();
    res.json({ success: true, data: docs.map(serializeAddress) });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error, value } = validateAddressPayload(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    const { Address } = getModels();
    const userId = String(req.user._id);
    const existingCount = await Address.countDocuments({ userId });
    const shouldBeDefault = value.isDefault || existingCount === 0;

    if (shouldBeDefault) {
      await Address.updateMany({ userId }, { $set: { isDefault: false } });
    }

    const created = await Address.create({
      ...value,
      userId,
      isDefault: shouldBeDefault,
    });

    res.status(201).json({ success: true, data: serializeAddress(created) });
  } catch (err) {
    next(err);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const { Address } = getModels();
    const userId = String(req.user._id);
    const existing = await Address.findOne({ _id: req.params.id, userId });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Address not found." });
    }

    // Support default-only toggle cleanly
    if (
      req.body.isDefault === true &&
      Object.keys(req.body).length === 1
    ) {
      await Address.updateMany({ userId }, { $set: { isDefault: false } });
      existing.isDefault = true;
      await existing.save();
      return res.json({ success: true, data: serializeAddress(existing) });
    }

    const { error, value } = validateAddressPayload({
      ...existing.toObject(),
      ...req.body,
    });
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    if (value.isDefault) {
      await Address.updateMany({ userId }, { $set: { isDefault: false } });
    }

    Object.assign(existing, value);
    await existing.save();
    res.json({ success: true, data: serializeAddress(existing) });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { Address } = getModels();
    const userId = String(req.user._id);
    const deleted = await Address.findOneAndDelete({ _id: req.params.id, userId });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Address not found." });
    }

    if (deleted.isDefault) {
      const nextDefault = await Address.findOne({ userId }).sort({ createdAt: -1 });
      if (nextDefault) {
        nextDefault.isDefault = true;
        await nextDefault.save();
      }
    }

    res.json({ success: true, message: "Address removed." });
  } catch (err) {
    next(err);
  }
});

export default router;
