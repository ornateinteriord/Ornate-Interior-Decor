import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  Database,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ShoppingBag,
  Tag,
  Users,
  X,
} from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";

const NAV_ITEMS = [
  { to: "/", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/products", label: "Products & External API", icon: Package },
  { to: "/orders", label: "Orders & Razorpay", icon: ShoppingBag },
  { to: "/coupons", label: "Coupons & Offers", icon: Tag },
  { to: "/customers", label: "Customers & Reviews", icon: Users },
  { to: "/system", label: "Multi-DB & Logs", icon: Database },
];

export const AdminLayout: React.FC = () => {
  const { admin, logout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ornate-offwhite flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-ornate-softblack text-white flex flex-col justify-between transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
            <div>
              <p className="font-display text-[10px] uppercase tracking-[0.2em] text-ornate-gold">
                Ornate Interior Decor
              </p>
              <h1 className="font-serif text-xl text-white mt-0.5">
                Admin Studio
              </h1>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/70 hover:text-white"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="p-4 space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-md text-sm transition-colors ${
                      isActive
                        ? "bg-ornate-gold text-ornate-softblack font-medium"
                        : "text-white/75 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="px-2">
            <p className="text-xs font-medium text-white truncate">{admin?.name}</p>
            <p className="text-[11px] text-white/55 truncate">{admin?.email}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-white/15 text-xs text-white/85 hover:bg-white/10 transition-colors"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 h-14 bg-white/95 backdrop-blur border-b border-ornate-gold/20 px-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md border border-ornate-gold/25 text-ornate-charcoal"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
            <span className="text-xs font-display uppercase tracking-[0.16em] text-ornate-darkgold">
              Combined Catalog · ImageKit (Ornate_Firnitures) · 4 MongoDB DBs
            </span>
          </div>
          <a
            href="http://localhost:8080/shop"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium text-ornate-charcoal border border-ornate-gold/30 px-3 py-1.5 rounded hover:bg-ornate-cream transition-colors"
          >
            Open Storefront ↗
          </a>
        </header>

        <main className="p-4 lg:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
