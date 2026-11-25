import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, CreditCard, MapPin } from "lucide-react";
import { toast } from "sonner";
import type { OrderRecord, OrderStatus } from "@ornate/types";
import { formatINR, getApiErrorMessage, ORDER_STATUS_LABELS } from "@ornate/utils";
import { adminApi } from "@/lib/adminApi";

const ORDER_STATUSES: OrderStatus[] = [
  "PAYMENT_PENDING",
  "PAYMENT_FAILED",
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

export const OrdersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: orders = [], isLoading } = useQuery<OrderRecord[]>({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const res = await adminApi.get("/orders");
      return res.data.data;
    },
  });

  const filtered = orders.filter((o) =>
    statusFilter === "all" ? true : o.orderStatus === statusFilter
  );

  const handleStatusUpdate = async (
    orderId: string,
    orderStatus: OrderStatus,
    courierName?: string,
    trackingNumber?: string
  ) => {
    try {
      await adminApi.patch(`/orders/${orderId}/status`, {
        orderStatus,
        courierName,
        trackingNumber,
      });
      void queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      toast.success(`Order updated to ${ORDER_STATUS_LABELS[orderStatus]}`);
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Failed to update status"));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-display uppercase tracking-widest text-ornate-darkgold">
            Fulfillment &amp; Razorpay Logs
          </p>
          <h2 className="font-serif text-3xl text-ornate-charcoal">
            Customer Orders ({orders.length})
          </h2>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-white border border-ornate-gold/30 rounded text-sm"
        >
          <option value="all">All Statuses</option>
          {ORDER_STATUSES.map((st) => (
            <option key={st} value={st}>
              {ORDER_STATUS_LABELS[st]}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="bg-white p-8 rounded border border-ornate-gold/20 text-center text-sm">
          Loading orders...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white p-8 rounded border border-ornate-gold/20 text-center text-sm text-ornate-charcoal/65">
          No orders matching the selected status.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => {
            const expanded = expandedId === order.id;
            return (
              <div
                key={order.id}
                className="bg-white border border-ornate-gold/25 rounded-lg overflow-hidden shadow-sm"
              >
                <div className="p-4 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-serif text-lg text-ornate-charcoal">
                        {order.orderNumber}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                          order.paymentStatus === "PAID"
                            ? "bg-emerald-100 text-emerald-800"
                            : order.paymentStatus === "FAILED"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        Payment: {order.paymentStatus}
                      </span>
                    </div>
                    <p className="text-xs text-ornate-charcoal/65 mt-0.5">
                      {order.customer.name} ({order.customer.email}) ·{" "}
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-semibold text-base">
                        {formatINR(order.pricing.grandTotal)}
                      </p>
                      <p className="text-[11px] text-ornate-charcoal/60">
                        {order.items.length} item(s)
                      </p>
                    </div>

                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        handleStatusUpdate(
                          order.id,
                          e.target.value as OrderStatus,
                          order.courierName,
                          order.trackingNumber
                        )
                      }
                      className="px-2.5 py-1.5 border border-ornate-gold/30 rounded text-xs bg-ornate-offwhite"
                    >
                      {ORDER_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {ORDER_STATUS_LABELS[st]}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => setExpandedId(expanded ? null : order.id)}
                      className="p-2 border border-ornate-gold/25 rounded hover:bg-ornate-cream"
                    >
                      {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {expanded && (
                  <div className="border-t border-ornate-gold/15 bg-ornate-offwhite/60 p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-2 bg-white p-3.5 rounded border border-ornate-gold/15">
                      <p className="font-semibold flex items-center gap-1.5 text-ornate-darkgold">
                        <MapPin size={13} /> Delivery Address
                      </p>
                      <p className="font-medium">{order.shippingAddress.fullName}</p>
                      <p>
                        {order.shippingAddress.line1}
                        {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""}
                      </p>
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                        {order.shippingAddress.pincode}
                      </p>
                      <p>Phone: {order.shippingAddress.phone}</p>
                    </div>

                    <div className="space-y-2 bg-white p-3.5 rounded border border-ornate-gold/15">
                      <p className="font-semibold flex items-center gap-1.5 text-ornate-darkgold">
                        <CreditCard size={13} /> Razorpay Transaction Details
                      </p>
                      <p>Mode: {order.paymentGatewayMode}</p>
                      <p>RZP Order: {order.razorpayOrderId}</p>
                      <p>RZP Payment: {order.razorpayPaymentId || "—"}</p>
                      <p>Attempts: {order.paymentAttempts?.length || 0}</p>
                      {order.paymentAttempts?.slice(-2).map((att, idx) => (
                        <p key={idx} className="text-[11px] text-ornate-charcoal/70">
                          • {att.status}: {att.reason}
                        </p>
                      ))}
                    </div>

                    <div className="space-y-2 bg-white p-3.5 rounded border border-ornate-gold/15">
                      <p className="font-semibold text-ornate-darkgold">Ordered Items</p>
                      {order.items.map((item) => (
                        <div key={item.productId} className="flex justify-between gap-2">
                          <span className="truncate">
                            {item.name} × {item.quantity}
                          </span>
                          <span className="font-medium shrink-0">
                            {formatINR(item.lineTotal)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
