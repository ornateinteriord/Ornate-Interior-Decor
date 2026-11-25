import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Compass,
  FileText,
  HelpCircle,
  Home,
  Info,
  Layers,
  Mail,
  MapPin,
  Menu,
  Phone,
  Search,
  Shield,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { STUDIO_INFO } from "@/lib/seo";

const PAGE_TITLES: Record<string, string> = {
  "/": "Ornate Studio",
  "/shop": "Furniture Shop",
  "/services": "Design Services",
  "/projects": "Our Projects",
  "/about": "About Studio",
  "/contact": "Contact Studio",
  "/faq": "FAQ",
  "/help": "Help & Support",
  "/privacy-policy": "Privacy Policy",
  "/terms-and-conditions": "Terms & Conditions",
};

const STUDIO_MENU_LINKS = [
  { label: "About Our Studio", path: "/about", icon: Info },
  { label: "Book Consultation", path: "/contact", icon: Mail },
  { label: "Frequently Asked Questions", path: "/faq", icon: HelpCircle },
  { label: "Help & Support", path: "/help", icon: Compass },
  { label: "Privacy Policy", path: "/privacy-policy", icon: Shield },
  { label: "Terms & Conditions", path: "/terms-and-conditions", icon: FileText },
];

export const MobileTopBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === "/";
  const currentTitle = location.pathname.startsWith("/shop/")
    ? "Product Details"
    : PAGE_TITLES[location.pathname] ?? "Ornate Interior";

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 h-14 bg-white/95 backdrop-blur-xl border-b border-ornate-gold/15 px-3 flex items-center justify-between">
      {isHome ? (
        <Link
          to="/"
          className="flex items-center min-w-0 shrink-0"
          aria-label="Ornate Interior Decor Home"
        >
          <img
            src="/Ornate%20Interior%20Decor%20Logo.png"
            alt="Ornate Interior Decor"
            className="h-10 w-auto max-w-[145px] object-contain brightness-0 opacity-90 shrink-0"
          />
        </Link>
      ) : (
        <div className="flex items-center gap-1.5 min-w-0">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Go back"
            className="w-9 h-9 rounded-full flex items-center justify-center text-ornate-charcoal active:bg-ornate-cream transition-colors shrink-0"
          >
            <ChevronLeft size={22} />
          </button>
          <Link
            to="/"
            aria-label="Ornate Interior Decor Home"
            className="w-7 h-7 rounded-lg bg-ornate-cream border border-ornate-gold/25 flex items-center justify-center p-1 shrink-0"
          >
            <img
              src="/favicon.png"
              alt="Ornate"
              className="w-full h-full object-contain brightness-0 opacity-90"
            />
          </Link>
          <h1 className="font-serif text-base sm:text-lg text-ornate-charcoal truncate">
            {currentTitle}
          </h1>
        </div>
      )}

      <div className="flex items-center gap-1.5 shrink-0">
        {location.pathname !== "/shop" && (
          <Link
            to="/shop"
            aria-label="Search and shop furniture"
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-ornate-gold text-ornate-softblack text-xs font-medium shadow-sm active:scale-95 transition-transform"
          >
            <ShoppingBag size={14} aria-hidden="true" />
            <span>Shop Now</span>
          </Link>
        )}
        {isHome && (
          <Link
            to="/shop"
            aria-label="Search furniture"
            className="w-9 h-9 rounded-full bg-ornate-cream flex items-center justify-center text-ornate-charcoal active:scale-95 transition-transform"
          >
            <Search size={17} />
          </Link>
        )}
        <a
          href={STUDIO_INFO.phoneHref}
          aria-label="Call Ornate Studio"
          className="w-9 h-9 rounded-full bg-ornate-cream flex items-center justify-center text-ornate-charcoal active:scale-95 transition-transform"
        >
          <Phone size={16} />
        </a>
      </div>
    </header>
  );
};

export const MobileBottomNav: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isMoreRouteActive = STUDIO_MENU_LINKS.some(
    (item) => item.path === location.pathname
  );

  return (
    <>
      <nav
        aria-label="Mobile App Navigation"
        className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-ornate-gold/20 shadow-[0_-8px_28px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)]"
      >
        <div className="grid grid-cols-5 h-16 px-1">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${location.pathname === "/"
                ? "text-ornate-charcoal"
                : "text-ornate-charcoal/55"
              }`}
          >
            <span
              className={`px-3 py-1 rounded-full transition-colors ${location.pathname === "/" ? "bg-ornate-gold/25" : ""
                }`}
            >
              <Home size={19} strokeWidth={location.pathname === "/" ? 2.3 : 1.8} />
            </span>
            <span>Home</span>
          </Link>

          <Link
            to="/shop"
            className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${location.pathname === "/shop" || location.pathname.startsWith("/shop/")
                ? "text-ornate-charcoal"
                : "text-ornate-charcoal/55"
              }`}
          >
            <span
              className={`px-3 py-1 rounded-full transition-colors ${location.pathname === "/shop" || location.pathname.startsWith("/shop/") ? "bg-ornate-gold/25" : ""
                }`}
            >
              <ShoppingBag
                size={19}
                strokeWidth={location.pathname === "/shop" || location.pathname.startsWith("/shop/") ? 2.3 : 1.8}
              />
            </span>
            <span>Shop</span>
          </Link>

          <Link
            to="/services"
            className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${location.pathname === "/services"
                ? "text-ornate-charcoal"
                : "text-ornate-charcoal/55"
              }`}
          >
            <span
              className={`px-3 py-1 rounded-full transition-colors ${location.pathname === "/services" ? "bg-ornate-gold/25" : ""
                }`}
            >
              <Sparkles
                size={19}
                strokeWidth={location.pathname === "/services" ? 2.3 : 1.8}
              />
            </span>
            <span>Services</span>
          </Link>

          <Link
            to="/projects"
            className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${location.pathname === "/projects"
                ? "text-ornate-charcoal"
                : "text-ornate-charcoal/55"
              }`}
          >
            <span
              className={`px-3 py-1 rounded-full transition-colors ${location.pathname === "/projects" ? "bg-ornate-gold/25" : ""
                }`}
            >
              <Layers
                size={19}
                strokeWidth={location.pathname === "/projects" ? 2.3 : 1.8}
              />
            </span>
            <span>Projects</span>
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${isMoreRouteActive
                ? "text-ornate-charcoal"
                : "text-ornate-charcoal/55"
              }`}
          >
            <span
              className={`px-3 py-1 rounded-full transition-colors ${isMoreRouteActive ? "bg-ornate-gold/25" : ""
                }`}
            >
              <Menu size={19} strokeWidth={isMoreRouteActive ? 2.3 : 1.8} />
            </span>
            <span>More</span>
          </button>
        </div>
      </nav>

      {/* Studio & More Native Bottom Sheet */}
      <Drawer open={menuOpen} onOpenChange={setMenuOpen}>
        <DrawerContent className="bg-ornate-offwhite rounded-t-2xl max-h-[85vh]">
          <DrawerHeader className="text-left pb-3.5 border-b border-ornate-gold/15">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1">
                <img
                  src="/Ornate%20Interior%20Decor%20Logo.png"
                  alt={STUDIO_INFO.name}
                  className="h-10 w-auto object-contain brightness-0 opacity-90"
                />
                <DrawerTitle className="sr-only">
                  {STUDIO_INFO.name}
                </DrawerTitle>
                <DrawerDescription className="text-xs text-ornate-charcoal/70 flex items-center gap-1">
                  <MapPin size={11} className="text-ornate-darkgold shrink-0" />
                  Vijayanagar, Bengaluru
                </DrawerDescription>
              </div>
              <div className="w-11 h-11 rounded-xl bg-ornate-cream border border-ornate-gold/25 flex items-center justify-center p-1.5 shrink-0">
                <img
                  src="/favicon.png"
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full object-contain brightness-0 opacity-85"
                />
              </div>
            </div>
          </DrawerHeader>

          <div className="p-4 space-y-4 overflow-y-auto">
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href={STUDIO_INFO.phoneHref}
                className="flex items-center justify-center gap-2 h-11 rounded-xl bg-ornate-charcoal text-white text-xs font-medium"
              >
                <Phone size={15} />
                Call Studio
              </a>
              <a
                href={`mailto:${STUDIO_INFO.email}`}
                className="flex items-center justify-center gap-2 h-11 rounded-xl bg-white border border-ornate-gold/30 text-ornate-charcoal text-xs font-medium"
              >
                <Mail size={15} className="text-ornate-darkgold" />
                Email Team
              </a>
            </div>

            <div className="bg-white rounded-xl border border-ornate-gold/20 divide-y divide-ornate-gold/10 overflow-hidden">
              {STUDIO_MENU_LINKS.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3.5 text-sm transition-colors ${active
                        ? "bg-ornate-cream/70 font-medium text-ornate-charcoal"
                        : "text-ornate-charcoal active:bg-ornate-cream/50"
                      }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon
                        size={18}
                        className={
                          active
                            ? "text-ornate-darkgold"
                            : "text-ornate-charcoal/60"
                        }
                      />
                      {item.label}
                    </span>
                    <ChevronRight size={16} className="text-ornate-charcoal/35" />
                  </Link>
                );
              })}
            </div>

            <div className="text-center text-[11px] text-ornate-charcoal/55 pb-2">
              <p>Mon – Fri: 9 AM – 6 PM · Sat: 10 AM – 4 PM</p>
              <p className="mt-0.5">
                &copy; {new Date().getFullYear()} {STUDIO_INFO.name}
              </p>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};
