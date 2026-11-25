import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, Menu, Phone, ShoppingBag, ShoppingCart, User, X } from "lucide-react";
import { STUDIO_INFO } from "@/lib/seo";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useStoreExtras } from "@/context/StoreExtrasContext";

const HERO_ROUTES = new Set(["/"]);

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { itemCount, setDrawerOpen } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { wishlistIds } = useStoreExtras();

  const hasDarkHero = HERO_ROUTES.has(location.pathname);
  const useLightHeader = isOpen || isScrolled || !hasDarkHero;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Projects", path: "/projects" },
    { name: "Contact", path: "/contact" },
    { name: "FAQ", path: "/faq" },
    { name: "Help & Support", path: "/help" },
  ];

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
  }, [location.pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isOpen
            ? "py-2.5 bg-ornate-offwhite border-b border-ornate-gold/25"
            : useLightHeader
            ? "py-2.5 bg-ornate-offwhite/95 backdrop-blur-md shadow-[0_2px_16px_rgba(26,24,22,0.06)] border-b border-ornate-gold/20"
            : "py-4 bg-gradient-to-b from-ornate-softblack/80 via-ornate-softblack/45 to-transparent"
        }`}
      >
        <div className="ornate-container">
          <nav className="flex items-center justify-between gap-4" aria-label="Main navigation">
            <Link
              to="/"
              className="relative z-50 flex items-center shrink-0"
              aria-label="Ornate Interior Decor home"
            >
              <img
                src="/Ornate%20Interior%20Decor%20Logo.png"
                alt="Ornate Interior Decor"
                className={`h-12 md:h-14 w-auto object-contain transition-all duration-300 ${
                  useLightHeader
                    ? "brightness-0 opacity-90"
                    : "brightness-0 invert drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
                }`}
              />
            </Link>

            <div className="hidden lg:flex items-center space-x-5 xl:space-x-6">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    aria-current={isActive ? "page" : undefined}
                    className={`font-display text-xs uppercase tracking-[0.14em] transition-colors duration-200 py-1.5 border-b-2 ${
                      isActive
                        ? useLightHeader
                          ? "text-ornate-darkgold border-ornate-darkgold font-medium"
                          : "text-ornate-gold border-ornate-gold font-medium"
                        : `${
                            useLightHeader ? "text-ornate-charcoal" : "text-white/95"
                          } border-transparent hover:text-ornate-gold`
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              <div className="flex items-center gap-2.5 pl-1">
                <Link
                  to="/wishlist"
                  aria-label="Wishlist"
                  className={`relative p-2 rounded-sm transition-colors ${
                    useLightHeader
                      ? "text-ornate-charcoal hover:bg-ornate-cream"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <Heart size={18} />
                  {wishlistIds.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-ornate-darkgold text-white text-[10px] font-semibold flex items-center justify-center">
                      {wishlistIds.length}
                    </span>
                  )}
                </Link>

                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  aria-label="Open shopping bag"
                  className={`relative p-2 rounded-sm transition-colors ${
                    useLightHeader
                      ? "text-ornate-charcoal hover:bg-ornate-cream"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <ShoppingCart size={18} />
                  {itemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-ornate-gold text-ornate-softblack text-[10px] font-bold flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </button>

                <Link
                  to={isAuthenticated ? "/account" : "/login"}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-sm text-xs font-medium border transition-colors ${
                    useLightHeader
                      ? "border-ornate-gold/35 text-ornate-charcoal hover:bg-ornate-cream"
                      : "border-white/30 text-white hover:bg-white/10"
                  }`}
                >
                  <User size={14} />
                  <span className="max-w-[80px] truncate">
                    {isAuthenticated && user ? user.name.split(" ")[0] : "Sign In"}
                  </span>
                </Link>

                <Link
                  to="/shop"
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-sm font-display text-xs uppercase tracking-[0.14em] transition-all duration-200 shadow-sm ${
                    location.pathname.startsWith("/shop")
                      ? "bg-ornate-darkgold text-white"
                      : useLightHeader
                      ? "bg-ornate-charcoal text-white hover:bg-ornate-darkgold"
                      : "bg-ornate-gold text-ornate-softblack hover:bg-white"
                  }`}
                >
                  <ShoppingBag size={14} aria-hidden="true" />
                  Shop Now
                </Link>
              </div>
            </div>

            <button
              type="button"
              className={`lg:hidden relative z-50 p-2 rounded-sm transition-colors ${
                useLightHeader
                  ? "text-ornate-charcoal hover:bg-ornate-cream"
                  : "text-white hover:bg-white/10"
              }`}
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
            >
              {isOpen ? (
                <X size={24} className="text-ornate-charcoal" aria-hidden="true" />
              ) : (
                <Menu size={24} aria-hidden="true" />
              )}
            </button>
          </nav>
        </div>
      </header>

      <div
        id="mobile-navigation"
        aria-hidden={!isOpen}
        className={`fixed inset-0 bg-ornate-offwhite z-40 pt-24 pb-10 px-6 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
        } lg:hidden`}
      >
        <div className="ornate-container flex flex-col justify-between min-h-full">
          <div className="flex flex-col divide-y divide-ornate-gold/15 border-t border-b border-ornate-gold/15 my-auto">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  tabIndex={isOpen ? 0 : -1}
                  aria-current={isOpen && isActive ? "page" : undefined}
                  className={`py-4 font-display text-base uppercase tracking-[0.16em] transition-colors flex items-center justify-between ${
                    isActive
                      ? "text-ornate-darkgold font-medium"
                      : "text-ornate-charcoal hover:text-ornate-darkgold"
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-ornate-darkgold" aria-hidden="true" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="pt-6 space-y-4">
            <Link
              to="/shop"
              tabIndex={isOpen ? 0 : -1}
              className="w-full inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-sm bg-ornate-charcoal text-white font-display text-xs uppercase tracking-[0.16em] hover:bg-ornate-darkgold transition-colors"
            >
              <ShoppingBag size={15} aria-hidden="true" />
              Shop Furniture Collection
            </Link>
            <div className="flex items-center justify-between text-xs text-ornate-charcoal/65 pt-2">
              <span>Vijayanagar, Bengaluru</span>
              <a
                href={STUDIO_INFO.phoneHref}
                tabIndex={isOpen ? 0 : -1}
                className="inline-flex items-center gap-1.5 text-ornate-darkgold font-medium"
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
