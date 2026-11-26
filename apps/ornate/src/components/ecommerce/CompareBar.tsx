import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { GitCompareArrows, ShoppingBag, X } from "lucide-react";
import { formatAttributeKey, formatINR } from "@/lib/furnitureFilters";
import { useFurnitureCatalog } from "@/hooks/useFurnitureCatalog";
import { useStoreExtras } from "@/context/StoreExtrasContext";
import { useCart } from "@/context/CartContext";

export const CompareBar: React.FC = () => {
  const { compareIds, toggleCompare, clearCompare } = useStoreExtras();
  const { addToCart } = useCart();
  const { data } = useFurnitureCatalog();
  const [modalOpen, setModalOpen] = useState(false);

  const comparedProducts = useMemo(() => {
    const products = data?.products ?? [];
    return compareIds
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is NonNullable<typeof p> => Boolean(p));
  }, [compareIds, data?.products]);

  const allAttrKeys = useMemo(() => {
    const keys = new Set<string>();
    for (const p of comparedProducts) {
      for (const a of p.attributes) keys.add(a.key);
    }
    return Array.from(keys);
  }, [comparedProducts]);

  if (comparedProducts.length === 0) return null;

  return (
    <>
      <div className="fixed bottom-20 md:bottom-5 left-1/2 -translate-x-1/2 z-40 bg-ornate-moss text-white px-4 py-2.5 rounded-full shadow-xl border border-white/15 flex items-center gap-3 max-w-[92vw]">
        <GitCompareArrows size={16} className="text-ornate-gold shrink-0" />
        <span className="text-xs font-semibold truncate price-nums">
          Compare ({comparedProducts.length}/3)
        </span>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="px-3 py-1 rounded-full bg-ornate-gold text-ornate-softblack text-xs font-semibold shrink-0"
        >
          Compare Now
        </button>
        <button
          type="button"
          onClick={clearCompare}
          aria-label="Clear compare list"
          className="p-1 text-white/70 hover:text-white"
        >
          <X size={14} />
        </button>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-ornate-softblack/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[88vh] rounded-3xl border border-ornate-border shadow-2xl flex flex-col overflow-hidden">
            <div className="px-6 py-4 bg-ornate-cream border-b border-ornate-border flex items-center justify-between">
              <h2 className="font-serif text-xl text-ornate-charcoal">
                Compare Furniture Pieces
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center text-ornate-charcoal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="overflow-x-auto p-6">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-ornate-border">
                    <th className="py-3 pr-4 w-36 text-xs font-semibold uppercase tracking-wider text-ornate-muted">
                      Piece
                    </th>
                    {comparedProducts.map((p) => (
                      <th key={p.id} className="py-3 px-4 min-w-[200px] align-top">
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => toggleCompare(p.id, p.name)}
                            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/95 border border-ornate-border flex items-center justify-center text-ornate-charcoal"
                          >
                            <X size={12} />
                          </button>
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-32 object-cover rounded-xl mb-2 bg-ornate-cream"
                          />
                          <Link
                            to={`/shop/${p.slug}`}
                            onClick={() => setModalOpen(false)}
                            className="font-sans font-semibold text-base text-ornate-charcoal hover:text-ornate-moss line-clamp-2"
                          >
                            {p.name}
                          </Link>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-ornate-border text-xs">
                  <tr>
                    <td className="py-3 pr-4 font-semibold text-ornate-muted">Price</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="py-3 px-4 font-bold text-base font-sans price-nums">
                        {formatINR(p.price)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-semibold text-ornate-muted">Brand</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="py-3 px-4">{p.brand}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-semibold text-ornate-muted">Collection</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="py-3 px-4">{p.subcategoryName}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-semibold text-ornate-muted">Availability</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="py-3 px-4">
                        {p.inStock ? `${p.stockCount} in stock` : "Out of Stock"}
                      </td>
                    ))}
                  </tr>
                  {allAttrKeys.map((key) => (
                    <tr key={key}>
                      <td className="py-3 pr-4 font-semibold text-ornate-muted">
                        {formatAttributeKey(key)}
                      </td>
                      {comparedProducts.map((p) => (
                        <td key={p.id} className="py-3 px-4">
                          {p.attributes.find((a) => a.key === key)?.value || "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td className="py-3 pr-4" />
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="py-3 px-4">
                        <button
                          type="button"
                          disabled={!p.inStock}
                          onClick={() => void addToCart(p, 1, true)}
                          className="w-full ornate-btn-primary py-2 text-xs gap-1.5 disabled:opacity-50"
                        >
                          <ShoppingBag size={13} /> Add to Bag
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
