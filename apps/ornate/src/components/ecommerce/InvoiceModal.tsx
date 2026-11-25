import React from "react";
import { Printer, X } from "lucide-react";
import { formatINR } from "@ornate/utils";
import type { OrderRecord } from "@/types/furniture";
import { STUDIO_INFO } from "@/lib/seo";

interface InvoiceModalProps {
  order: OrderRecord | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-sm border border-ornate-gold/30 shadow-2xl flex flex-col overflow-hidden">
        <div className="px-6 py-4 bg-ornate-cream/60 border-b border-ornate-gold/20 flex items-center justify-between print:hidden">
          <h2 className="font-serif text-xl text-ornate-charcoal">
            Tax Invoice · {order.orderNumber}
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-ornate-charcoal text-white text-xs rounded-sm hover:bg-ornate-darkgold"
            >
              <Printer size={14} /> Print / Save PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-ornate-charcoal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-8 overflow-y-auto space-y-6 text-sm text-ornate-charcoal">
          <div className="flex flex-wrap justify-between gap-4 border-b border-ornate-gold/25 pb-5">
            <div>
              <h3 className="font-serif text-2xl">{STUDIO_INFO.name}</h3>
              <p className="text-xs text-ornate-charcoal/75 mt-1 max-w-xs">
                {STUDIO_INFO.streetAddress}, {STUDIO_INFO.city}, {STUDIO_INFO.state} -{" "}
                {STUDIO_INFO.postalCode}
              </p>
              <p className="text-xs text-ornate-charcoal/75 mt-0.5">
                {STUDIO_INFO.phoneDisplay} · {STUDIO_INFO.email}
              </p>
            </div>
            <div className="text-right text-xs space-y-1">
              <p className="font-display uppercase tracking-widest text-ornate-darkgold font-semibold">
                Retail Tax Invoice
              </p>
              <p>
                <strong>Order #:</strong> {order.orderNumber}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleDateString("en-IN")}
              </p>
              <p>
                <strong>Payment ID:</strong> {order.razorpayPaymentId || "Pending"}
              </p>
              <p>
                <strong>Status:</strong> {order.paymentStatus}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-ornate-offwhite p-4 rounded-sm border border-ornate-gold/15">
              <p className="font-display uppercase tracking-wider text-ornate-darkgold mb-1">
                Billed &amp; Shipped To
              </p>
              <p className="font-semibold text-sm">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.line1}</p>
              {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                {order.shippingAddress.pincode}
              </p>
              <p className="mt-1">Phone: {order.shippingAddress.phone}</p>
            </div>

            <div className="bg-ornate-offwhite p-4 rounded-sm border border-ornate-gold/15">
              <p className="font-display uppercase tracking-wider text-ornate-darkgold mb-1">
                Customer &amp; Gateway Info
              </p>
              <p>Name: {order.customer.name}</p>
              <p>Email: {order.customer.email}</p>
              <p>Razorpay Order: {order.razorpayOrderId}</p>
              <p>Method: {order.paymentMethod}</p>
            </div>
          </div>

          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-ornate-gold/30 text-ornate-charcoal/70 uppercase">
                <th className="py-2.5">Item &amp; SKU</th>
                <th className="py-2.5 text-right">Unit Price</th>
                <th className="py-2.5 text-right">Qty</th>
                <th className="py-2.5 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ornate-gold/15">
              {order.items.map((item) => (
                <tr key={item.productId}>
                  <td className="py-3">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-ornate-charcoal/60">SKU: {item.sku}</p>
                  </td>
                  <td className="py-3 text-right">{formatINR(item.unitPrice)}</td>
                  <td className="py-3 text-right">{item.quantity}</td>
                  <td className="py-3 text-right font-semibold">
                    {formatINR(item.lineTotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="w-full max-w-xs space-y-1.5 text-xs border-t border-ornate-gold/25 pt-4">
              <div className="flex justify-between">
                <span>Taxable Value</span>
                <span>{formatINR(order.pricing.taxableValue)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18% Included)</span>
                <span>{formatINR(order.pricing.gstAmount)}</span>
              </div>
              {order.pricing.couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Coupon ({order.pricing.couponCode})</span>
                  <span>-{formatINR(order.pricing.couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {order.pricing.shippingFee === 0
                    ? "FREE"
                    : formatINR(order.pricing.shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-base font-serif font-semibold pt-2 border-t border-ornate-gold/20">
                <span>Grand Total</span>
                <span>{formatINR(order.pricing.grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
