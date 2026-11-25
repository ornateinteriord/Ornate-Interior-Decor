import crypto from "node:crypto";
import Razorpay from "razorpay";
import { env } from "../config/env.js";

export function getRazorpayMode() {
  return env.razorpay.keyId && env.razorpay.keySecret
    ? "razorpay_live_test"
    : "razorpay_test_simulator";
}

function getRazorpayClient() {
  if (getRazorpayMode() !== "razorpay_live_test") return null;
  return new Razorpay({
    key_id: env.razorpay.keyId,
    key_secret: env.razorpay.keySecret,
  });
}

function getActiveSigningSecret() {
  return getRazorpayMode() === "razorpay_live_test"
    ? env.razorpay.keySecret
    : env.razorpay.simulatorSecret;
}

export async function createGatewayOrder({ amountPaise, receipt, notes = {} }) {
  const mode = getRazorpayMode();

  if (mode === "razorpay_live_test") {
    const client = getRazorpayClient();
    const order = await client.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt,
      notes,
    });
    return {
      mode,
      keyId: env.razorpay.keyId,
      razorpayOrderId: order.id,
      amountPaise: order.amount,
      currency: order.currency,
    };
  }

  const randomSuffix = crypto.randomBytes(6).toString("hex").toUpperCase();
  const simOrderId = `order_sim_${randomSuffix}`;

  return {
    mode,
    keyId: "rzp_test_simulator_ornate",
    razorpayOrderId: simOrderId,
    amountPaise,
    currency: "INR",
  };
}

export function computeRazorpaySignature(razorpayOrderId, razorpayPaymentId) {
  const secret = getActiveSigningSecret();
  return crypto
    .createHmac("sha256", secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");
}

export function verifyRazorpaySignature({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) {
  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return false;
  }

  const expected = computeRazorpaySignature(razorpayOrderId, razorpayPaymentId);
  const expectedBuf = Buffer.from(expected, "utf8");
  const receivedBuf = Buffer.from(String(razorpaySignature), "utf8");

  if (expectedBuf.length !== receivedBuf.length) {
    return false;
  }
  return crypto.timingSafeEqual(expectedBuf, receivedBuf);
}

export function generateSimulatorPaymentCredentials(razorpayOrderId) {
  if (getRazorpayMode() !== "razorpay_test_simulator") {
    throw new Error("Simulator credentials are disabled when live keys are active.");
  }
  const razorpayPaymentId = `pay_sim_${crypto.randomBytes(6).toString("hex").toUpperCase()}`;
  const razorpaySignature = computeRazorpaySignature(razorpayOrderId, razorpayPaymentId);
  return {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  };
}
