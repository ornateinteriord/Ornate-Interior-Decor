import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
} from "lucide-react";
import { formatINR } from "@ornate/utils";
import Seo from "@/components/seo/Seo";
import PageHeader from "@/components/ui-components/PageHeader";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useStoreExtras } from "@/context/StoreExtrasContext";
import { useFurnitureCatalog } from "@/hooks/useFurnitureCatalog";

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isWishlisted, toggleWishlist } = useStoreExtras();
  const { data: catalogData } = useFurnitureCatalog();
  const {
    items,
    summary,
    activeCoupons,
    couponCode,
    addToCart,
    updateQuantity,
    removeItem,
    applyCoupon,
  } = useCart();

  const [promoCode, setPromoCode] = useState("");

  const recommended = useMemo(() => {
    const inCartIds = new Set(items.map((i) => i.productId));
    return (catalogData?.products ?? [])
      .filter((p) => p.inStock && !inCartIds.has(p.id))
      .slice(0, 4);
  }, [catalogData?.products, items]);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/checkout");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className="bg-ornate-offwhite min-h-screen pb-16">
      <Seo
        title="Shopping Bag"
        description="Review your selected Ornate Interior Decor furniture pieces and proceed to Razorpay checkout."
        path="/cart"
        noIndex
      />

      <div className="hidden md:block">
        <PageHeader
          subtitle="Studio Bag"
          title="Your Furniture Bag"
          description="Review quantities, apply studio offers, and proceed to secure online checkout."
          breadcrumbs={[
            { name: "Home", path: "/" },
            { name: "Shop", path: "/shop" },
            { name: "Bag", path: "/cart" },
          ]}
        />
      </div>

      <section className="py-8 md:py-12">
        <div className="ornate-container">
          {items.length === 0 ? (
            <div className="max-w-lg mx-auto ornate-card p-10 text-center space-y-4">
              <ShoppingBag size={42} className="mx-auto text-ornate-darkgold" />
              <h1 className="font-serif text-3xl text-ornate-charcoal">
                Your Bag is Empty
              </h1>
              <p className="text-sm text-ornate-muted">
                Add handcrafted chairs, solid wood desks, or architectural storage to begin.
              </p>
              <Link to="/shop" className="ornate-btn-primary inline-flex items-center gap-2">
                Explore Collection <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="ornate-card p-4 sm:p-5 flex flex-col sm:flex-row gap-4 justify-between"
                  >
                    <div className="flex gap-4">
                      <Link
                        to={`/shop/${item.slug}`}
                        className="w-24 h-24 rounded-xl overflow-hidden bg-ornate-cream shrink-0"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </Link>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-ornate-darkgold">
                          {item.subcategoryName} · {item.brand}
                        </p>
                        <Link
                          to={`/shop/${item.slug}`}
                          className="font-sans font-semibold text-lg text-ornate-charcoal hover:text-ornate-moss"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-ornate-muted">
                          SKU: <span className="font-mono">{item.sku}</span> · {item.stockCount} available
                        </p>
                        <div className="flex items-center gap-4 pt-1">
                          <button
                            type="button"
                            onClick={async () => {
                              if (!isWishlisted(item.productId)) {
                                await toggleWishlist(item.productId, item.name);
                              }
                              await removeItem(item.productId);
                            }}
                            className="text-xs font-semibold text-ornate-moss hover:underline inline-flex items-center gap-1"
                          >
                            <Bookmark size={12} /> Save for Later
                          </button>
                          <button
                            type="button"
                            onClick={() => void removeItem(item.productId)}
                            className="text-xs font-semibold text-rose-700 hover:underline inline-flex items-center gap-1"
                          >
                            <Trash2 size={12} /> Remove
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3">
                      <div className="text-right">
                        <p className="font-sans text-xl font-bold text-ornate-charcoal price-nums">
                          {formatINR(item.unitPrice * item.quantity)}
                        </p>
                        <p className="text-xs text-ornate-muted price-nums">
                          {formatINR(item.unitPrice)} each
                        </p>
                      </div>

                      <div className="flex items-center border border-ornate-border rounded-full bg-ornate-offwhite px-1">
                        <button
                          type="button"
                          onClick={() =>
                            void updateQuantity(item.productId, item.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-9 text-center text-sm font-bold price-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          disabled={item.quantity >= item.stockCount}
                          onClick={() =>
                            void updateQuantity(item.productId, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white disabled:opacity-40"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary Sidebar */}
              <aside className="lg:col-span-4 ornate-card p-6 space-y-5 lg:sticky lg:top-24">
                <h2 className="font-serif text-2xl text-ornate-charcoal border-b border-ornate-border pb-3">
                  Order Summary
                </h2>

                {/* Promo Code */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-ornate-muted flex items-center gap-1.5">
                    <Tag size={13} className="text-ornate-moss" /> Promo Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      className="flex-1 px-3.5 py-2 text-xs border border-ornate-border rounded-full bg-ornate-offwhite"
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        if (!promoCode.trim()) return;
                        const ok = await applyCoupon(promoCode.trim());
                        if (ok) setPromoCode("");
                      }}
                      className="px-4 py-2 bg-ornate-moss text-white text-xs font-semibold rounded-full hover:bg-ornate-mossLight"
                    >
                      Apply
                    </button>
                  </div>
                  {couponCode && (
                    <button
                      type="button"
                      onClick={() => void applyCoupon(null)}
                      className="text-xs font-semibold text-rose-700 hover:underline"
                    >
                      Remove applied coupon ({couponCode})
                    </button>
                  )}

                  {activeCoupons.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <p className="text-xs text-ornate-muted">
                        Available Studio Offers:
                      </p>
                      {activeCoupons.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => void applyCoupon(c.code)}
                          className="w-full text-left p-2.5 rounded-xl border border-dashed border-ornate-border bg-ornate-offwhite hover:border-ornate-moss text-xs flex items-center justify-between"
                        >
                          <span>
                            <strong className="font-mono">{c.code}</strong> — {c.title}
                          </span>
                          <span className="text-ornate-moss font-semibold">Apply</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-sm border-t border-ornate-border pt-4">
                  <div className="flex justify-between">
                    <span className="text-ornate-muted">MRP Total</span>
                    <span className="price-nums">{formatINR(summary.mrpTotal)}</span>
                  </div>
                  {summary.productSavings > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Catalog Savings</span>
                      <span className="price-nums">-{formatINR(summary.productSavings)}</span>
                    </div>
                  )}
                  {summary.couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Coupon ({summary.couponCode})</span>
                      <span className="price-nums">-{formatINR(summary.couponDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-ornate-muted">Delivery</span>
                    <span className="price-nums">
                      {summary.shippingFee === 0 ? (
                        <span className="text-emerald-700 font-semibold">FREE</span>
                      ) : (
                        formatINR(summary.shippingFee)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-ornate-muted">
                    <span>GST (18% Included)</span>
                    <span className="price-nums">{formatINR(summary.gstAmount)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-3 border-t border-ornate-border">
                    <span>Grand Total</span>
                    <span className="price-nums">{formatINR(summary.grandTotal)}</span>
                  </div>
                </div>

                {!isAuthenticated && (
                  <div className="bg-ornate-sage/70 border border-ornate-moss/20 rounded-xl p-3 text-xs text-ornate-moss">
                    <strong>Login Required for Checkout:</strong> Sign in or create an account in seconds — your bag stays saved.
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full ornate-btn-primary py-3.5 gap-2"
                >
                  {isAuthenticated ? "Proceed to Checkout" : "Login & Checkout"}
                  <ArrowRight size={15} />
                </button>

                <div className="space-y-2 text-xs text-ornate-muted pt-2">
                  <p className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-ornate-moss shrink-0" />
                    100% Secure Online Payment via Razorpay
                  </p>
                  <p className="flex items-center gap-2">
                    <Truck size={14} className="text-ornate-moss shrink-0" />
                    Free insured shipping above{" "}
                    <span className="price-nums font-semibold">
                      {formatINR(summary.freeShippingThreshold)}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-ornate-moss shrink-0" />
                    White-glove Bengaluru studio setup available
                  </p>
                </div>
              </aside>
            </div>
          )}

          {/* Cross-sell */}
          {recommended.length > 0 && (
            <div className="mt-14 pt-10 border-t border-ornate-border">
              <h2 className="font-serif text-2xl text-ornate-charcoal mb-6">
                Complete Your Space
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {recommended.map((p) => (
                  <div
                    key={p.id}
                    className="ornate-card overflow-hidden flex flex-col justify-between"
                  >
                    <Link to={`/shop/${p.slug}`} className="aspect-[4/3] bg-ornate-cream block">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    <div className="p-3.5 space-y-2">
                      <Link
                        to={`/shop/${p.slug}`}
                        className="font-sans font-semibold text-sm text-ornate-charcoal line-clamp-1 hover:text-ornate-moss"
                      >
                        {p.name}
                      </Link>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold price-nums">{formatINR(p.price)}</span>
                        <button
                          type="button"
                          onClick={() => void addToCart(p, 1, true)}
                          className="text-xs font-semibold text-ornate-moss hover:underline"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CartPage;
