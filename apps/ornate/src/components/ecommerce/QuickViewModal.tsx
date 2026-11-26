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
    <div className="fixed inset-0 z-50 bg-ornate-softblack/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl border border-ornate-border shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 relative max-h-[90vh]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full bg-white/95 border border-ornate-border flex items-center justify-center text-ornate-charcoal hover:bg-ornate-cream"
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
            <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-ornate-moss text-white text-xs font-semibold">
              Deal · {product.savingsPercent}% Off
            </span>
          )}
        </div>

        <div className="p-6 overflow-y-auto flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-ornate-darkgold">
              <span>{product.subcategoryName}</span>
              <span>·</span>
              <span>{product.brand}</span>
            </div>

            <h2 className="font-serif text-2xl text-ornate-charcoal leading-snug">
              {product.name}
            </h2>

            {product.reviewCount > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-ornate-charcoal">
                <Star size={14} className="text-amber-500 fill-amber-500" />
                <span className="font-semibold">{product.averageRating}</span>
                <span className="text-ornate-muted">({product.reviewCount} reviews)</span>
              </div>
            )}

            <div className="flex items-baseline gap-2.5">
              <span className="font-sans text-2xl font-bold text-ornate-charcoal price-nums">
                {formatINR(product.price)}
              </span>
              {product.mrp && (
                <span className="text-sm text-ornate-muted line-through price-nums">
                  {formatINR(product.mrp)}
                </span>
              )}
              {product.savingsPercent > 0 && (
                <span className="text-xs font-semibold text-emerald-700">
                  Save {product.savingsPercent}%
                </span>
              )}
            </div>

            <p className="text-xs text-ornate-muted leading-relaxed">
              {product.shortDescription || product.longDescription}
            </p>

            {product.attributes.length > 0 && (
              <div className="border-t border-ornate-border pt-3 space-y-1.5">
                {product.attributes.slice(0, 3).map((attr) => (
                  <div
                    key={attr.key}
                    className="flex justify-between text-xs text-ornate-charcoal"
                  >
                    <span className="text-ornate-muted">
                      {formatAttributeKey(attr.key)}
                    </span>
                    <span className="font-semibold">{attr.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3 pt-3 border-t border-ornate-border">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-ornate-border rounded-full bg-ornate-offwhite px-1">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-8 h-9 flex items-center justify-center rounded-full hover:bg-white"
                >
                  <Minus size={13} />
                </button>
                <span className="w-8 text-center text-sm font-bold price-nums">{qty}</span>
                <button
                  type="button"
                  disabled={qty >= product.stockCount}
                  onClick={() => setQty((q) => Math.min(product.stockCount, q + 1))}
                  className="w-8 h-9 flex items-center justify-center rounded-full hover:bg-white disabled:opacity-40"
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
                className="flex-1 ornate-btn-primary h-10 gap-2 text-xs disabled:opacity-50"
              >
                <ShoppingBag size={14} />
                {product.inStock ? "Add to Bag" : "Out of Stock"}
              </button>
            </div>

            <div className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => void toggleWishlist(product.id, product.name)}
                  className={`inline-flex items-center gap-1 font-medium ${
                    wishlisted ? "text-rose-700" : "text-ornate-muted"
                  }`}
                >
                  <Heart size={14} className={wishlisted ? "fill-rose-600" : ""} />
                  {wishlisted ? "Saved" : "Wishlist"}
                </button>
                <button
                  type="button"
                  onClick={() => toggleCompare(product.id, product.name)}
                  className={`inline-flex items-center gap-1 font-medium ${
                    compared ? "text-ornate-moss" : "text-ornate-muted"
                  }`}
                >
                  <GitCompareArrows size={14} />
                  {compared ? "Comparing" : "Compare"}
                </button>
              </div>

              <Link
                to={`/shop/${product.slug}`}
                onClick={onClose}
                className="inline-flex items-center gap-1 text-ornate-moss font-semibold hover:underline"
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
