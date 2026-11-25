import React, { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Cloud,
  Database,
  Edit3,
  EyeOff,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import type { ApiProduct, ApiSubcategory } from "@ornate/types";
import { formatINR, getApiErrorMessage, paiseToRupees } from "@ornate/utils";
import { adminApi } from "@/lib/adminApi";
import { ProductFormModal } from "@/components/ProductFormModal";

export const ProductsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState<"all" | "local" | "external">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ApiProduct | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const res = await adminApi.get("/products");
      return res.data.data;
    },
  });

  const products: ApiProduct[] = useMemo(() => data?.products || [], [data]);
  const subcategories: ApiSubcategory[] = useMemo(
    () => data?.subcategories || [],
    [data]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (sourceFilter !== "all" && p.source !== sourceFilter) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.brand || "").toLowerCase().includes(q) ||
        p.subcategoryName.toLowerCase().includes(q)
      );
    });
  }, [products, search, sourceFilter]);

  const reload = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    void queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
  };

  const handleRefreshExternal = async () => {
    setRefreshing(true);
    try {
      await adminApi.post("/products/refresh-external");
      reload();
      toast.success("Synced latest products from External API SLR00003");
    } catch {
      toast.error("Failed to refresh external API");
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteLocal = async (product: ApiProduct) => {
    if (!window.confirm(`Permanently delete "${product.name}"?`)) return;
    try {
      await adminApi.delete(`/products/${product.id}`);
      reload();
      toast.success("Product deleted from MongoDB");
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Delete failed"));
    }
  };

  const handleResetOverride = async (product: ApiProduct) => {
    try {
      await adminApi.post(`/products/${product.id}/reset-override`);
      reload();
      toast.success("Reset external product to original API data");
    } catch {
      toast.error("Failed to reset override");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-display uppercase tracking-widest text-ornate-darkgold">
            Unified Product Management
          </p>
          <h2 className="font-serif text-3xl text-ornate-charcoal">
            Combined Catalog ({products.length})
          </h2>
          <p className="text-xs text-ornate-charcoal/70 mt-1">
            MongoDB Added ({data?.meta?.localCount ?? 0}) + External API SLR00003 (
            {data?.meta?.externalCount ?? 0}) · External status:{" "}
            <span className="font-medium uppercase">
              {data?.meta?.externalStatus || "checking"}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={handleRefreshExternal}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-ornate-gold/40 bg-white rounded text-xs font-medium hover:bg-ornate-cream transition-colors"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            Sync External API
          </button>
          <button
            type="button"
            onClick={() => {
              setEditingProduct(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-ornate-charcoal text-white rounded text-xs font-display uppercase tracking-wider hover:bg-ornate-darkgold transition-colors"
          >
            <Plus size={15} />
            Add New Product
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-ornate-gold/25 rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ornate-charcoal/45"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, SKU, brand, category..."
            className="w-full pl-9 pr-3 py-2 border border-ornate-gold/25 rounded text-sm"
          />
        </div>

        <div className="flex gap-2">
          {(["all", "local", "external"] as const).map((src) => (
            <button
              key={src}
              type="button"
              onClick={() => setSourceFilter(src)}
              className={`px-3.5 py-2 rounded text-xs font-medium border transition-colors ${
                sourceFilter === src
                  ? "bg-ornate-charcoal text-white border-ornate-charcoal"
                  : "bg-ornate-offwhite text-ornate-charcoal border-ornate-gold/25"
              }`}
            >
              {src === "all"
                ? "All Combined"
                : src === "local"
                ? "Ornate MongoDB"
                : "External API"}
            </button>
          ))}
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white border border-ornate-gold/25 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-ornate-cream/60 border-b border-ornate-gold/20 text-[11px] font-display uppercase tracking-wider text-ornate-charcoal/80">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ornate-gold/15 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-ornate-charcoal/60">
                    Loading combined catalog...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-ornate-charcoal/60">
                    No matching products found.
                  </td>
                </tr>
              ) : (
                filtered.map((prod) => {
                  const priceInr = paiseToRupees(prod.pricing?.applicablePrice);
                  const mrpInr = paiseToRupees(prod.pricing?.mrp);
                  return (
                    <tr key={prod.id} className="hover:bg-ornate-offwhite/60">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              prod.images?.[0]?.url ||
                              "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=200"
                            }
                            alt={prod.name}
                            className="w-12 h-12 rounded object-cover border border-ornate-gold/20 bg-ornate-cream shrink-0"
                          />
                          <div>
                            <p className="font-medium text-ornate-charcoal flex items-center gap-1.5">
                              {prod.name}
                              {prod.isHidden && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px]">
                                  <EyeOff size={10} /> Hidden
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-ornate-charcoal/60">
                              {prod.sku} · {prod.brand}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {prod.source === "local" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                            <Database size={12} /> Ornate DB
                          </span>
                        ) : (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-medium">
                              <Cloud size={12} /> External API
                            </span>
                            {prod.hasOverride && (
                              <span className="block text-[10px] text-amber-700 font-medium">
                                + Admin Override
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4 text-xs text-ornate-charcoal/80">
                        {prod.subcategoryName}
                      </td>

                      <td className="py-3 px-4">
                        <p className="font-semibold">{formatINR(priceInr)}</p>
                        {mrpInr > priceInr && (
                          <p className="text-xs text-ornate-charcoal/50 line-through">
                            {formatINR(mrpInr)}
                          </p>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            prod.stock > 5
                              ? "bg-emerald-50 text-emerald-800"
                              : prod.stock > 0
                              ? "bg-amber-50 text-amber-800"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {prod.stock} units
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProduct(prod);
                              setModalOpen(true);
                            }}
                            className="p-2 border border-ornate-gold/30 rounded hover:bg-ornate-cream text-ornate-charcoal"
                            title={
                              prod.source === "external"
                                ? "Override External Product"
                                : "Edit Product"
                            }
                          >
                            <Edit3 size={14} />
                          </button>
                          {prod.source === "external" && prod.hasOverride && (
                            <button
                              type="button"
                              onClick={() => handleResetOverride(prod)}
                              className="p-2 border border-amber-300 rounded hover:bg-amber-50 text-amber-800"
                              title="Reset External Override"
                            >
                              <RotateCcw size={14} />
                            </button>
                          )}
                          {prod.source === "local" && (
                            <button
                              type="button"
                              onClick={() => handleDeleteLocal(prod)}
                              className="p-2 border border-rose-200 rounded hover:bg-rose-50 text-rose-700"
                              title="Delete Product"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProductFormModal
        open={modalOpen}
        product={editingProduct}
        subcategories={subcategories}
        onClose={() => setModalOpen(false)}
        onSaved={reload}
      />
    </div>
  );
};
