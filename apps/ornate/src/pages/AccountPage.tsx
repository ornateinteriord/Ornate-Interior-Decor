import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Heart,
  LogOut,
  MapPin,
  Package,
  Plus,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";
import { formatINR, getApiErrorMessage, ORDER_STATUS_LABELS } from "@ornate/utils";
import type { AddressType, OrderRecord, UserAddress } from "@/types/furniture";
import Seo from "@/components/seo/Seo";
import PageHeader from "@/components/ui-components/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { ecommerceApi } from "@/services/ecommerceApi";

const AccountPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isLoading, logout, setUserState } = useAuth();
  const [tab, setTab] = useState<"orders" | "addresses" | "profile">("orders");

  // Profile State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Address Form
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addrForm, setAddrForm] = useState({
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    landmark: "",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "",
    type: "Home" as AddressType,
    isDefault: false,
  });

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone);
      setAddrForm((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name,
        phone: prev.phone || user.phone,
      }));
    }
  }, [user]);

  const { data: orders = [] } = useQuery<OrderRecord[]>({
    queryKey: ["my-orders"],
    enabled: isAuthenticated,
    queryFn: ecommerceApi.getOrders,
  });

  const { data: addresses = [] } = useQuery<UserAddress[]>({
    queryKey: ["my-addresses"],
    enabled: isAuthenticated,
    queryFn: ecommerceApi.getAddresses,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ornate-offwhite text-sm">
        Loading account...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login?redirect=/account" replace />;
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const updated = await ecommerceApi.updateMe({
        name,
        phone,
        ...(newPassword ? { currentPassword, newPassword } : {}),
      });
      setUserState(updated);
      setCurrentPassword("");
      setNewPassword("");
      toast.success("Profile updated");
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Failed to update profile"));
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ecommerceApi.addAddress(addrForm);
      setShowAddAddress(false);
      setAddrForm({
        fullName: user.name,
        phone: user.phone,
        line1: "",
        line2: "",
        landmark: "",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "",
        type: "Home",
        isDefault: false,
      });
      void queryClient.invalidateQueries({ queryKey: ["my-addresses"] });
      toast.success("Address added");
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Could not add address"));
    }
  };

  return (
    <div className="bg-ornate-offwhite min-h-screen pb-16">
      <Seo
        title="My Account"
        description="Manage your Ornate Interior Decor orders, addresses, and profile."
        path="/account"
        noIndex
      />

      <div className="hidden md:block">
        <PageHeader
          subtitle="Customer Portal"
          title={`Welcome, ${user.name}`}
          description={`${user.email} · ${user.phone}`}
          breadcrumbs={[
            { name: "Home", path: "/" },
            { name: "Account", path: "/account" },
          ]}
          aside={
            <button
              type="button"
              onClick={logout}
              className="ornate-btn-outline py-2.5 px-4 gap-2"
            >
              <LogOut size={14} /> Sign Out
            </button>
          }
        />
      </div>

      <section className="py-8 md:py-12">
        <div className="ornate-container space-y-6">
          {/* Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ornate-gold/20 pb-3">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setTab("orders")}
                className={`px-4 py-2 rounded-sm text-xs font-display uppercase tracking-wider inline-flex items-center gap-1.5 ${
                  tab === "orders"
                    ? "bg-ornate-charcoal text-white"
                    : "bg-white border border-ornate-gold/25 text-ornate-charcoal"
                }`}
              >
                <Package size={14} /> Orders ({orders.length})
              </button>
              <button
                type="button"
                onClick={() => setTab("addresses")}
                className={`px-4 py-2 rounded-sm text-xs font-display uppercase tracking-wider inline-flex items-center gap-1.5 ${
                  tab === "addresses"
                    ? "bg-ornate-charcoal text-white"
                    : "bg-white border border-ornate-gold/25 text-ornate-charcoal"
                }`}
              >
                <MapPin size={14} /> Addresses ({addresses.length})
              </button>
              <button
                type="button"
                onClick={() => setTab("profile")}
                className={`px-4 py-2 rounded-sm text-xs font-display uppercase tracking-wider inline-flex items-center gap-1.5 ${
                  tab === "profile"
                    ? "bg-ornate-charcoal text-white"
                    : "bg-white border border-ornate-gold/25 text-ornate-charcoal"
                }`}
              >
                <UserIcon size={14} /> Profile &amp; Security
              </button>
              <Link
                to="/wishlist"
                className="px-4 py-2 rounded-sm text-xs font-display uppercase tracking-wider bg-white border border-ornate-gold/25 text-ornate-charcoal inline-flex items-center gap-1.5"
              >
                <Heart size={14} /> Wishlist
              </Link>
            </div>

            <button
              type="button"
              onClick={logout}
              className="md:hidden inline-flex items-center gap-1 text-xs text-rose-700 font-medium"
            >
              <LogOut size={13} /> Sign Out
            </button>
          </div>

          {/* Orders Tab */}
          {tab === "orders" && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="bg-white border border-ornate-gold/20 rounded-sm p-10 text-center space-y-3">
                  <p className="font-serif text-2xl">No Orders Yet</p>
                  <p className="text-sm text-ornate-charcoal/70">
                    When you place an order via Razorpay, your tracking and invoice will appear here.
                  </p>
                  <Link to="/shop" className="ornate-btn-primary inline-flex">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                orders.map((order) => (
                  <Link
                    key={order.id}
                    to={`/orders/${order.orderNumber}`}
                    className="block bg-white border border-ornate-gold/25 hover:border-ornate-darkgold rounded-sm p-5 transition-all shadow-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="font-serif text-xl">{order.orderNumber}</span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                              order.paymentStatus === "PAID"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {ORDER_STATUS_LABELS[order.orderStatus] || order.orderStatus}
                          </span>
                        </div>
                        <p className="text-xs text-ornate-charcoal/65 mt-1">
                          {new Date(order.createdAt).toLocaleDateString("en-IN")} ·{" "}
                          {order.items.map((i) => `${i.name} (×${i.quantity})`).join(", ")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-serif text-lg font-semibold">
                          {formatINR(order.pricing.grandTotal)}
                        </p>
                        <p className="text-xs text-ornate-darkgold">
                          View Tracking &amp; Invoice →
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}

          {/* Addresses Tab */}
          {tab === "addresses" && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddAddress((v) => !v)}
                  className="ornate-btn-primary py-2.5 px-4 gap-1.5"
                >
                  <Plus size={14} /> Add New Address
                </button>
              </div>

              {showAddAddress && (
                <form
                  onSubmit={handleAddAddress}
                  className="bg-white border border-ornate-gold/25 rounded-sm p-5 space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Full Name *"
                      value={addrForm.fullName}
                      onChange={(e) =>
                        setAddrForm((p) => ({ ...p, fullName: e.target.value }))
                      }
                      className="px-3 py-2 border border-ornate-gold/30 rounded-sm text-sm"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Phone *"
                      value={addrForm.phone}
                      onChange={(e) =>
                        setAddrForm((p) => ({ ...p, phone: e.target.value }))
                      }
                      className="px-3 py-2 border border-ornate-gold/30 rounded-sm text-sm"
                    />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Street / House No / Flat *"
                    value={addrForm.line1}
                    onChange={(e) =>
                      setAddrForm((p) => ({ ...p, line1: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-ornate-gold/30 rounded-sm text-sm"
                  />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="City *"
                      value={addrForm.city}
                      onChange={(e) =>
                        setAddrForm((p) => ({ ...p, city: e.target.value }))
                      }
                      className="px-3 py-2 border border-ornate-gold/30 rounded-sm text-sm"
                    />
                    <input
                      type="text"
                      required
                      placeholder="State *"
                      value={addrForm.state}
                      onChange={(e) =>
                        setAddrForm((p) => ({ ...p, state: e.target.value }))
                      }
                      className="px-3 py-2 border border-ornate-gold/30 rounded-sm text-sm"
                    />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="Pincode *"
                      value={addrForm.pincode}
                      onChange={(e) =>
                        setAddrForm((p) => ({
                          ...p,
                          pincode: e.target.value.replace(/\D/g, ""),
                        }))
                      }
                      className="px-3 py-2 border border-ornate-gold/30 rounded-sm text-sm"
                    />
                    <select
                      value={addrForm.type}
                      onChange={(e) =>
                        setAddrForm((p) => ({
                          ...p,
                          type: e.target.value as AddressType,
                        }))
                      }
                      className="px-3 py-2 border border-ornate-gold/30 rounded-sm text-sm bg-white"
                    >
                      <option value="Home">Home</option>
                      <option value="Office">Office</option>
                      <option value="Studio">Studio</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={addrForm.isDefault}
                      onChange={(e) =>
                        setAddrForm((p) => ({ ...p, isDefault: e.target.checked }))
                      }
                    />
                    Set as default address
                  </label>
                  <button type="submit" className="ornate-btn-primary py-2.5 px-5">
                    Save Address
                  </button>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="bg-white border border-ornate-gold/25 rounded-sm p-5 flex justify-between gap-4"
                  >
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-[10px] font-display uppercase tracking-wider bg-ornate-cream border border-ornate-gold/25">
                          {addr.type}
                        </span>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-100 text-emerald-800 font-medium">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="font-semibold pt-1">{addr.fullName}</p>
                      <p className="text-xs text-ornate-charcoal/75">
                        {addr.line1}, {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                      <p className="text-xs text-ornate-charcoal/75">
                        Phone: {addr.phone}
                      </p>
                      {!addr.isDefault && (
                        <button
                          type="button"
                          onClick={async () => {
                            await ecommerceApi.updateAddress(addr.id, {
                              isDefault: true,
                            });
                            void queryClient.invalidateQueries({
                              queryKey: ["my-addresses"],
                            });
                          }}
                          className="text-xs text-ornate-darkgold hover:underline pt-1"
                        >
                          Make Default
                        </button>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        await ecommerceApi.deleteAddress(addr.id);
                        void queryClient.invalidateQueries({
                          queryKey: ["my-addresses"],
                        });
                        toast.success("Address deleted");
                      }}
                      className="self-start p-2 text-rose-700 hover:bg-rose-50 rounded"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {tab === "profile" && (
            <form
              onSubmit={handleSaveProfile}
              className="max-w-lg bg-white border border-ornate-gold/25 rounded-sm p-6 space-y-4"
            >
              <h2 className="font-serif text-xl">Profile &amp; Password</h2>
              <div>
                <label className="block text-xs font-medium mb-1">Email</label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full px-3 py-2 border border-ornate-gold/25 rounded-sm bg-gray-100 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-ornate-gold/30 rounded-sm text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-ornate-gold/30 rounded-sm text-sm"
                />
              </div>

              <div className="pt-3 border-t border-ornate-gold/15 space-y-3">
                <p className="text-xs font-display uppercase tracking-wider text-ornate-darkgold">
                  Change Password (Optional)
                </p>
                <input
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-ornate-gold/30 rounded-sm text-sm"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-ornate-gold/30 rounded-sm text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="ornate-btn-primary py-2.5 px-6"
              >
                {savingProfile ? "Saving..." : "Update Profile"}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default AccountPage;
