import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Compass,
  FileText,
  FolderKanban,
  Heart,
  HelpCircle,
  Home,
  Info,
  Mail,
  MapPin,
  Menu,
  Package,
  Phone,
  Search,
  Shield,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  User,
} from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { STUDIO_INFO } from "@/lib/seo";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useStoreExtras } from "@/context/StoreExtrasContext";
import { useGlobalSearch } from "@/context/SearchContext";

const PAGE_TITLES: Record<string, string> = {
  "/": "Ornate Studio",
  "/shop": "Furniture Store",
  "/cart": "Shopping Bag",
  "/wishlist": "Saved Wishlist",
  "/login": "Sign In",
  "/register": "Create Account",
  "/checkout": "Secure Checkout",
  "/account": "My Account",
  "/services": "Design Services",
  "/projects": "Portfolio Projects",
  "/about": "About Studio",
  "/contact": "Contact Studio",
  "/faq": "FAQ",
  "/help": "Help & Support",
  "/privacy-policy": "Privacy Policy",
  "/terms-and-conditions": "Terms & Conditions",
};

const STUDIO_MENU_LINKS = [
  { label: "Portfolio Projects", path: "/projects", icon: FolderKanban },
  { label: "My Orders & Account", path: "/account", icon: Package },
  { label: "Saved Wishlist", path: "/wishlist", icon: Heart },
  { label: "About Our Studio", path: "/about", icon: Info },
  { label: "Book Consultation", path: "/contact", icon: Mail },
  { label: "FAQ", path: "/faq", icon: HelpCircle },
  { label: "Help & Visit Prep", path: "/help", icon: Compass },
  { label: "Privacy Policy", path: "/privacy-policy", icon: Shield },
  { label: "Terms & Conditions", path: "/terms-and-conditions", icon: FileText },
];

export const MobileTopBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount, setDrawerOpen } = useCart();
  const { isAuthenticated } = useAuth();
  const { openSearch } = useGlobalSearch();

  const isHome = location.pathname === "/";
  const currentTitle = location.pathname.startsWith("/shop/")
    ? "Furniture Details"
    : location.pathname.startsWith("/orders/")
    ? "Order Tracking"
    : PAGE_TITLES[location.pathname] ?? "Ornate Interior";

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 h-14 bg-white/95 backdrop-blur-xl border-b border-ornate-border px-3 flex items-center justify-between gap-2">
      {isHome ? (
        <Link
          to="/"
          className="flex items-center min-w-0 shrink-0"
          aria-label="Ornate Interior Decor Home"
        >
          <img
            src="/Ornate%20Interior%20Decor%20Logo.png"
            alt="Ornate Interior Decor"
            className="h-9 w-auto max-w-[132px] object-contain brightness-[0.22] contrast-125 shrink-0"
          />
        </Link>
      ) : (
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Go back"
            className="w-9 h-9 rounded-full flex items-center justify-center text-ornate-charcoal bg-ornate-offwhite border border-ornate-border active:scale-95 transition-transform shrink-0"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="font-serif text-[17px] font-medium text-ornate-charcoal truncate">
            {currentTitle}
          </h1>
        </div>
      )}

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={openSearch}
          aria-label="Search store and pages"
          className="w-9 h-9 rounded-full bg-ornate-offwhite border border-ornate-border flex items-center justify-center text-ornate-charcoal active:scale-95 transition-transform"
        >
          <Search size={17} />
        </button>

        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open shopping bag"
          className="relative w-9 h-9 rounded-full bg-ornate-offwhite border border-ornate-border flex items-center justify-center text-ornate-charcoal active:scale-95 transition-transform"
        >
          <ShoppingCart size={17} />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-ornate-moss text-white text-[10px] font-bold flex items-center justify-center price-nums">
              {itemCount}
            </span>
          )}
        </button>

        <Link
          to={isAuthenticated ? "/account" : "/login"}
          aria-label={isAuthenticated ? "My Account" : "Sign In"}
          className={`w-9 h-9 rounded-full flex items-center justify-center border active:scale-95 transition-transform ${
            isAuthenticated
              ? "bg-ornate-sage border-ornate-moss/25 text-ornate-moss"
              : "bg-ornate-offwhite border-ornate-border text-ornate-charcoal"
          }`}
        >
          <User size={17} />
        </Link>
      </div>
    </header>
  );
};

export const MobileBottomNav: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { itemCount } = useCart();
  const { wishlistIds } = useStoreExtras();
  const { openSearch } = useGlobalSearch();

  const isShopActive =
    location.pathname === "/shop" || location.pathname.startsWith("/shop/");
  const isMoreRouteActive = STUDIO_MENU_LINKS.some(
    (item) => item.path === location.pathname
  );

  const navItems = [
    {
      label: "Home",
      to: "/",
      icon: Home,
      active: location.pathname === "/",
    },
    {
      label: "Shop",
      to: "/shop",
      icon: ShoppingBag,
      active: isShopActive,
    },
    {
      label: "Services",
      to: "/services",
      icon: Sparkles,
      active: location.pathname === "/services",
    },
    {
      label: "Projects",
      to: "/projects",
      icon: FolderKanban,
      active: location.pathname === "/projects",
    },
  ];

  return (
    <>
      <nav
        aria-label="Mobile App Navigation"
        className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-ornate-border shadow-[0_-6px_24px_rgba(20,18,16,0.06)] pb-[env(safe-area-inset-bottom)]"
      >
        <div className="grid grid-cols-5 h-16 px-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors ${
                  item.active ? "text-ornate-moss font-semibold" : "text-ornate-muted"
                }`}
              >
                <span
                  className={`px-3.5 py-1 rounded-full transition-colors ${
                    item.active ? "bg-ornate-moss text-white" : ""
                  }`}
                >
                  <Icon size={18} strokeWidth={item.active ? 2.2 : 1.8} />
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors ${
              isMoreRouteActive ? "text-ornate-moss font-semibold" : "text-ornate-muted"
            }`}
          >
            <span
              className={`relative px-3.5 py-1 rounded-full transition-colors ${
                isMoreRouteActive ? "bg-ornate-moss text-white" : ""
              }`}
            >
              <Menu size={18} strokeWidth={isMoreRouteActive ? 2.2 : 1.8} />
              {(itemCount > 0 || wishlistIds.length > 0) && !isMoreRouteActive && (
                <span className="absolute top-0.5 right-2 w-2 h-2 rounded-full bg-ornate-darkgold" />
              )}
            </span>
            <span>Menu</span>
          </button>
        </div>
      </nav>

      <Drawer open={menuOpen} onOpenChange={setMenuOpen}>
        <DrawerContent className="bg-ornate-offwhite rounded-t-3xl max-h-[88vh]">
          <DrawerHeader className="text-left pb-3.5 border-b border-ornate-border">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1">
                <img
                  src="/Ornate%20Interior%20Decor%20Logo.png"
                  alt={STUDIO_INFO.name}
                  className="h-9 w-auto object-contain brightness-[0.22] contrast-125"
                />
                <DrawerTitle className="sr-only">{STUDIO_INFO.name}</DrawerTitle>
                <DrawerDescription className="text-xs text-ornate-muted flex items-center gap-1">
                  <MapPin size={12} className="text-ornate-darkgold shrink-0" />
                  Vijayanagar, Bengaluru
                </DrawerDescription>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  openSearch();
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-ornate-border text-xs font-semibold text-ornate-charcoal"
              >
                <Search size={14} className="text-ornate-moss" /> Search
              </button>
            </div>
          </DrawerHeader>

          <div className="p-4 space-y-4 overflow-y-auto">
            {/* Quick Action Tiles */}
            <div className="grid grid-cols-2 gap-2.5">
              <Link
                to="/cart"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-ornate-moss text-white"
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingCart size={18} className="text-ornate-gold" />
                  <span className="text-xs font-semibold">Shopping Bag</span>
                </div>
                {itemCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-ornate-gold text-ornate-softblack text-[11px] font-bold price-nums">
                    {itemCount}
                  </span>
                )}
              </Link>
              <Link
                to="/wishlist"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-ornate-border text-ornate-charcoal"
              >
                <div className="flex items-center gap-2.5">
                  <Heart size={18} className="text-ornate-darkgold" />
                  <span className="text-xs font-semibold">Wishlist</span>
                </div>
                {wishlistIds.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-ornate-cream text-ornate-charcoal text-[11px] font-bold price-nums">
                    {wishlistIds.length}
                  </span>
                )}
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <a
                href={STUDIO_INFO.phoneHref}
                className="flex items-center justify-center gap-2 h-11 rounded-full bg-ornate-gold text-ornate-softblack text-xs font-semibold"
              >
                <Phone size={15} />
                Call Studio
              </a>
              <Link
                to="/account"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 h-11 rounded-full bg-white border border-ornate-border text-ornate-charcoal text-xs font-semibold"
              >
                <User size={15} className="text-ornate-moss" />
                My Account
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-ornate-border divide-y divide-ornate-border overflow-hidden">
              {STUDIO_MENU_LINKS.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3.5 text-sm transition-colors ${
                      active
                        ? "bg-ornate-sage/60 font-semibold text-ornate-moss"
                        : "text-ornate-charcoal active:bg-ornate-cream/60"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon
                        size={18}
                        className={
                          active ? "text-ornate-moss" : "text-ornate-darkgold"
                        }
                      />
                      {item.label}
                    </span>
                    <ChevronRight size={16} className="text-ornate-muted" />
                  </Link>
                );
              })}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};
