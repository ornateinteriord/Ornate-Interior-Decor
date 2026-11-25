import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Database,
  IndianRupee,
  Package,
  ShoppingBag,
  Users,
} from "lucide-react";
import { formatINR, ORDER_STATUS_LABELS } from "@ornate/utils";
import { adminApi } from "@/lib/adminApi";

interface DashboardDatabase {
  domain: string;
  dbName: string;
  readyState: string;
  collections?: string[];
}

interface DashboardOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  paymentStatus: string;
  orderStatus: string;
}

interface LowStockItem {
  id: string;
  name: string;
  sku: string;
  stock: number;
  source: string;
}

export const DashboardPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const res = await adminApi.get("/dashboard");
      return res.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 bg-white rounded-lg border border-ornate-gold/20" />
        ))}
      </div>
    );
  }

  const stats = data?.stats || {};

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-display uppercase tracking-widest text-ornate-darkgold">
            Studio Telemetry
          </p>
          <h2 className="font-serif text-3xl text-ornate-charcoal">
            E-Commerce Overview
          </h2>
        </div>
        <Link
          to="/products"
          className="px-4 py-2 bg-ornate-charcoal text-white rounded text-xs font-display uppercase tracking-wider hover:bg-ornate-darkgold transition-colors"
        >
          Manage Combined Products
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-ornate-gold/25 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between text-ornate-darkgold mb-2">
            <span className="text-xs font-display uppercase tracking-wider">Paid Revenue</span>
            <IndianRupee size={18} />
          </div>
          <p className="font-serif text-3xl text-ornate-charcoal">
            {formatINR(stats.totalRevenue || 0)}
          </p>
          <p className="text-xs text-ornate-charcoal/60 mt-1">
            {stats.paidOrders || 0} confirmed Razorpay order(s)
          </p>
        </div>

        <div className="bg-white border border-ornate-gold/25 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between text-ornate-darkgold mb-2">
            <span className="text-xs font-display uppercase tracking-wider">Combined Products</span>
            <Package size={18} />
          </div>
          <p className="font-serif text-3xl text-ornate-charcoal">
            {stats.totalProducts || 0}
          </p>
          <p className="text-xs text-ornate-charcoal/60 mt-1">
            {stats.localProducts || 0} MongoDB + {stats.externalProducts || 0} External API
          </p>
        </div>

        <div className="bg-white border border-ornate-gold/25 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between text-ornate-darkgold mb-2">
            <span className="text-xs font-display uppercase tracking-wider">Orders Queue</span>
            <ShoppingBag size={18} />
          </div>
          <p className="font-serif text-3xl text-ornate-charcoal">
            {stats.pendingFulfillment || 0}
          </p>
          <p className="text-xs text-ornate-charcoal/60 mt-1">
            {stats.totalOrders || 0} total · {stats.failedPayments || 0} failed payments
          </p>
        </div>

        <div className="bg-white border border-ornate-gold/25 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between text-ornate-darkgold mb-2">
            <span className="text-xs font-display uppercase tracking-wider">Customers</span>
            <Users size={18} />
          </div>
          <p className="font-serif text-3xl text-ornate-charcoal">
            {stats.customerCount || 0}
          </p>
          <p className="text-xs text-ornate-charcoal/60 mt-1">
            {stats.activeCoupons || 0} active promo coupon(s)
          </p>
        </div>
      </div>

      {/* Multi-DB Status Strip */}
      <div className="bg-white border border-ornate-gold/25 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <Database size={16} className="text-ornate-darkgold" />
          <h3 className="font-serif text-lg text-ornate-charcoal">
            Connected MongoDB Atlas Databases
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(data?.databases || []).map((db: DashboardDatabase) => (
            <div
              key={db.dbName}
              className="p-3.5 rounded bg-ornate-offwhite border border-ornate-gold/20"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-ornate-charcoal">
                  {db.dbName}
                </span>
                <span className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-100 text-emerald-800">
                  {db.readyState}
                </span>
              </div>
              <p className="text-[11px] text-ornate-charcoal/65 mt-1">
                Domain: {db.domain} · {db.collections?.length || 0} collections
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white border border-ornate-gold/25 rounded-lg overflow-hidden">
          <div className="px-5 py-3.5 border-b border-ornate-gold/15 flex items-center justify-between">
            <h3 className="font-serif text-lg text-ornate-charcoal">Recent Orders</h3>
            <Link to="/orders" className="text-xs text-ornate-darkgold font-medium">
              View All →
            </Link>
          </div>
          <div className="divide-y divide-ornate-gold/10">
            {(data?.recentOrders || []).length === 0 ? (
              <p className="p-6 text-sm text-ornate-charcoal/60">No orders placed yet.</p>
            ) : (
              data.recentOrders.map((o: DashboardOrder) => (
                <div key={o.id} className="px-5 py-3 flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-ornate-charcoal">{o.orderNumber}</p>
                    <p className="text-xs text-ornate-charcoal/60">
                      {o.customerName} · {o.paymentStatus}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatINR(o.total)}</p>
                    <p className="text-[11px] text-ornate-darkgold">
                      {ORDER_STATUS_LABELS[o.orderStatus as keyof typeof ORDER_STATUS_LABELS] ||
                        o.orderStatus}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white border border-ornate-gold/25 rounded-lg overflow-hidden">
          <div className="px-5 py-3.5 border-b border-ornate-gold/15 flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-600" />
            <h3 className="font-serif text-lg text-ornate-charcoal">
              Low Stock Furniture (≤ 5 units)
            </h3>
          </div>
          <div className="divide-y divide-ornate-gold/10">
            {(data?.lowStockProducts || []).length === 0 ? (
              <p className="p-6 text-sm text-emerald-700">
                All combined products have healthy stock levels.
              </p>
            ) : (
              data.lowStockProducts.map((p: LowStockItem) => (
                <div key={p.id} className="px-5 py-3 flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-ornate-charcoal">{p.name}</p>
                    <p className="text-xs text-ornate-charcoal/60">
                      {p.sku} · {p.source === "external" ? "External API" : "Ornate DB"}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded text-xs font-semibold bg-amber-100 text-amber-800">
                    {p.stock} left
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
