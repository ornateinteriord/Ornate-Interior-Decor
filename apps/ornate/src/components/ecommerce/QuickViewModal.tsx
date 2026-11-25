import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  GitCompareArrows,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Star,
  X,
} from "lucide-react";
import type { FurnitureProduct } from "@/types/furniture";
import { formatAttributeKey, formatINR } from "@/lib/furnitureFilters";
import { useCart } from "@/context/CartContext";
import { useStoreExtras } from "@/context/StoreExtrasContext";

interface QuickViewModalProps {
  product: FurnitureProduct | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
}) => {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist, compareIds, toggleCompare } =
    useStoreExtras();
  const [qty, setQty] = useState(1);

  if (!product) return null;

  const wishlisted = isWishlisted(product.id);
  const compared = compareIds.includes(product.id);

  return (
    <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-sm border border-ornate-gold/30 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 relative max-h-[90vh]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 border border-ornate-gold/25 flex items-center justify-center text-ornate-charcoal hover:bg-ornate-cream"
        >
          <X size={16} />
        </button>

        <div className="aspect-[4/3] md:aspect-auto bg-ornate-cream relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.dealActive && (
            <span className="absolute top-3 left-3 px-2.5 py-1 bg-ornate-softblack text-ornate-gold text-[10px] font-display uppercase tracking-widest">
              Deal · {product.savingsPercent}% Off
            </span>
          )}
        </div>

        <div className="p-6 overflow-y-auto flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[11px] font-display uppercase tracking-widest text-ornate-darkgold">
              <span>{product.subcategoryName}</span>
              <span>·</span>
              <span>{product.brand}</span>
            </div>

            <h2 className="font-serif text-2xl text-ornate-charcoal leading-snug">
              {product.name}
            </h2>

            {product.reviewCount > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-ornate-charcoal/80">
                <Star size={14} className="text-amber-500 fill-amber-500" />
                <span className="font-semibold">{product.averageRating}</span>
                <span>({product.reviewCount} reviews)</span>
              </div>
            )}

            <div className="flex items-baseline gap-2.5">
              <span className="font-serif text-2xl font-semibold text-ornate-charcoal">
                {formatINR(product.price)}
              </span>
              {product.mrp && (
                <span className="text-sm text-ornate-charcoal/45 line-through">
                  {formatINR(product.mrp)}
                </span>
              )}
              {product.savingsPercent > 0 && (
                <span className="text-xs font-semibold text-emerald-700">
                  Save {product.savingsPercent}%
                </span>
              )}
            </div>

            <p className="text-xs text-ornate-charcoal/75 leading-relaxed">
              {product.shortDescription || product.longDescription}
            </p>

            {product.attributes.length > 0 && (
              <div className="border-t border-ornate-gold/15 pt-3 space-y-1.5">
                {product.attributes.slice(0, 3).map((attr) => (
                  <div
                    key={attr.key}
                    className="flex justify-between text-xs text-ornate-charcoal/80"
                  >
                    <span className="text-ornate-charcoal/60">
                      {formatAttributeKey(attr.key)}
                    </span>
                    <span className="font-medium">{attr.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3 pt-3 border-t border-ornate-gold/15">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-ornate-gold/30 rounded-sm">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-9 h-10 flex items-center justify-center hover:bg-ornate-cream"
                >
                  <Minus size={13} />
                </button>
                <span className="w-9 text-center text-sm font-medium">{qty}</span>
                <button
                  type="button"
                  disabled={qty >= product.stockCount}
                  onClick={() => setQty((q) => Math.min(product.stockCount, q + 1))}
                  className="w-9 h-10 flex items-center justify-center hover:bg-ornate-cream disabled:opacity-40"
                >
                  <Plus size={13} />
                </button>
              </div>

              <button
                type="button"
                disabled={!product.inStock}
                onClick={async () => {
                  await addToCart(product, qty, true);
                  onClose();
                }}
                className="flex-1 ornate-btn-primary h-10 gap-2 disabled:opacity-50"
              >
                <ShoppingBag size={15} />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>

            <div className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => void toggleWishlist(product.id, product.name)}
                  className={`inline-flex items-center gap-1 ${
                    wishlisted ? "text-rose-700 font-medium" : "text-ornate-charcoal/70"
                  }`}
                >
                  <Heart size={14} className={wishlisted ? "fill-rose-600" : ""} />
                  {wishlisted ? "Saved" : "Wishlist"}
                </button>
                <button
                  type="button"
                  onClick={() => toggleCompare(product.id, product.name)}
                  className={`inline-flex items-center gap-1 ${
                    compared ? "text-ornate-darkgold font-medium" : "text-ornate-charcoal/70"
                  }`}
                >
                  <GitCompareArrows size={14} />
                  {compared ? "Comparing" : "Compare"}
                </button>
              </div>

              <Link
                to={`/shop/${product.slug}`}
                onClick={onClose}
                className="inline-flex items-center gap-1 text-ornate-darkgold font-medium hover:underline"
              >
                Full Details <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
