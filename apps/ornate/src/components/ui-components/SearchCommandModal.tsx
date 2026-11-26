import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Compass,
  FolderKanban,
  HelpCircle,
  Info,
  Mail,
  Package,
  Search,
  ShoppingBag,
  Sparkles,
  Tag,
  X,
} from "lucide-react";
import { useGlobalSearch } from "@/context/SearchContext";
import { useFurnitureCatalog } from "@/hooks/useFurnitureCatalog";
import { formatINR } from "@/lib/furnitureFilters";

const QUICK_DESTINATIONS = [
  {
    label: "Shop All Furniture",
    caption: "Explore curated chairs, desks, sofas & storage",
    to: "/shop",
    icon: ShoppingBag,
  },
  {
    label: "Interior Design Services",
    caption: "Residential, commercial & turnkey execution",
    to: "/services",
    icon: Sparkles,
  },
  {
    label: "Studio Portfolio",
    caption: "Completed Bengaluru spaces & case studies",
    to: "/projects",
    icon: FolderKanban,
  },
  {
    label: "Book a Consultation",
    caption: "Share your floor plan or visit Vijayanagar",
    to: "/contact",
    icon: Mail,
  },
  {
    label: "My Orders & Tracking",
    caption: "Check order status, delivery & GST invoices",
    to: "/account",
    icon: Package,
  },
  {
    label: "About Ornate Studio",
    caption: "Design philosophy, craft & team",
    to: "/about",
    icon: Info,
  },
  {
    label: "Frequently Asked Questions",
    caption: "Pricing, timelines & revisions",
    to: "/faq",
    icon: HelpCircle,
  },
  {
    label: "Help & Preparation Guide",
    caption: "Floor plan checklist & support hours",
    to: "/help",
    icon: Compass,
  },
];

export const SearchCommandModal: React.FC = () => {
  const { isSearchOpen, closeSearch } = useGlobalSearch();
  const { data } = useFurnitureCatalog();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const products = useMemo(() => data?.products ?? [], [data?.products]);
  const subcategories = useMemo(() => data?.subcategories ?? [], [data?.subcategories]);

  useEffect(() => {
    if (!isSearchOpen) {
      setQuery("");
      return;
    }
    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 40);
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeSearch();
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isSearchOpen, closeSearch]);

  const normalized = query.trim().toLowerCase();

  const matchingProducts = useMemo(() => {
    if (!normalized) return products.slice(0, 4);
    return products
      .filter((p) => {
        const text = [
          p.name,
          p.brand,
          p.sku,
          p.subcategoryName,
          p.shortDescription,
        ]
          .join(" ")
          .toLowerCase();
        return text.includes(normalized);
      })
      .slice(0, 6);
  }, [normalized, products]);

  const matchingSubcategories = useMemo(() => {
    if (!normalized) return subcategories.slice(0, 6);
    return subcategories.filter((s) =>
      s.name.toLowerCase().includes(normalized)
    );
  }, [normalized, subcategories]);

  const matchingPages = useMemo(() => {
    if (!normalized) return QUICK_DESTINATIONS.slice(0, 4);
    return QUICK_DESTINATIONS.filter(
      (item) =>
        item.label.toLowerCase().includes(normalized) ||
        item.caption.toLowerCase().includes(normalized)
    );
  }, [normalized]);

  if (!isSearchOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    closeSearch();
    if (query.trim()) {
      navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate("/shop");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 pt-6 sm:pt-16"
      role="dialog"
      aria-modal="true"
      aria-label="Global search"
    >
      <div
        className="fixed inset-0 bg-ornate-softblack/60 backdrop-blur-sm"
        onClick={closeSearch}
      />

      <div className="relative z-10 w-full max-w-2xl bg-white border border-ornate-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 px-4 sm:px-5 py-3.5 border-b border-ornate-border bg-ornate-offwhite/60"
        >
          <Search size={19} className="text-ornate-moss shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search furniture, collections, services, or pages..."
            className="flex-1 bg-transparent text-sm sm:text-base text-ornate-charcoal placeholder:text-ornate-muted/70 outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search query"
              className="p-1.5 rounded-full text-ornate-muted hover:bg-ornate-cream hover:text-ornate-charcoal"
            >
              <X size={15} />
            </button>
          )}
          <button
            type="button"
            onClick={closeSearch}
            className="px-2.5 py-1 rounded-lg bg-ornate-cream text-xs font-medium text-ornate-muted hover:text-ornate-charcoal"
          >
            Esc
          </button>
        </form>

        <div className="overflow-y-auto p-4 sm:p-5 space-y-6">
          {/* Categories */}
          {matchingSubcategories.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ornate-muted mb-2.5">
                {normalized ? "Matching Collections" : "Browse by Collection"}
              </p>
              <div className="flex flex-wrap gap-2">
                {matchingSubcategories.map((sub) => (
                  <Link
                    key={sub.slug}
                    to={`/shop?category=${sub.slug}`}
                    onClick={closeSearch}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-ornate-offwhite border border-ornate-border hover:border-ornate-moss hover:bg-ornate-sage/60 text-xs font-medium text-ornate-charcoal transition-colors"
                  >
                    <Tag size={12} className="text-ornate-darkgold" />
                    {sub.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Furniture Matches */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-ornate-muted">
                {normalized ? "Furniture Results" : "Popular Pieces"}
              </p>
              <button
                type="button"
                onClick={handleSubmit}
                className="text-xs font-semibold text-ornate-darkgold hover:text-ornate-moss inline-flex items-center gap-1"
              >
                View all in Shop <ArrowRight size={12} />
              </button>
            </div>

            {matchingProducts.length === 0 ? (
              <div className="rounded-xl border border-ornate-border bg-ornate-offwhite/50 p-4 text-xs text-ornate-muted">
                No furniture pieces matched &ldquo;{query}&rdquo;. Try searching by category or visit the Shop catalog.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {matchingProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/shop/${product.slug}`}
                    onClick={closeSearch}
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-ornate-border hover:border-ornate-moss hover:bg-ornate-offwhite/60 transition-colors group"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-14 h-14 rounded-lg object-cover bg-ornate-cream shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium text-ornate-darkgold truncate">
                        {product.subcategoryName}
                      </p>
                      <p className="text-sm font-semibold text-ornate-charcoal truncate group-hover:text-ornate-moss">
                        {product.name}
                      </p>
                      <p className="text-xs font-semibold text-ornate-charcoal/80 price-nums mt-0.5">
                        {formatINR(product.price)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Pages & Services */}
          {matchingPages.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ornate-muted mb-2.5">
                {normalized ? "Pages & Services" : "Quick Navigation"}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchingPages.map((dest) => {
                  const Icon = dest.icon;
                  return (
                    <Link
                      key={dest.to}
                      to={dest.to}
                      onClick={closeSearch}
                      className="flex items-center gap-3 p-3 rounded-xl border border-ornate-border hover:border-ornate-moss hover:bg-ornate-sage/35 transition-colors"
                    >
                      <span className="w-9 h-9 rounded-lg bg-ornate-cream flex items-center justify-center text-ornate-moss shrink-0">
                        <Icon size={17} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-ornate-charcoal truncate">
                          {dest.label}
                        </p>
                        <p className="text-xs text-ornate-muted truncate">
                          {dest.caption}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
