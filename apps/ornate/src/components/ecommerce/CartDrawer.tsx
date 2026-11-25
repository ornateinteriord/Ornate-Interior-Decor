import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { formatINR } from "@ornate/utils";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useStoreExtras } from "@/context/StoreExtrasContext";

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toggleWishlist, isWishlisted } = useStoreExtras();
  const {
    items,
    itemCount,
    summary,
    activeCoupons,
    couponCode,
    drawerOpen,
    setDrawerOpen,
    updateQuantity,
    removeItem,
    applyCoupon,
  } = useCart();

  const [promoInput, setPromoInput] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  if (!drawerOpen) return null;

  const remainingForFreeShipping = Math.max(
    0,
    summary.freeShippingThreshold - (summary.subtotal - summary.couponDiscount)
  );
  const freeShippingProgress = Math.min(
    100,
    Math.round(
      ((summary.subtotal - summary.couponDiscount) / summary.freeShippingThreshold) * 100
    )
  );

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    setApplyingCoupon(true);
    const ok = await applyCoupon(promoInput.trim());
    if (ok) setPromoInput("");
    setApplyingCoupon(false);
  };

  const handleSaveForLater = async (productId: string, name: string) => {
    if (!isWishlisted(productId)) {
      await toggleWishlist(productId, name);
    }
    await removeItem(productId);
  };

  const handleCheckout = () => {
    setDrawerOpen(false);
    if (!isAuthenticated) {
      navigate("/login?redirect=/checkout");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs"
        onClick={() => setDrawerOpen(false)}
      />

      <aside
        aria-label="Shopping Cart"
        className="relative z-10 w-full max-w-md bg-ornate-offwhite h-full shadow-2xl border-l border-ornate-gold/25 flex flex-col"
      >
        <div className="px-5 py-4 bg-white border-b border-ornate-gold/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag size={18} className="text-ornate-darkgold" />
            <h2 className="font-serif text-xl text-ornate-charcoal">
              Your Studio Bag ({itemCount})
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close cart"
            className="p-2 rounded-full hover:bg-ornate-cream text-ornate-charcoal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Free Shipping Progress */}
        {items.length > 0 && (
          <div className="px-5 py-3 bg-ornate-cream/65 border-b border-ornate-gold/15 space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-ornate-charcoal">
              <Truck size={14} className="text-ornate-darkgold shrink-0" />
              {remainingForFreeShipping === 0 ? (
                <span className="font-medium text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 size={13} /> Unlocked FREE Insured Furniture Delivery!
                </span>
              ) : (
                <span>
                  Add <strong>{formatINR(remainingForFreeShipping)}</strong> more for{" "}
                  <strong>FREE Delivery</strong>
                </span>
              )}
            </div>
            <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
              <div
                className="h-full bg-ornate-darkgold transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="bg-white border border-ornate-gold/20 rounded-sm p-8 text-center space-y-4 my-8">
              <ShoppingBag size={36} className="mx-auto text-ornate-darkgold/70" />
              <div>
                <p className="font-serif text-xl text-ornate-charcoal">
                  Your Bag is Empty
                </p>
                <p className="text-xs text-ornate-charcoal/70 mt-1">
                  Explore ergonomic seating, solid wood desks, and architectural pieces.
                </p>
              </div>
              <Link
                to="/shop"
                onClick={() => setDrawerOpen(false)}
                className="ornate-btn-primary inline-flex items-center gap-2"
              >
                Browse Furniture <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.productId}
                className="bg-white border border-ornate-gold/20 rounded-sm p-3.5 flex gap-3.5"
              >
                <Link
                  to={`/shop/${item.slug}`}
                  onClick={() => setDrawerOpen(false)}
                  className="w-20 h-20 rounded-sm overflow-hidden bg-ornate-cream shrink-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/shop/${item.slug}`}
                        onClick={() => setDrawerOpen(false)}
                        className="font-serif text-sm text-ornate-charcoal hover:text-ornate-darkgold line-clamp-2 leading-snug"
                      >
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => void removeItem(item.productId)}
                        aria-label={`Remove ${item.name}`}
                        className="text-ornate-charcoal/45 hover:text-rose-700 shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="text-[11px] text-ornate-charcoal/60 mt-0.5">
                      {item.brand} · {item.sku}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2">
                    <div className="flex items-center border border-ornate-gold/30 rounded-sm bg-ornate-offwhite">
                      <button
                        type="button"
                        onClick={() =>
                          void updateQuantity(item.productId, item.quantity - 1)
                        }
                        aria-label="Decrease quantity"
                        className="w-7 h-7 flex items-center justify-center text-ornate-charcoal hover:bg-ornate-cream"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-7 text-center text-xs font-medium">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        disabled={item.quantity >= item.stockCount}
                        onClick={() =>
                          void updateQuantity(item.productId, item.quantity + 1)
                        }
                        aria-label="Increase quantity"
                        className="w-7 h-7 flex items-center justify-center text-ornate-charcoal hover:bg-ornate-cream disabled:opacity-40"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold text-ornate-charcoal">
                        {formatINR(item.unitPrice * item.quantity)}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          void handleSaveForLater(item.productId, item.name)
                        }
                        className="text-[10px] text-ornate-darkgold hover:underline inline-flex items-center gap-1"
                      >
                        <Bookmark size={10} /> Save for later
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Promo Code */}
          {items.length > 0 && (
            <div className="bg-white border border-ornate-gold/20 rounded-sm p-3.5 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-medium text-ornate-charcoal">
                <span className="inline-flex items-center gap-1.5">
                  <Tag size={13} className="text-ornate-darkgold" /> Apply Promo Code
                </span>
                {couponCode && (
                  <button
                    type="button"
                    onClick={() => void applyCoupon(null)}
                    className="text-[11px] text-rose-700 hover:underline"
                  >
                    Remove ({couponCode})
                  </button>
                )}
              </div>

              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                  placeholder="Enter code (e.g. ORNATE10)"
                  className="flex-1 px-3 py-1.5 text-xs border border-ornate-gold/30 rounded-sm bg-ornate-offwhite"
                />
                <button
                  type="submit"
                  disabled={applyingCoupon}
                  className="px-3.5 py-1.5 bg-ornate-charcoal text-white text-xs font-display uppercase tracking-wider rounded-sm hover:bg-ornate-darkgold"
                >
                  Apply
                </button>
              </form>

              {activeCoupons.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {activeCoupons.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => void applyCoupon(c.code)}
                      className={`px-2 py-0.5 rounded-sm border text-[10px] font-mono transition-colors ${
                        couponCode === c.code
                          ? "bg-emerald-50 border-emerald-400 text-emerald-800"
                          : "bg-ornate-offwhite border-ornate-gold/30 text-ornate-charcoal hover:border-ornate-darkgold"
                      }`}
                      title={c.description}
                    >
                      {c.code}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Summary & Actions */}
        {items.length > 0 && (
          <div className="p-5 bg-white border-t border-ornate-gold/20 space-y-3">
            <div className="space-y-1.5 text-xs text-ornate-charcoal/80">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatINR(summary.subtotal)}</span>
              </div>
              {summary.productSavings > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Catalog Discount</span>
                  <span>-{formatINR(summary.productSavings)}</span>
                </div>
              )}
              {summary.couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Coupon ({summary.couponCode})</span>
                  <span>-{formatINR(summary.couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {summary.shippingFee === 0 ? (
                    <span className="text-emerald-700 font-medium">FREE</span>
                  ) : (
                    formatINR(summary.shippingFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-ornate-charcoal/55">
                <span>Inclusive of 18% GST</span>
                <span>{formatINR(summary.gstAmount)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-ornate-charcoal pt-2 border-t border-ornate-gold/15">
                <span>Total Payable</span>
                <span className="font-serif">{formatINR(summary.grandTotal)}</span>
              </div>
            </div>

            {!isAuthenticated && (
              <p className="text-[11px] text-ornate-darkgold bg-ornate-cream/70 px-3 py-1.5 rounded-sm">
                Sign in or create a free account at next step to complete Razorpay checkout.
              </p>
            )}

            <div className="grid grid-cols-2 gap-2.5">
              <Link
                to="/cart"
                onClick={() => setDrawerOpen(false)}
                className="ornate-btn-outline text-center py-2.5"
              >
                View Cart
              </Link>
              <button
                type="button"
                onClick={handleCheckout}
                className="ornate-btn-primary py-2.5 gap-1.5"
              >
                Checkout <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};
