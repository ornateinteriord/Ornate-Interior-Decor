import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { formatINR } from "@ornate/utils";
import { adminApi } from "@/lib/adminApi";

interface AdminCustomerRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  addressCount: number;
  paidOrdersCount: number;
  totalSpent: number;
}

interface AdminReviewRow {
  id: string;
  rating: number;
  userName: string;
  verifiedPurchase: boolean;
  title: string;
  comment: string;
}

export const CustomersReviewsPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: customers = [] } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: async () => (await adminApi.get("/customers")).data.data,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => (await adminApi.get("/reviews")).data.data,
  });

  const deleteReview = async (id: string) => {
    await adminApi.delete(`/reviews/${id}`);
    void queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    toast.success("Review deleted");
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-display uppercase tracking-widest text-ornate-darkgold">
          ornate_users &amp; ornate_catalog
        </p>
        <h2 className="font-serif text-3xl text-ornate-charcoal">
          Registered Customers ({customers.length})
        </h2>
      </div>

      <div className="bg-white border border-ornate-gold/25 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-ornate-cream/60 border-b border-ornate-gold/20 text-[11px] font-display uppercase tracking-wider">
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Saved Addresses</th>
                <th className="py-3 px-4">Paid Orders</th>
                <th className="py-3 px-4">Total Spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ornate-gold/15">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-ornate-charcoal/60">
                    No customers registered yet.
                  </td>
                </tr>
              ) : (
                customers.map((c: AdminCustomerRow) => (
                  <tr key={c.id}>
                    <td className="py-3 px-4">
                      <p className="font-medium">{c.name}</p>
                      <p className="text-xs text-ornate-charcoal/60">{c.email}</p>
                    </td>
                    <td className="py-3 px-4">{c.phone}</td>
                    <td className="py-3 px-4">{c.addressCount}</td>
                    <td className="py-3 px-4">{c.paidOrdersCount}</td>
                    <td className="py-3 px-4 font-semibold">{formatINR(c.totalSpent)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-serif text-2xl text-ornate-charcoal">
          Product Reviews ({reviews.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((r: AdminReviewRow) => (
            <div
              key={r.id}
              className="bg-white border border-ornate-gold/25 rounded-lg p-4 flex justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-amber-600 text-xs font-semibold">
                    <Star size={13} fill="currentColor" /> {r.rating}/5
                  </span>
                  <span className="text-xs font-medium">{r.userName}</span>
                  {r.verifiedPurchase && (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px]">
                      Verified Buyer
                    </span>
                  )}
                </div>
                <p className="font-medium text-sm">{r.title}</p>
                <p className="text-xs text-ornate-charcoal/75">{r.comment}</p>
              </div>
              <button
                type="button"
                onClick={() => deleteReview(r.id)}
                className="self-start p-2 text-rose-700 hover:bg-rose-50 rounded"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
