import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronRight,
  Eye,
  GitCompareArrows,
  Heart,
  Minus,
  PackageX,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { formatINR } from "@/lib/furnitureFilters";
import type { FurnitureProduct, FurnitureSortOption } from "@/types/furniture";
import type { ShopViewProps } from "./ShopViewProps";
import { useCart } from "@/context/CartContext";
import { useStoreExtras } from "@/context/StoreExtrasContext";
import { QuickViewModal } from "@/components/ecommerce/QuickViewModal";

const DesktopShopView: React.FC<ShopViewProps> = ({
  sellerName,
  subcategories,
  products,
  filteredProducts,
  isLoading,
  isError,
  onRetry,
  filters,
  priceBounds,
  availableBrands,
  subcategoryCounts,
  activeFilterCount,
  onSearchChange,
  onSubcategoryChange,
  onBrandChange,
  onPriceRangeChange,
  onInStockChange,
  onDealsOnlyChange,
  onSortChange,
  onResetFilters,
}) => {
  const { items: cartItems, addToCart, updateQuantity } = useCart();
  const {
    isWishlisted,
    toggleWishlist,
    compareIds,
    toggleCompare,
    recentlyViewedIds,
  } = useStoreExtras();

  const [quickViewProduct, setQuickViewProduct] = useState<FurnitureProduct | null>(
    null
  );

  const selectedSubcategoryObj = subcategories.find(
    (s) => s.slug === filters.subcategory
  );

  const recentlyViewedProducts = useMemo(() => {
    const byId = new Map(products.map((p) => [p.id, p]));
    return recentlyViewedIds
      .map((id) => byId.get(id))
      .filter((p): p is FurnitureProduct => Boolean(p))
      .slice(0, 4);
  }, [products, recentlyViewedIds]);

  const cartQtyByProduct = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of cartItems) map.set(item.productId, item.quantity);
    return map;
  }, [cartItems]);

  const hasBudgetFilter =
    filters.minPrice > priceBounds.min || filters.maxPrice < priceBounds.max;

  return (
    <div className="bg-ornate-offwhite min-h-screen">
      {/* Compact Storefront Header + Search + Collections */}
      <section className="pt-28 pb-6 bg-ornate-cream border-b border-ornate-border">
        <div className="ornate-container space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
            <div className="space-y-2">
              <nav aria-label="Breadcrumb">
                <ol className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-ornate-border text-xs font-medium text-ornate-muted">
                  <li>
                    <Link to="/" className="hover:text-ornate-moss">
                      Home
                    </Link>
                  </li>
                  <li>
                    <ChevronRight size={13} className="text-ornate-darkgold" />
                  </li>
                  <li aria-current="page" className="text-ornate-charcoal font-semibold">
                    Shop Furniture
                  </li>
                </ol>
              </nav>

              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-serif text-3xl sm:text-4xl font-medium text-ornate-charcoal leading-tight">
                  Curated Furniture Store
                </h1>
                <span className="px-3 py-1 rounded-full bg-ornate-sage text-ornate-moss text-xs font-semibold price-nums">
                  {products.length || 0} pieces · {sellerName}
                </span>
              </div>
            </div>

            {/* Inline Quick Search */}
            <div className="w-full lg:w-96 relative">
              <Search
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ornate-muted"
                aria-hidden="true"
              />
              <input
                id="desktop-shop-search"
                type="search"
                value={filters.search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search desks, chairs, brand, SKU..."
                aria-label="Search furniture products"
                className="w-full h-11 pl-10 pr-9 text-sm bg-white border border-ornate-border rounded-full shadow-xs focus:border-ornate-moss focus:ring-2 focus:ring-ornate-moss/15 outline-none text-ornate-charcoal"
              />
              {filters.search && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-ornate-cream flex items-center justify-center text-ornate-charcoal hover:bg-ornate-border"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Horizontal Collection Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
            <button
              type="button"
              onClick={() => onSubcategoryChange("all")}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                filters.subcategory === "all"
                  ? "bg-ornate-moss text-white border-ornate-moss shadow-xs"
                  : "bg-white text-ornate-charcoal border-ornate-border hover:border-ornate-moss"
              }`}
            >
              All Furniture ({subcategoryCounts.all ?? products.length})
            </button>

            {subcategories.map((sub) => {
              const isSelected = filters.subcategory === sub.slug;
              return (
                <button
                  key={sub.slug}
                  type="button"
                  onClick={() => onSubcategoryChange(sub.slug)}
                  className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                    isSelected
                      ? "bg-ornate-moss text-white border-ornate-moss shadow-xs"
                      : "bg-white text-ornate-charcoal border-ornate-border hover:border-ornate-moss"
                  }`}
                >
                  {sub.name} ({subcategoryCounts[sub.slug] ?? 0})
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Catalog Main Content */}
      <section className="py-9">
        <div className="ornate-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
            {/* Filter Sidebar */}
            <aside
              aria-label="Furniture filters"
              className="lg:col-span-3 space-y-5 lg:sticky lg:top-24"
            >
              <div className="ornate-card p-5 space-y-6">
                <div className="flex items-center justify-between border-b border-ornate-border pb-3.5">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal
                      size={16}
                      className="text-ornate-moss"
                      aria-hidden="true"
                    />
                    <h2 className="font-sans text-sm font-semibold text-ornate-charcoal">
                      Refine Selection
                    </h2>
                  </div>
                  {(activeFilterCount > 0 || filters.search) && (
                    <button
                      type="button"
                      onClick={onResetFilters}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-ornate-darkgold hover:text-ornate-moss"
                    >
                      <RotateCcw size={12} /> Reset
                    </button>
                  )}
                </div>

                {/* Brand Filter */}
                {availableBrands.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-ornate-muted mb-2.5">
                      Brand
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => onBrandChange("all")}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                          filters.brand === "all"
                            ? "bg-ornate-moss text-white border-ornate-moss"
                            : "bg-ornate-offwhite text-ornate-charcoal border-ornate-border hover:border-ornate-moss"
                        }`}
                      >
                        All
                      </button>
                      {availableBrands.map((brand) => (
                        <button
                          key={brand}
                          type="button"
                          onClick={() => onBrandChange(brand)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                            filters.brand === brand
                              ? "bg-ornate-moss text-white border-ornate-moss"
                              : "bg-ornate-offwhite text-ornate-charcoal border-ornate-border hover:border-ornate-moss"
                          }`}
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Filter */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-ornate-muted">
                      Max Budget
                    </p>
                    <span className="text-xs font-bold text-ornate-moss price-nums">
                      {formatINR(filters.maxPrice)}
                    </span>
                  </div>
                  <Slider
                    min={priceBounds.min}
                    max={priceBounds.max}
                    step={500}
                    value={[filters.maxPrice]}
                    onValueChange={([val]) =>
                      onPriceRangeChange(priceBounds.min, val)
                    }
                    aria-label="Maximum price budget"
                    className="my-4"
                  />
                  <div className="flex justify-between text-xs text-ornate-muted price-nums">
                    <span>{formatINR(priceBounds.min)}</span>
                    <span>{formatINR(priceBounds.max)}</span>
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-3.5 pt-3 border-t border-ornate-border">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="desktop-in-stock"
                      className="text-sm font-medium text-ornate-charcoal cursor-pointer"
                    >
                      In Stock Only
                    </label>
                    <Switch
                      id="desktop-in-stock"
                      checked={filters.inStockOnly}
                      onCheckedChange={onInStockChange}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="desktop-deals-only"
                      className="text-sm font-medium text-ornate-charcoal cursor-pointer"
                    >
                      Special Deals Only
                    </label>
                    <Switch
                      id="desktop-deals-only"
                      checked={filters.dealsOnly}
                      onCheckedChange={onDealsOnlyChange}
                    />
                  </div>
                </div>
              </div>

              {/* Studio Custom Furniture Callout */}
              <div className="rounded-2xl bg-ornate-moss text-white p-5 space-y-3">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-ornate-gold">
                  <Sparkles size={14} /> Custom Millwork
                </div>
                <h3 className="font-serif text-lg text-white leading-snug">
                  Need custom sizing or veneer finishes?
                </h3>
                <p className="text-xs text-white/75 leading-relaxed">
                  Our Bengaluru workshop tailors dimensions, wood stains, and upholstery to your floor plan.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-ornate-gold hover:text-white transition-colors"
                >
                  Request Custom Quote <ArrowRight size={13} />
                </Link>
              </div>
            </aside>

            {/* Product Results */}
            <div className="lg:col-span-9 space-y-5">
              {/* Results Header & Sort */}
              <div className="ornate-card p-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-ornate-charcoal">
                    Showing{" "}
                    <span className="font-bold price-nums">
                      {filteredProducts.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-bold price-nums">{products.length}</span>{" "}
                    furniture pieces
                    {selectedSubcategoryObj
                      ? ` in ${selectedSubcategoryObj.name}`
                      : ""}
                  </p>
                  {selectedSubcategoryObj?.description && (
                    <p className="text-xs text-ornate-muted mt-0.5">
                      {selectedSubcategoryObj.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  <label
                    htmlFor="desktop-sort"
                    className="text-xs font-semibold text-ornate-muted"
                  >
                    Sort by
                  </label>
                  <select
                    id="desktop-sort"
                    value={filters.sortBy}
                    onChange={(e) =>
                      onSortChange(e.target.value as FurnitureSortOption)
                    }
                    className="px-3.5 py-2 text-sm bg-ornate-offwhite border border-ornate-border rounded-full text-ornate-charcoal font-medium focus:border-ornate-moss outline-none"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="discount-desc">Highest Discount</option>
                    <option value="newest">Newest</option>
                    <option value="name-asc">Name: A to Z</option>
                  </select>
                </div>
              </div>

              {/* Active Filter Chips */}
              {(activeFilterCount > 0 || filters.search) && (
                <div className="flex flex-wrap items-center gap-2">
                  {filters.search && (
                    <button
                      type="button"
                      onClick={() => onSearchChange("")}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ornate-sage text-ornate-moss text-xs font-semibold"
                    >
                      Search: &ldquo;{filters.search}&rdquo; <X size={12} />
                    </button>
                  )}
                  {selectedSubcategoryObj && (
                    <button
                      type="button"
                      onClick={() => onSubcategoryChange("all")}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ornate-sage text-ornate-moss text-xs font-semibold"
                    >
                      {selectedSubcategoryObj.name} <X size={12} />
                    </button>
                  )}
                  {filters.brand !== "all" && (
                    <button
                      type="button"
                      onClick={() => onBrandChange("all")}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ornate-sage text-ornate-moss text-xs font-semibold"
                    >
                      Brand: {filters.brand} <X size={12} />
                    </button>
                  )}
                  {hasBudgetFilter && (
                    <button
                      type="button"
                      onClick={() =>
                        onPriceRangeChange(priceBounds.min, priceBounds.max)
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ornate-sage text-ornate-moss text-xs font-semibold price-nums"
                    >
                      Up to {formatINR(filters.maxPrice)} <X size={12} />
                    </button>
                  )}
                  {filters.inStockOnly && (
                    <button
                      type="button"
                      onClick={() => onInStockChange(false)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ornate-sage text-ornate-moss text-xs font-semibold"
                    >
                      In Stock <X size={12} />
                    </button>
                  )}
                  {filters.dealsOnly && (
                    <button
                      type="button"
                      onClick={() => onDealsOnlyChange(false)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ornate-sage text-ornate-moss text-xs font-semibold"
                    >
                      Special Deals <X size={12} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onResetFilters}
                    className="text-xs font-semibold text-ornate-darkgold hover:underline px-2"
                  >
                    Clear all
                  </button>
                </div>
              )}

              {/* Loading Skeletons */}
              {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="ornate-card overflow-hidden animate-pulse"
                    >
                      <div className="aspect-[4/3] bg-ornate-cream" />
                      <div className="p-5 space-y-3">
                        <div className="h-3 w-24 bg-ornate-cream rounded" />
                        <div className="h-5 w-3/4 bg-ornate-cream rounded" />
                        <div className="h-3 w-1/2 bg-ornate-cream rounded" />
                        <div className="h-9 w-full bg-ornate-cream rounded-full pt-2" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Error State */}
              {isError && !isLoading && (
                <div className="ornate-card p-12 text-center">
                  <PackageX
                    size={36}
                    className="mx-auto text-ornate-darkgold mb-3"
                    aria-hidden="true"
                  />
                  <h3 className="font-serif text-2xl text-ornate-charcoal mb-2">
                    Unable to Load Furniture Catalog
                  </h3>
                  <p className="text-sm text-ornate-muted mb-6 max-w-md mx-auto">
                    We couldn&apos;t retrieve products from the store API right now. Please try again.
                  </p>
                  <button
                    type="button"
                    onClick={onRetry}
                    className="ornate-btn-primary inline-flex items-center gap-2"
                  >
                    <RefreshCw size={15} aria-hidden="true" />
                    Retry Loading
                  </button>
                </div>
              )}

              {/* Empty State */}
              {!isLoading && !isError && filteredProducts.length === 0 && (
                <div className="ornate-card p-12 text-center">
                  <Search
                    size={34}
                    className="mx-auto text-ornate-darkgold mb-3"
                    aria-hidden="true"
                  />
                  <h3 className="font-serif text-2xl text-ornate-charcoal mb-2">
                    No Matching Furniture Found
                  </h3>
                  <p className="text-sm text-ornate-muted mb-6 max-w-md mx-auto">
                    Try adjusting your search keywords, brand selection, or price budget to see more pieces.
                  </p>
                  <button
                    type="button"
                    onClick={onResetFilters}
                    className="ornate-btn-primary inline-flex items-center gap-2"
                  >
                    <RotateCcw size={15} aria-hidden="true" />
                    Clear Filters
                  </button>
                </div>
              )}

              {/* Product Grid */}
              {!isLoading && !isError && filteredProducts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredProducts.map((product) => {
                    const wishlisted = isWishlisted(product.id);
                    const compared = compareIds.includes(product.id);
                    const cartQty = cartQtyByProduct.get(product.id) || 0;
                    const lowStock = product.inStock && product.stockCount <= 5;

                    return (
                      <article
                        key={product.id}
                        className="ornate-card hover:border-ornate-moss/45 hover:shadow-md flex flex-col group overflow-hidden"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden bg-ornate-cream">
                          <Link
                            to={`/shop/${product.slug}`}
                            className="block w-full h-full"
                          >
                            <img
                              src={product.image}
                              alt={product.images[0]?.alt || product.name}
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </Link>

                          {(product.dealActive || product.isFeatured) && (
                            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-ornate-moss text-white text-[11px] font-semibold shadow-xs">
                              {product.dealActive
                                ? `${product.savingsPercent}% Off`
                                : "Featured"}
                            </span>
                          )}

                          {/* Quick Action Overlay Buttons */}
                          <div className="absolute top-3 right-3 flex flex-col gap-1.5">
                            <button
                              type="button"
                              onClick={() => void toggleWishlist(product.id, product.name)}
                              aria-label="Toggle wishlist"
                              className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm border transition-colors ${
                                wishlisted
                                  ? "bg-rose-50 border-rose-200 text-rose-600"
                                  : "bg-white/95 border-ornate-border text-ornate-charcoal hover:bg-white"
                              }`}
                            >
                              <Heart
                                size={14}
                                className={wishlisted ? "fill-rose-600" : ""}
                              />
                            </button>
                            <button
                              type="button"
                              onClick={() => setQuickViewProduct(product)}
                              aria-label="Quick view"
                              className="w-8 h-8 rounded-full bg-white/95 border border-ornate-border text-ornate-charcoal hover:bg-white flex items-center justify-center shadow-sm"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleCompare(product.id, product.name)}
                              aria-label="Compare product"
                              className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm border transition-colors ${
                                compared
                                  ? "bg-ornate-moss border-ornate-moss text-white"
                                  : "bg-white/95 border-ornate-border text-ornate-charcoal hover:bg-white"
                              }`}
                            >
                              <GitCompareArrows size={13} />
                            </button>
                          </div>

                          <span
                            className={`absolute bottom-2.5 left-3 inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold rounded-full shadow-xs ${
                              !product.inStock
                                ? "bg-white/95 text-rose-700"
                                : lowStock
                                ? "bg-amber-50/95 text-amber-800"
                                : "bg-white/95 text-emerald-800"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                !product.inStock
                                  ? "bg-rose-600"
                                  : lowStock
                                  ? "bg-amber-600"
                                  : "bg-emerald-600"
                              }`}
                            />
                            {!product.inStock
                              ? "Out of Stock"
                              : lowStock
                              ? `Only ${product.stockCount} left`
                              : `${product.stockCount} in stock`}
                          </span>
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-xs font-medium text-ornate-darkgold truncate">
                                {product.subcategoryName}
                              </span>
                              {product.reviewCount > 0 ? (
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-ornate-charcoal shrink-0">
                                  <Star
                                    size={12}
                                    className="text-amber-500 fill-amber-500"
                                  />
                                  {product.averageRating} ({product.reviewCount})
                                </span>
                              ) : (
                                <span className="text-xs font-medium text-ornate-muted shrink-0">
                                  {product.brand}
                                </span>
                              )}
                            </div>

                            <h3 className="font-sans text-base font-semibold text-ornate-charcoal leading-snug mb-1.5">
                              <Link
                                to={`/shop/${product.slug}`}
                                className="hover:text-ornate-moss transition-colors"
                              >
                                {product.name}
                              </Link>
                            </h3>

                            <p className="text-xs text-ornate-muted line-clamp-2 mb-3">
                              {product.shortDescription}
                            </p>

                            {product.attributes.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mb-4">
                                {product.attributes.slice(0, 2).map((attr) => (
                                  <span
                                    key={attr.key}
                                    className="px-2.5 py-0.5 bg-ornate-offwhite border border-ornate-border rounded-full text-[11px] font-medium text-ornate-muted"
                                  >
                                    {attr.value}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="pt-3 border-t border-ornate-border space-y-3">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <div className="flex items-baseline gap-2">
                                  <p className="font-sans text-lg font-bold text-ornate-charcoal price-nums">
                                    {formatINR(product.price)}
                                  </p>
                                  {product.savingsPercent > 0 && (
                                    <span className="text-xs font-semibold text-emerald-700">
                                      -{product.savingsPercent}%
                                    </span>
                                  )}
                                </div>
                                {product.mrp && (
                                  <p className="text-xs text-ornate-muted/75 line-through price-nums">
                                    {formatINR(product.mrp)}
                                  </p>
                                )}
                              </div>

                              <Link
                                to={`/shop/${product.slug}`}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-ornate-moss hover:text-ornate-darkgold shrink-0"
                              >
                                Details <ArrowRight size={13} />
                              </Link>
                            </div>

                            {cartQty > 0 ? (
                              <div className="flex items-center justify-between border border-ornate-moss rounded-full bg-ornate-sage/50 h-10 px-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    void updateQuantity(product.id, cartQty - 1)
                                  }
                                  aria-label="Decrease quantity"
                                  className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-full text-ornate-moss"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="text-xs font-bold text-ornate-moss price-nums">
                                  In Bag ({cartQty})
                                </span>
                                <button
                                  type="button"
                                  disabled={cartQty >= product.stockCount}
                                  onClick={() =>
                                    void updateQuantity(product.id, cartQty + 1)
                                  }
                                  aria-label="Increase quantity"
                                  className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-full text-ornate-moss disabled:opacity-40"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                disabled={!product.inStock}
                                onClick={() => void addToCart(product, 1, true)}
                                className="w-full h-10 rounded-full bg-ornate-moss text-white hover:bg-ornate-mossLight transition-colors text-xs font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-45"
                              >
                                <ShoppingBag size={14} />
                                {product.inStock ? "Add to Bag" : "Out of Stock"}
                              </button>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}

              {/* Recently Viewed Strip */}
              {recentlyViewedProducts.length > 0 && (
                <div className="pt-8 border-t border-ornate-border">
                  <h3 className="font-serif text-xl text-ornate-charcoal mb-4">
                    Recently Viewed Pieces
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {recentlyViewedProducts.map((item) => (
                      <Link
                        key={item.id}
                        to={`/shop/${item.slug}`}
                        className="ornate-card overflow-hidden hover:border-ornate-moss/45"
                      >
                        <div className="aspect-[4/3] bg-ornate-cream">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <p className="font-sans text-sm font-semibold text-ornate-charcoal line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-xs font-bold text-ornate-moss mt-0.5 price-nums">
                            {formatINR(item.price)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};

export default DesktopShopView;
