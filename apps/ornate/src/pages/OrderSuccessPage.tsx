import React, { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Package,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  formatINR,
  getApiErrorMessage,
  ORDER_PROGRESS_STEPS,
  ORDER_STATUS_LABELS,
} from "@ornate/utils";
import type { OrderRecord } from "@/types/furniture";
import Seo from "@/components/seo/Seo";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { ecommerceApi, type RazorpayOrderCreateResponse } from "@/services/ecommerceApi";
import { InvoiceModal } from "@/components/ecommerce/InvoiceModal";
import { RazorpayCheckoutModal } from "@/components/ecommerce/RazorpayCheckoutModal";

const OrderSuccessPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { refreshCart } = useCart();
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [rzpSession, setRzpSession] = useState<RazorpayOrderCreateResponse | null>(
    null
  );

  const { data: order, isLoading } = useQuery<OrderRecord>({
    queryKey: ["order", orderNumber],
    enabled: Boolean(orderNumber && isAuthenticated),
    queryFn: () => ecommerceApi.getOrder(orderNumber!),
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ornate-offwhite text-sm">
        Loading order...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=/orders/${orderNumber || ""}`} replace />;
  }

  if (isLoading || !order) {
    return (
      <div className="min-h-screen bg-ornate-offwhite pt-16 md:pt-32 px-4 text-center">
        <p className="text-sm text-ornate-muted">
          {isLoading ? "Loading order details..." : "Order not found."}
        </p>
      </div>
    );
  }

  const currentStepIdx = ORDER_PROGRESS_STEPS.indexOf(order.orderStatus);
  const canRetry =
    order.paymentStatus !== "PAID" && order.orderStatus !== "CANCELLED";
  const canCancel =
    !["SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"].includes(
      order.orderStatus
    );

  const handleRetryPayment = async () => {
    try {
      const session = await ecommerceApi.retryOrderPayment(order.id);
      setRzpSession(session);
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Could not retry payment"));
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm("Cancel this order?")) return;
    try {
      await ecommerceApi.cancelOrder(order.id, "Cancelled from order page");
      void queryClient.invalidateQueries({ queryKey: ["order", orderNumber] });
      toast.success("Order cancelled");
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Cannot cancel order"));
    }
  };

  return (
    <div className="bg-ornate-offwhite min-h-screen pt-8 md:pt-28 pb-16">
      <Seo
        title={`Order ${order.orderNumber}`}
        description="Order confirmation, live tracking, and GST tax invoice."
        path={`/orders/${order.orderNumber}`}
        noIndex
      />

      <div className="ornate-container max-w-4xl space-y-6">
        <Link
          to="/account"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ornate-moss hover:text-ornate-darkgold"
        >
          <ArrowLeft size={14} /> Back to My Orders
        </Link>

        {/* Status Header Banner */}
        <div className="ornate-card p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            {order.paymentStatus === "PAID" && order.orderStatus !== "CANCELLED" ? (
              <CheckCircle2 size={34} className="text-emerald-700 shrink-0 mt-1" />
            ) : order.orderStatus === "CANCELLED" ? (
              <XCircle size={34} className="text-rose-700 shrink-0 mt-1" />
            ) : (
              <AlertCircle size={34} className="text-amber-600 shrink-0 mt-1" />
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ornate-darkgold">
                {ORDER_STATUS_LABELS[order.orderStatus] || order.orderStatus}
              </p>
              <h1 className="font-serif text-3xl text-ornate-charcoal">
                Order <span className="font-mono text-2xl">{order.orderNumber}</span>
              </h1>
              <p className="text-xs text-ornate-muted mt-1">
                Placed on {new Date(order.createdAt).toLocaleString("en-IN")} · Estimated
                Delivery: {order.estimatedDelivery}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {canRetry && (
              <button
                type="button"
                onClick={handleRetryPayment}
                className="ornate-btn-primary py-2.5 px-4 text-xs gap-1.5"
              >
                <RefreshCw size={14} /> Complete Payment
              </button>
            )}
            <button
              type="button"
              onClick={() => setInvoiceOpen(true)}
              className="ornate-btn-outline py-2.5 px-4 text-xs gap-1.5"
            >
              <FileText size={14} /> View Tax Invoice
            </button>
            {canCancel && (
              <button
                type="button"
                onClick={handleCancelOrder}
                className="px-4 py-2.5 border border-rose-200 text-rose-700 text-xs font-semibold rounded-full hover:bg-rose-50"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>

        {/* Visual Tracking Stepper */}
        {order.orderStatus !== "CANCELLED" && order.paymentStatus === "PAID" && (
          <div className="ornate-card p-6">
            <h2 className="font-serif text-lg mb-5 flex items-center gap-2">
              <Package size={17} className="text-ornate-moss" />
              Delivery Progress
            </h2>
            <div className="grid grid-cols-5 gap-2 text-center">
              {ORDER_PROGRESS_STEPS.map((step, idx) => {
                const done = currentStepIdx >= idx;
                return (
                  <div key={step} className="space-y-2">
                    <div
                      className={`h-2 rounded-full ${
                        done ? "bg-ornate-moss" : "bg-ornate-cream"
                      }`}
                    />
                    <p
                      className={`text-xs font-semibold ${
                        done ? "text-ornate-charcoal" : "text-ornate-muted/60"
                      }`}
                    >
                      {ORDER_STATUS_LABELS[step]}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="ornate-card p-6 space-y-2 text-sm">
            <h2 className="font-serif text-lg border-b border-ornate-border pb-2">
              Shipping Address
            </h2>
            <p className="font-semibold">{order.shippingAddress.fullName}</p>
            <p className="text-ornate-muted">
              {order.shippingAddress.line1}
              {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""}
            </p>
            <p className="text-ornate-muted">
              {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
              {order.shippingAddress.pincode}
            </p>
            <p className="text-ornate-muted">Phone: {order.shippingAddress.phone}</p>
          </div>

          <div className="ornate-card p-6 space-y-2 text-sm">
            <h2 className="font-serif text-lg border-b border-ornate-border pb-2">
              Razorpay Payment Details
            </h2>
            <p>
              <strong>Payment Status:</strong> {order.paymentStatus}
            </p>
            <p className="text-xs">
              <strong>Razorpay Order ID:</strong>{" "}
              <span className="font-mono">{order.razorpayOrderId}</span>
            </p>
            <p className="text-xs">
              <strong>Razorpay Payment ID:</strong>{" "}
              <span className="font-mono">{order.razorpayPaymentId || "—"}</span>
            </p>
            <p className="text-xs">
              <strong>Total Paid:</strong>{" "}
              <span className="font-bold price-nums">{formatINR(order.pricing.grandTotal)}</span>
            </p>
          </div>
        </div>

        {/* Items */}
        <div className="ornate-card p-6 space-y-4">
          <h2 className="font-serif text-lg border-b border-ornate-border pb-2">
            Ordered Furniture ({order.items.length})
          </h2>
          <div className="divide-y divide-ornate-border">
            {order.items.map((item) => (
              <div key={item.productId} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover bg-ornate-cream"
                  />
                  <div>
                    <Link
                      to={`/shop/${item.slug}`}
                      className="font-sans font-semibold text-base hover:text-ornate-moss"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-ornate-muted price-nums">
                      Qty {item.quantity} × {formatINR(item.unitPrice)}
                    </p>
                  </div>
                </div>
                <p className="font-bold price-nums">{formatINR(item.lineTotal)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="ornate-card p-6 space-y-3">
          <h2 className="font-serif text-lg">Activity Timeline</h2>
          <div className="space-y-2.5 text-xs">
            {[...order.timeline].reverse().map((entry, idx) => (
              <div key={idx} className="flex justify-between gap-4 border-l-2 border-ornate-moss pl-3 py-0.5">
                <div>
                  <p className="font-semibold">
                    {ORDER_STATUS_LABELS[entry.status] || entry.status}
                  </p>
                  <p className="text-ornate-muted">{entry.note}</p>
                </div>
                <span className="text-ornate-muted shrink-0">
                  {new Date(entry.timestamp).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <InvoiceModal
        order={invoiceOpen ? order : null}
        onClose={() => setInvoiceOpen(false)}
      />

      <RazorpayCheckoutModal
        session={rzpSession}
        onClose={() => setRzpSession(null)}
        onSuccess={async () => {
          setRzpSession(null);
          await refreshCart();
          void queryClient.invalidateQueries({ queryKey: ["order", orderNumber] });
        }}
        onFailed={() => {
          setRzpSession(null);
          void queryClient.invalidateQueries({ queryKey: ["order", orderNumber] });
        }}
        onCancelled={() => {
          setRzpSession(null);
          void queryClient.invalidateQueries({ queryKey: ["order", orderNumber] });
        }}
      />
    </div>
  );
};

export default OrderSuccessPage;
