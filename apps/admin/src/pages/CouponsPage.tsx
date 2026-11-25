import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Power, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { CouponRecord } from "@ornate/types";
import { formatINR, getApiErrorMessage } from "@ornate/utils";
import { adminApi } from "@/lib/adminApi";

export const CouponsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "flat">("percentage");
  const [discountValue, setDiscountValue] = useState("10");
  const [minOrderAmount, setMinOrderAmount] = useState("5000");
  const [maxDiscountAmount, setMaxDiscountAmount] = useState("5000");

  const { data: coupons = [] } = useQuery<CouponRecord[]>({
    queryKey: ["admin-coupons"],
    queryFn: async () => {
      const res = await adminApi.get("/coupons");
      return res.data.data;
    },
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.post("/coupons", {
        code,
        title: title || code,
        discountType,
        discountValue: Number(discountValue),
        minOrderAmount: Number(minOrderAmount || 0),
        maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : null,
      });
      setCode("");
      setTitle("");
      void queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      toast.success("Coupon created");
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Failed to create coupon"));
    }
  };

  const toggleCoupon = async (coupon: CouponRecord) => {
    await adminApi.patch(`/coupons/${coupon.id}`, { isActive: !coupon.isActive });
    void queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
  };

  const deleteCoupon = async (id: string) => {
    await adminApi.delete(`/coupons/${id}`);
    void queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
    toast.success("Coupon removed");
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-display uppercase tracking-widest text-ornate-darkgold">
          Promotions
        </p>
        <h2 className="font-serif text-3xl text-ornate-charcoal">
          Coupons &amp; Discounts
        </h2>
      </div>

      <form
        onSubmit={handleCreate}
        className="bg-white border border-ornate-gold/25 rounded-lg p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end"
      >
        <div>
          <label className="block text-xs font-medium mb-1">Code *</label>
          <input
            type="text"
            required
            placeholder="FESTIVE20"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="w-full px-3 py-2 border border-ornate-gold/30 rounded text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Title</label>
          <input
            type="text"
            placeholder="Festive Living Offer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-ornate-gold/30 rounded text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Type</label>
          <select
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value as "percentage" | "flat")}
            className="w-full px-3 py-2 border border-ornate-gold/30 rounded text-sm bg-white"
          >
            <option value="percentage">Percentage (%)</option>
            <option value="flat">Flat (₹)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Value *</label>
          <input
            type="number"
            min="1"
            required
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            className="w-full px-3 py-2 border border-ornate-gold/30 rounded text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Min Order (₹)</label>
          <input
            type="number"
            min="0"
            value={minOrderAmount}
            onChange={(e) => setMinOrderAmount(e.target.value)}
            className="w-full px-3 py-2 border border-ornate-gold/30 rounded text-sm"
          />
        </div>
        <button
          type="submit"
          className="h-10 px-4 bg-ornate-charcoal text-white rounded text-xs font-display uppercase tracking-wider inline-flex items-center justify-center gap-1.5 hover:bg-ornate-darkgold"
        >
          <Plus size={14} /> Add Coupon
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((c) => (
          <div
            key={c.id}
            className="bg-white border border-ornate-gold/25 rounded-lg p-5 flex flex-col justify-between gap-4"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded bg-ornate-cream border border-ornate-gold/30 font-mono text-sm font-semibold">
                  {c.code}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                    c.isActive
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {c.isActive ? "Active" : "Paused"}
                </span>
              </div>
              <h3 className="font-serif text-lg mt-3">{c.title}</h3>
              <p className="text-xs text-ornate-charcoal/70 mt-1">
                {c.discountType === "percentage"
                  ? `${c.discountValue}% off`
                  : `${formatINR(c.discountValue)} flat off`}{" "}
                · Min order {formatINR(c.minOrderAmount)} · Used {c.usageCount}×
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-ornate-gold/15">
              <button
                type="button"
                onClick={() => toggleCoupon(c)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-ornate-gold/30 text-xs"
              >
                <Power size={13} /> {c.isActive ? "Pause" : "Activate"}
              </button>
              <button
                type="button"
                onClick={() => deleteCoupon(c.id)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-rose-200 text-rose-700 text-xs"
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
