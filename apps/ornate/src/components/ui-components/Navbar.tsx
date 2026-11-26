import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronDown,
  Compass,
  HelpCircle,
  Heart,
  Info,
  Menu,
  Phone,
  Search,
  ShoppingBag,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { STUDIO_INFO } from "@/lib/seo";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useStoreExtras } from "@/context/StoreExtrasContext";
import { useGlobalSearch } from "@/context/SearchContext";

const HERO_ROUTES = new Set(["/"]);

const PRIMARY_LINKS = [
  { name: "Home", path: "/" },
  { name: "Shop", path: "/shop" },
  { name: "Services", path: "/services" },
  { name: "Projects", path: "/projects" },
  { name: "Contact", path: "/contact" },
];

const STUDIO_LINKS = [
  { name: "About Our Studio", description: "Philosophy & design process", path: "/about", icon: Info },
  { name: "FAQ", description: "Timelines, pricing & scope", path: "/faq", icon: HelpCircle },
  { name: "Help & Visit Prep", description: "Floor plan checklist & hours", path: "/help", icon: Compass },
];

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [studioOpen, setStudioOpen] = useState(false);
  const studioMenuRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const { itemCount, setDrawerOpen } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { wishlistIds } = useStoreExtras();
  const { openSearch } = useGlobalSearch();

  const hasDarkHero = HERO_ROUTES.has(location.pathname);
  const useLightHeader = isOpen || isScrolled || !hasDarkHero;
  const isStudioRouteActive = STUDIO_LINKS.some(
    (item) => item.path === location.pathname
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setStudioOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        studioMenuRef.current &&
        !studioMenuRef.current.contains(event.target as Node)
      ) {
        setStudioOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isOpen
            ? "bg-ornate-offwhite border-b border-ornate-border"
            : useLightHeader
            ? "bg-white/95 backdrop-blur-md shadow-[0_2px_20px_rgba(20,18,16,0.06)] border-b border-ornate-border"
            : "bg-gradient-to-b from-ornate-softblack/80 via-ornate-softblack/45 to-transparent"
        }`}
      >
        {/* Top Studio Info Strip on Desktop */}
        {!isScrolled && !isOpen && (
          <div
            className={`hidden lg:block border-b text-xs transition-colors ${
              useLightHeader
                ? "bg-ornate-moss text-white/90 border-white/10"
                : "bg-ornate-softblack/60 backdrop-blur-sm text-white/85 border-white/10"
            }`}
          >
            <div className="ornate-container h-8 flex items-center justify-between">
              <p className="truncate">
                Vijayanagar Interior Studio · Bengaluru · Free insured furniture delivery above ₹25,000
              </p>
              <div className="flex items-center gap-5 shrink-0">
                <a
                  href={STUDIO_INFO.phoneHref}
                  className="inline-flex items-center gap-1.5 hover:text-ornate-gold transition-colors"
                >
                  <Phone size={12} aria-hidden="true" />
                  <span>{STUDIO_INFO.phoneDisplay}</span>
                </a>
                <Link
                  to="/help"
                  className="hover:text-ornate-gold transition-colors"
                >
                  Visit &amp; Hours
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="ornate-container">
          <nav
            className="flex items-center justify-between gap-3 h-[68px]"
            aria-label="Main navigation"
          >
            {/* Brand Lockup */}
            <Link
              to="/"
              className="relative z-50 flex items-center shrink-0"
              aria-label="Ornate Interior Decor home"
            >
              <img
                src="/Ornate%20Interior%20Decor%20Logo.png"
                alt="Ornate Interior Decor"
                className={`h-10 md:h-11 w-auto object-contain transition-all duration-300 ${
                  useLightHeader
                    ? "brightness-[0.22] contrast-125"
                    : "brightness-0 invert drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                }`}
              />
            </Link>

            {/* Primary Links (lg+) */}
            <div className="hidden lg:flex items-center gap-1">
              {PRIMARY_LINKS.map((link) => {
                const isActive =
                  link.path === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    aria-current={isActive ? "page" : undefined}
                    className={`px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
                      isActive
                        ? useLightHeader
                          ? "bg-ornate-moss text-white"
                          : "bg-white text-ornate-softblack"
                        : useLightHeader
                        ? "text-ornate-charcoal hover:bg-ornate-cream"
                        : "text-white/95 hover:bg-white/15"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              {/* Studio Dropdown */}
              <div className="relative" ref={studioMenuRef}>
                <button
                  type="button"
                  onClick={() => setStudioOpen((prev) => !prev)}
                  aria-expanded={studioOpen}
                  className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
                    isStudioRouteActive || studioOpen
                      ? useLightHeader
                        ? "bg-ornate-cream text-ornate-charcoal"
                        : "bg-white/20 text-white"
                      : useLightHeader
                      ? "text-ornate-charcoal hover:bg-ornate-cream"
                      : "text-white/95 hover:bg-white/15"
                  }`}
                >
                  Studio
                  <ChevronDown
                    size={15}
                    className={`transition-transform duration-200 ${
                      studioOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {studioOpen && (
                  <div className="absolute left-0 top-full mt-2 w-72 bg-white border border-ornate-border rounded-2xl shadow-xl p-2 z-50">
                    {STUDIO_LINKS.map((item) => {
                      const Icon = item.icon;
                      const active = location.pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
                            active
                              ? "bg-ornate-sage/60 text-ornate-moss"
                              : "hover:bg-ornate-offwhite text-ornate-charcoal"
                          }`}
                        >
                          <span className="w-8 h-8 rounded-lg bg-ornate-cream flex items-center justify-center text-ornate-darkgold shrink-0 mt-0.5">
                            <Icon size={16} />
                          </span>
                          <div>
                            <p className="text-sm font-semibold leading-snug">
                              {item.name}
                            </p>
                            <p className="text-xs text-ornate-muted mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Search + Actions (Visible on md & lg+) */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Search Bar Trigger */}
              <button
                type="button"
                onClick={openSearch}
                aria-label="Search furniture, collections, and pages"
                className={`inline-flex items-center gap-2 h-10 px-3 xl:px-3.5 rounded-full border text-sm transition-colors ${
                  useLightHeader
                    ? "bg-ornate-offwhite border-ornate-border text-ornate-muted hover:border-ornate-moss hover:text-ornate-charcoal"
                    : "bg-white/15 backdrop-blur-md border-white/25 text-white hover:bg-white/25"
                }`}
              >
                <Search size={16} aria-hidden="true" />
                <span className="hidden xl:inline text-xs font-medium">
                  Search furniture...
                </span>
                <kbd
                  className={`hidden xl:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono ${
                    useLightHeader
                      ? "bg-white border border-ornate-border text-ornate-muted"
                      : "bg-black/25 text-white/80"
                  }`}
                >
                  ⌘K
                </kbd>
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                aria-label="Saved wishlist"
                className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  useLightHeader
                    ? "text-ornate-charcoal hover:bg-ornate-cream"
                    : "text-white hover:bg-white/15"
                }`}
              >
                <Heart size={18} />
                {wishlistIds.length > 0 && (
                  <span className="absolute top-0.5 right-0.5 min-w-[17px] h-[17px] px-1 rounded-full bg-ornate-darkgold text-white text-[10px] font-bold flex items-center justify-center">
                    {wishlistIds.length}
                  </span>
                )}
              </Link>

              {/* Shopping Cart */}
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-label="Open shopping bag"
                className={`relative h-10 px-3 rounded-full inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  useLightHeader
                    ? "bg-ornate-cream/80 text-ornate-charcoal hover:bg-ornate-cream"
                    : "bg-white/15 text-white hover:bg-white/25"
                }`}
              >
                <ShoppingCart size={17} />
                <span className="hidden sm:inline text-xs font-semibold">
                  Bag
                </span>
                {itemCount > 0 && (
                  <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-ornate-gold text-ornate-softblack text-[11px] font-bold flex items-center justify-center price-nums">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Account */}
              <Link
                to={isAuthenticated ? "/account" : "/login"}
                className={`hidden sm:inline-flex items-center gap-1.5 h-10 px-3.5 rounded-full text-xs font-semibold border transition-colors ${
                  useLightHeader
                    ? "border-ornate-border bg-white text-ornate-charcoal hover:border-ornate-moss"
                    : "border-white/30 text-white hover:bg-white/15"
                }`}
              >
                <User size={15} />
                <span className="max-w-[84px] truncate">
                  {isAuthenticated && user ? user.name.split(" ")[0] : "Sign In"}
                </span>
              </Link>

              {/* Tablet Menu Toggle (visible md..lg) */}
              <button
                type="button"
                className={`lg:hidden relative z-50 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  useLightHeader
                    ? "text-ornate-charcoal hover:bg-ornate-cream"
                    : "text-white hover:bg-white/15"
                }`}
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isOpen}
                aria-controls="tablet-navigation"
              >
                {isOpen ? (
                  <X size={22} className="text-ornate-charcoal" aria-hidden="true" />
                ) : (
                  <Menu size={22} aria-hidden="true" />
                )}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Tablet Slide-Over Drawer (768px - 1023px) */}
      <div
        id="tablet-navigation"
        aria-hidden={!isOpen}
        className={`fixed inset-0 bg-ornate-offwhite z-30 pt-24 pb-10 px-6 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
        } lg:hidden`}
      >
        <div className="ornate-container max-w-xl flex flex-col justify-between min-h-full space-y-6">
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                openSearch();
              }}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white border border-ornate-border text-sm text-ornate-muted"
            >
              <Search size={17} className="text-ornate-moss" />
              <span>Search furniture, services, or projects...</span>
            </button>

            <div className="bg-white rounded-2xl border border-ornate-border divide-y divide-ornate-border overflow-hidden">
              {PRIMARY_LINKS.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    tabIndex={isOpen ? 0 : -1}
                    className={`px-5 py-4 text-base font-semibold flex items-center justify-between transition-colors ${
                      isActive
                        ? "bg-ornate-sage/60 text-ornate-moss"
                        : "text-ornate-charcoal hover:bg-ornate-offwhite"
                    }`}
                  >
                    <span>{link.name}</span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-ornate-moss" />
                    )}
                  </Link>
                );
              })}
              {STUDIO_LINKS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  tabIndex={isOpen ? 0 : -1}
                  className={`px-5 py-3.5 text-sm font-medium flex items-center justify-between transition-colors ${
                    location.pathname === item.path
                      ? "bg-ornate-sage/60 text-ornate-moss font-semibold"
                      : "text-ornate-charcoal/85 hover:bg-ornate-offwhite"
                  }`}
                >
                  <span>{item.name}</span>
                  <span className="text-xs text-ornate-muted">{item.description}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Link
              to="/shop"
              tabIndex={isOpen ? 0 : -1}
              className="w-full ornate-btn-primary gap-2"
            >
              <ShoppingBag size={16} aria-hidden="true" />
              Browse Furniture Store
            </Link>
            <div className="flex items-center justify-between text-xs text-ornate-muted pt-1">
              <span>Vijayanagar, Bengaluru</span>
              <a
                href={STUDIO_INFO.phoneHref}
                tabIndex={isOpen ? 0 : -1}
                className="inline-flex items-center gap-1.5 text-ornate-darkgold font-semibold"
              >
                <Phone size={13} aria-hidden="true" />
                {STUDIO_INFO.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
