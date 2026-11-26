import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  Gift,
  Lock,
  MapPin,
  Plus,
  RefreshCw,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import { formatINR, getApiErrorMessage } from "@ornate/utils";
import type { AddressType, OrderRecord, UserAddress } from "@/types/furniture";
import Seo from "@/components/seo/Seo";
import PageHeader from "@/components/ui-components/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { ecommerceApi, type RazorpayOrderCreateResponse } from "@/services/ecommerceApi";
import { RazorpayCheckoutModal } from "@/components/ecommerce/RazorpayCheckoutModal";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const { items, summary, couponCode, applyCoupon, refreshCart } = useCart();

  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("Bengaluru");
  const [state, setState] = useState("Karnataka");
  const [pincode, setPincode] = useState("");
  const [addressType, setAddressType] = useState<AddressType>("Home");
  const [savingAddress, setSavingAddress] = useState(false);

  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [giftWrap, setGiftWrap] = useState(false);
  const [promoInput, setPromoInput] = useState("");

  const [creatingOrder, setCreatingOrder] = useState(false);
  const [rzpSession, setRzpSession] = useState<RazorpayOrderCreateResponse | null>(
    null
  );
  const [failedOrder, setFailedOrder] = useState<{
    order: OrderRecord;
    reason: string;
  } | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (user) {
      setFullName((prev) => prev || user.name);
      setPhone((prev) => prev || user.phone);
    }
    ecommerceApi
      .getAddresses()
      .then((list) => {
        setAddresses(list);
        if (list.length > 0) {
          const def = list.find((a) => a.isDefault) || list[0];
          setSelectedAddressId(def.id);
          setShowNewAddressForm(false);
        } else {
          setShowNewAddressForm(true);
        }
      })
      .catch(() => {
        setShowNewAddressForm(true);
      });
  }, [isAuthenticated, user]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ornate-offwhite text-sm">
        Checking account session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login?redirect=/checkout" replace />;
  }

  if (items.length === 0 && !rzpSession && !failedOrder) {
    return (
      <div className="min-h-screen bg-ornate-offwhite pt-14 md:pt-32 pb-16 px-4">
        <div className="max-w-lg mx-auto ornate-card p-10 text-center space-y-4">
          <h1 className="font-serif text-3xl text-ornate-charcoal">
            No Items to Checkout
          </h1>
          <p className="text-sm text-ornate-muted">
            Your shopping bag is currently empty. Add furniture pieces before checking out.
          </p>
          <Link to="/shop" className="ornate-btn-primary inline-flex">
            Return to Store
          </Link>
        </div>
      </div>
    );
  }

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddress(true);
    try {
      const created = await ecommerceApi.addAddress({
        fullName,
        phone,
        line1,
        line2,
        landmark,
        city,
        state,
        pincode,
        type: addressType,
        isDefault: addresses.length === 0,
      });
      setAddresses((prev) => [created, ...prev]);
      setSelectedAddressId(created.id);
      setShowNewAddressForm(false);
      toast.success("Delivery address saved");
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Invalid address details"));
    } finally {
      setSavingAddress(false);
    }
  };

  const handleStartRazorpayCheckout = async () => {
    if (!selectedAddressId) {
      toast.error("Please select or save a delivery address first.");
      return;
    }

    setCreatingOrder(true);
    setFailedOrder(null);
    try {
      const session = await ecommerceApi.createRazorpayOrder({
        addressId: selectedAddressId,
        couponCode,
        deliveryNotes,
        giftWrap,
      });
      setRzpSession(session);
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Could not initiate Razorpay checkout"));
    } finally {
      setCreatingOrder(false);
    }
  };

  const handleRetryFailedPayment = async () => {
    if (!failedOrder) return;
    setCreatingOrder(true);
    try {
      const session = await ecommerceApi.retryOrderPayment(failedOrder.order.id);
      setFailedOrder(null);
      setRzpSession(session);
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Could not retry payment"));
    } finally {
      setCreatingOrder(false);
    }
  };

  return (
    <div className="bg-ornate-offwhite min-h-screen pb-16">
      <Seo
        title="Secure Razorpay Checkout"
        description="Complete your Ornate Interior Decor furniture purchase securely online via Razorpay."
        path="/checkout"
        noIndex
      />

      <div className="hidden md:block">
        <PageHeader
          subtitle="Encrypted Online Checkout"
          title="Checkout & Razorpay Payment"
          description="Select your delivery address and pay securely online via Razorpay."
          breadcrumbs={[
            { name: "Home", path: "/" },
            { name: "Bag", path: "/cart" },
            { name: "Checkout", path: "/checkout" },
          ]}
        />
      </div>

      <section className="py-8 md:py-12">
        <div className="ornate-container grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Address & Options */}
          <div className="lg:col-span-7 space-y-6">
            {failedOrder && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-rose-700 shrink-0 mt-0.5" size={20} />
                  <div>
                    <h2 className="font-serif text-lg text-rose-900">
                      Payment Not Completed ({failedOrder.order.orderNumber})
                    </h2>
                    <p className="text-xs text-rose-800 mt-1">{failedOrder.reason}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={creatingOrder}
                    onClick={handleRetryFailedPayment}
                    className="px-4 py-2 bg-rose-700 text-white text-xs font-semibold rounded-full inline-flex items-center gap-1.5 hover:bg-rose-800"
                  >
                    <RefreshCw size={13} /> Retry Razorpay Payment
                  </button>
                  <Link
                    to={`/orders/${failedOrder.order.orderNumber}`}
                    className="px-4 py-2 border border-rose-300 text-rose-800 text-xs font-semibold rounded-full"
                  >
                    View Order Attempt
                  </Link>
                </div>
              </div>
            )}

            {/* Step 1: Delivery Address */}
            <div className="ornate-card p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-ornate-border pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-ornate-moss text-white text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <MapPin size={17} className="text-ornate-darkgold" />
                  <h2 className="font-serif text-xl text-ornate-charcoal">
                    Delivery Address
                  </h2>
                </div>
                {addresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowNewAddressForm((v) => !v)}
                    className="text-xs font-semibold text-ornate-moss inline-flex items-center gap-1 hover:underline"
                  >
                    <Plus size={14} />{" "}
                    {showNewAddressForm ? "Hide Form" : "Add New Address"}
                  </button>
                )}
              </div>

              {addresses.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {addresses.map((addr) => {
                    const selected = selectedAddressId === addr.id;
                    return (
                      <button
                        key={addr.id}
                        type="button"
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`text-left p-4 rounded-2xl border transition-all ${
                          selected
                            ? "border-ornate-moss bg-ornate-sage/45 ring-1 ring-ornate-moss"
                            : "border-ornate-border bg-ornate-offwhite hover:border-ornate-moss/60"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-semibold px-2.5 py-0.5 bg-white border border-ornate-border rounded-full">
                            {addr.type}
                          </span>
                          {selected && (
                            <CheckCircle2 size={16} className="text-ornate-moss" />
                          )}
                        </div>
                        <p className="font-semibold text-sm text-ornate-charcoal">
                          {addr.fullName}
                        </p>
                        <p className="text-xs text-ornate-muted mt-1 leading-relaxed">
                          {addr.line1}
                          {addr.line2 ? `, ${addr.line2}` : ""}
                          <br />
                          {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="text-xs text-ornate-muted mt-1">
                          Phone: {addr.phone}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}

              {showNewAddressForm && (
                <form
                  onSubmit={handleSaveAddress}
                  className="bg-ornate-offwhite border border-ornate-border rounded-2xl p-4 space-y-3"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-ornate-darkgold">
                    Add Delivery Address
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Recipient Full Name *"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="ornate-input"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Mobile Number *"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="ornate-input"
                    />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Flat, House No, Street, Apartment *"
                    value={line1}
                    onChange={(e) => setLine1(e.target.value)}
                    className="ornate-input"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Area / Colony (Optional)"
                      value={line2}
                      onChange={(e) => setLine2(e.target.value)}
                      className="ornate-input"
                    />
                    <input
                      type="text"
                      placeholder="Landmark (Optional)"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      className="ornate-input"
                    />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="City *"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="ornate-input"
                    />
                    <input
                      type="text"
                      required
                      placeholder="State *"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="ornate-input"
                    />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="6-Digit Pincode *"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                      className="ornate-input"
                    />
                    <select
                      value={addressType}
                      onChange={(e) => setAddressType(e.target.value as AddressType)}
                      className="ornate-input"
                    >
                      <option value="Home">Home</option>
                      <option value="Office">Office</option>
                      <option value="Studio">Studio</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={savingAddress}
                    className="ornate-btn-primary py-2.5 px-5 text-xs"
                  >
                    {savingAddress ? "Saving..." : "Save & Use This Address"}
                  </button>
                </form>
              )}
            </div>

            {/* Step 2: Delivery Instructions & Gift Wrap */}
            <div className="ornate-card p-6 space-y-4">
              <div className="flex items-center gap-2.5 border-b border-ornate-border pb-3">
                <span className="w-7 h-7 rounded-full bg-ornate-moss text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h2 className="font-serif text-xl text-ornate-charcoal">
                  Delivery Preferences
                </h2>
              </div>
              <textarea
                rows={2}
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                placeholder="Floor / service elevator instructions, preferred delivery window, or assembly notes..."
                className="ornate-input"
              />
              <label className="flex items-center gap-2.5 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={giftWrap}
                  onChange={(e) => setGiftWrap(e.target.checked)}
                  className="accent-ornate-moss w-4 h-4"
                />
                <Gift size={15} className="text-ornate-darkgold" />
                Include complimentary Ornate Studio welcome card &amp; protective wrapping
              </label>
            </div>

            {/* Step 3: Online Payment Notice (Razorpay Only) */}
            <div className="ornate-card p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-ornate-moss text-white text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <CreditCard size={18} className="text-ornate-darkgold" />
                  <h2 className="font-serif text-xl text-ornate-charcoal">
                    Online Payment (Razorpay)
                  </h2>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                  Online Only
                </span>
              </div>
              <p className="text-xs text-ornate-muted leading-relaxed">
                Cash on Delivery is disabled. Pay securely via UPI, Credit/Debit Card, or NetBanking using Razorpay Test Gateway with full HMAC-SHA256 verification.
              </p>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <aside className="lg:col-span-5 ornate-card p-6 space-y-5 lg:sticky lg:top-24">
            <h2 className="font-serif text-2xl text-ornate-charcoal border-b border-ornate-border pb-3">
              Order Review ({items.length})
            </h2>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3 text-sm">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover bg-ornate-cream shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ornate-charcoal truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-ornate-muted price-nums">
                      Qty {item.quantity} × {formatINR(item.unitPrice)}
                    </p>
                  </div>
                  <span className="font-bold shrink-0 price-nums">
                    {formatINR(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2 border-t border-ornate-border">
              <div className="relative flex-1">
                <Tag
                  size={13}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ornate-darkgold"
                />
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                  placeholder={couponCode ? `Applied: ${couponCode}` : "Promo code"}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-ornate-border rounded-full bg-ornate-offwhite"
                />
              </div>
              <button
                type="button"
                onClick={async () => {
                  if (!promoInput.trim()) return;
                  const ok = await applyCoupon(promoInput.trim());
                  if (ok) setPromoInput("");
                }}
                className="px-4 py-2 bg-ornate-moss text-white text-xs font-semibold rounded-full hover:bg-ornate-mossLight"
              >
                Apply
              </button>
            </div>

            <div className="space-y-2 text-sm border-t border-ornate-border pt-4">
              <div className="flex justify-between">
                <span className="text-ornate-muted">Subtotal</span>
                <span className="price-nums">{formatINR(summary.subtotal)}</span>
              </div>
              {summary.couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Coupon ({summary.couponCode})</span>
                  <span className="price-nums">-{formatINR(summary.couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-ornate-muted">Insured Delivery</span>
                <span className="price-nums">
                  {summary.shippingFee === 0 ? "FREE" : formatINR(summary.shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-ornate-muted">
                <span>GST (18% Included)</span>
                <span className="price-nums">{formatINR(summary.gstAmount)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-3 border-t border-ornate-border">
                <span>Payable Total</span>
                <span className="price-nums">{formatINR(summary.grandTotal)}</span>
              </div>
            </div>

            <button
              type="button"
              disabled={creatingOrder || !selectedAddressId}
              onClick={handleStartRazorpayCheckout}
              className="w-full ornate-btn-primary py-4 gap-2 text-sm disabled:opacity-50"
            >
              <Lock size={15} />
              {creatingOrder
                ? "Initializing Razorpay..."
                : `Pay ${formatINR(summary.grandTotal)} with Razorpay`}
            </button>

            <p className="text-xs text-center text-ornate-muted flex items-center justify-center gap-1.5">
              <ShieldCheck size={14} className="text-ornate-moss shrink-0" />
              Server-verified pricing, stock check &amp; HMAC-SHA256 signature
            </p>
          </aside>
        </div>
      </section>

      <RazorpayCheckoutModal
        session={rzpSession}
        onClose={() => setRzpSession(null)}
        onSuccess={async (order) => {
          setRzpSession(null);
          await refreshCart();
          navigate(`/orders/${order.orderNumber}`);
        }}
        onFailed={(order, reason) => {
          setRzpSession(null);
          setFailedOrder({ order, reason });
        }}
        onCancelled={(order) => {
          setRzpSession(null);
          setFailedOrder({
            order,
            reason: "Payment modal was dismissed before completion.",
          });
        }}
      />
    </div>
  );
};

export default CheckoutPage;
