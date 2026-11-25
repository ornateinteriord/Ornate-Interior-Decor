import React, { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  Landmark,
  ShieldCheck,
  Smartphone,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { formatINR, getApiErrorMessage } from "@ornate/utils";
import type { OrderRecord } from "@/types/furniture";
import { ecommerceApi, type RazorpayOrderCreateResponse } from "@/services/ecommerceApi";

interface RazorpayHandlerResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayFailedResponse {
  error?: {
    description?: string;
    metadata?: { payment_id?: string };
  };
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (resp: RazorpayFailedResponse) => void) => void;
    };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

interface RazorpayCheckoutModalProps {
  session: RazorpayOrderCreateResponse | null;
  onClose: () => void;
  onSuccess: (order: OrderRecord) => void;
  onFailed: (order: OrderRecord, reason: string) => void;
  onCancelled: (order: OrderRecord) => void;
}

export const RazorpayCheckoutModal: React.FC<RazorpayCheckoutModalProps> = ({
  session,
  onClose,
  onSuccess,
  onFailed,
  onCancelled,
}) => {
  const [method, setMethod] = useState<"UPI" | "Card" | "NetBanking">("UPI");
  const [upiId, setUpiId] = useState("success@razorpay");
  const [processing, setProcessing] = useState(false);

  // If real Razorpay Test Keys are configured on backend, open official checkout.js widget
  useEffect(() => {
    if (!session || session.razorpay.mode !== "razorpay_live_test") return;

    let cancelled = false;
    (async () => {
      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay || cancelled) {
        toast.error("Could not load Razorpay Checkout SDK.");
        onClose();
        return;
      }

      const rzp = new window.Razorpay({
        key: session.razorpay.keyId,
        amount: session.razorpay.amountPaise,
        currency: session.razorpay.currency,
        name: "Ornate Interior Decor",
        description: `Order ${session.order.orderNumber}`,
        order_id: session.razorpay.razorpayOrderId,
        prefill: {
          name: session.order.customer.name,
          email: session.order.customer.email,
          contact: session.order.customer.phone,
        },
        theme: { color: "#262320" },
        handler: async (resp: RazorpayHandlerResponse) => {
          try {
            const verified = await ecommerceApi.verifyRazorpayPayment({
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_signature: resp.razorpay_signature,
              method: "Razorpay Test Checkout",
            });
            onSuccess(verified);
          } catch (err: unknown) {
            toast.error(getApiErrorMessage(err, "Payment verification failed"));
          }
        },
        modal: {
          ondismiss: async () => {
            const updated = await ecommerceApi.reportPaymentCancelled({
              razorpay_order_id: session.razorpay.razorpayOrderId,
            });
            onCancelled(updated);
          },
        },
      });

      rzp.on("payment.failed", async (resp: RazorpayFailedResponse) => {
        const reason = resp?.error?.description || "Payment declined in Razorpay test mode";
        const updated = await ecommerceApi.reportPaymentFailed({
          razorpay_order_id: session.razorpay.razorpayOrderId,
          razorpay_payment_id: resp?.error?.metadata?.payment_id || "",
          reason,
        });
        onFailed(updated, reason);
      });

      rzp.open();
    })();

    return () => {
      cancelled = true;
    };
  }, [session, onClose, onSuccess, onFailed, onCancelled]);

  if (!session || session.razorpay.mode === "razorpay_live_test") {
    return null;
  }

  const amountInr = Math.round(session.razorpay.amountPaise / 100);

  const handleSimulateSuccess = async () => {
    setProcessing(true);
    try {
      const creds = await ecommerceApi.getSimulatorSignature(
        session.razorpay.razorpayOrderId
      );
      const order = await ecommerceApi.verifyRazorpayPayment({
        razorpay_order_id: creds.razorpayOrderId,
        razorpay_payment_id: creds.razorpayPaymentId,
        razorpay_signature: creds.razorpaySignature,
        method: `Razorpay Test ${method}`,
      });
      toast.success("Razorpay payment verified & order confirmed!");
      onSuccess(order);
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Payment verification failed"));
    } finally {
      setProcessing(false);
    }
  };

  const handleSimulateFailure = async () => {
    setProcessing(true);
    try {
      const reason = `Simulated ${method} decline: Insufficient funds / bank timeout`;
      const order = await ecommerceApi.reportPaymentFailed({
        razorpay_order_id: session.razorpay.razorpayOrderId,
        razorpay_payment_id: `pay_fail_${Date.now().toString(36)}`,
        reason,
        method: `Razorpay Test ${method}`,
      });
      toast.error(reason);
      onFailed(order, reason);
    } finally {
      setProcessing(false);
    }
  };

  const handleSimulateTamperedSignature = async () => {
    setProcessing(true);
    try {
      await ecommerceApi.verifyRazorpayPayment({
        razorpay_order_id: session.razorpay.razorpayOrderId,
        razorpay_payment_id: `pay_tamper_${Date.now().toString(36)}`,
        razorpay_signature: "tampered_invalid_signature_000000",
        method: `Razorpay Test ${method}`,
      });
    } catch (err: unknown) {
      const order =
        typeof err === "object" && err !== null
          ? (err as { response?: { data?: { data?: { order?: OrderRecord } } } }).response?.data?.data?.order
          : undefined;
      const msg = getApiErrorMessage(
        err,
        "Signature verification rejected tampered payload"
      );
      toast.error(msg);
      if (order) onFailed(order, msg);
    } finally {
      setProcessing(false);
    }
  };

  const handleDismiss = async () => {
    setProcessing(true);
    try {
      const order = await ecommerceApi.reportPaymentCancelled({
        razorpay_order_id: session.razorpay.razorpayOrderId,
      });
      toast.info("Payment cancelled. You can retry whenever ready.");
      onCancelled(order);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-2xl border border-ornate-gold/30 overflow-hidden">
        {/* Razorpay-style Header */}
        <div className="bg-[#1b2236] text-white px-5 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-400 text-[#1b2236] text-[10px] font-bold uppercase tracking-wider">
                Test Mode
              </span>
              <span className="text-xs text-white/70">Razorpay Online Checkout</span>
            </div>
            <h3 className="font-serif text-lg mt-1">Ornate Interior Decor</h3>
            <p className="text-xs text-white/65">
              Order {session.order.orderNumber} · {session.razorpay.razorpayOrderId}
            </p>
          </div>
          <div className="text-right">
            <p className="font-serif text-xl font-semibold">{formatINR(amountInr)}</p>
            <button
              type="button"
              disabled={processing}
              onClick={handleDismiss}
              aria-label="Close payment modal"
              className="text-xs text-white/70 hover:text-white inline-flex items-center gap-1 mt-1"
            >
              <X size={13} /> Cancel
            </button>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Payment Method Selector */}
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { key: "UPI", label: "UPI / QR", icon: Smartphone },
                { key: "Card", label: "Test Card", icon: CreditCard },
                { key: "NetBanking", label: "NetBanking", icon: Landmark },
              ] as const
            ).map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setMethod(opt.key)}
                  className={`py-2.5 px-2 rounded border text-xs font-medium flex flex-col items-center gap-1 transition-colors ${
                    method === opt.key
                      ? "bg-[#1b2236] text-white border-[#1b2236]"
                      : "bg-ornate-offwhite text-ornate-charcoal border-ornate-gold/25"
                  }`}
                >
                  <Icon size={15} />
                  {opt.label}
                </button>
              );
            })}
          </div>

          {method === "UPI" && (
            <div className="bg-ornate-offwhite border border-ornate-gold/20 rounded p-3 space-y-1.5">
              <label className="block text-[11px] font-medium text-ornate-charcoal/80">
                Razorpay Test VPA / UPI ID
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-ornate-gold/30 rounded"
              />
            </div>
          )}

          {method === "Card" && (
            <div className="bg-ornate-offwhite border border-ornate-gold/20 rounded p-3 text-xs space-y-1">
              <p className="font-medium">Razorpay Test Card Pre-filled</p>
              <p className="text-ornate-charcoal/70 font-mono">
                4111 •••• •••• 1111 · Exp 12/28 · CVV 123
              </p>
            </div>
          )}

          {method === "NetBanking" && (
            <div className="bg-ornate-offwhite border border-ornate-gold/20 rounded p-3 text-xs space-y-1">
              <p className="font-medium">Test Bank Selected: HDFC / SBI Sandbox</p>
              <p className="text-ornate-charcoal/70">
                Redirects to simulated bank authorization screen.
              </p>
            </div>
          )}

          <button
            type="button"
            disabled={processing}
            onClick={handleSimulateSuccess}
            className="w-full py-3 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <CheckCircle2 size={16} />
            Pay {formatINR(amountInr)} (Simulate Success)
          </button>

          {/* Explicit Test Scenario Suite */}
          <div className="border-t border-ornate-gold/20 pt-3 space-y-2">
            <p className="text-[11px] font-display uppercase tracking-wider text-ornate-charcoal/65">
              Razorpay Test Scenario Validator
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={processing}
                onClick={handleSimulateFailure}
                className="py-2 px-2.5 rounded border border-rose-200 bg-rose-50 text-rose-800 text-[11px] font-medium inline-flex items-center justify-center gap-1 hover:bg-rose-100"
              >
                <XCircle size={13} /> Simulate Payment Fail
              </button>
              <button
                type="button"
                disabled={processing}
                onClick={handleSimulateTamperedSignature}
                className="py-2 px-2.5 rounded border border-amber-300 bg-amber-50 text-amber-900 text-[11px] font-medium inline-flex items-center justify-center gap-1 hover:bg-amber-100"
              >
                <AlertTriangle size={13} /> Test Invalid Signature
              </button>
            </div>
          </div>

          <p className="text-[10px] text-center text-ornate-charcoal/55 flex items-center justify-center gap-1">
            <ShieldCheck size={12} /> Secured with HMAC-SHA256 signature verification
          </p>
        </div>
      </div>
    </div>
  );
};
