import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
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
  Star,
  X,
} from "lucide-react";
import PageHeader from "@/components/ui-components/PageHeader";
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

  return (
    <div className="bg-ornate-offwhite min-h-screen">
      <PageHeader
        subtitle={`Furnitures · ${sellerName}`}
        title="Curated Furniture Collection"
        description="Explore functional, architectural furniture pieces available for direct online checkout or bespoke consultation."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
        ]}
        aside={
          <div className="flex items-center gap-6 px-5 py-3.5 bg-white border border-ornate-gold/25 rounded-sm shadow-sm">
            <div>
              <p className="font-serif text-2xl text-ornate-charcoal leading-none">
                {products.length || "—"}
              </p>
              <p className="font-display text-[10px] uppercase tracking-[0.16em] text-ornate-darkgold mt-1">
                Pieces
              </p>
            </div>
            <div className="h-8 w-px bg-ornate-gold/25" aria-hidden="true" />
            <div>
              <p className="font-serif text-2xl text-ornate-charcoal leading-none">
                {subcategories.length || "—"}
              </p>
              <p className="font-display text-[10px] uppercase tracking-[0.16em] text-ornate-darkgold mt-1">
                Collections
              </p>
            </div>
          </div>
        }
      />

      {/* Dynamic Subcategory Selector */}
      <section className="py-8 bg-white border-b border-ornate-gold/15">
        <div className="ornate-container">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <p className="font-display text-xs uppercase tracking-widest text-ornate-darkgold">
                Category · Furnitures
              </p>
              <h2 className="font-serif text-2xl text-ornate-charcoal">
                Available Collections
              </h2>
            </div>
            {activeFilterCount > 0 || filters.search ? (
              <button
                type="button"
                onClick={onResetFilters}
                className="inline-flex items-center gap-1.5 text-xs font-display uppercase tracking-wider text-ornate-darkgold hover:text-ornate-charcoal transition-colors"
              >
                <RotateCcw size={14} aria-hidden="true" />
                Reset All Filters
              </button>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => onSubcategoryChange("all")}
              className={`px-4 py-2.5 text-xs font-display uppercase tracking-wider border transition-colors ${
                filters.subcategory === "all"
                  ? "bg-ornate-charcoal text-white border-ornate-charcoal"
                  : "bg-ornate-offwhite text-ornate-charcoal border-ornate-gold/25 hover:border-ornate-charcoal"
              }`}
            >
              All Furnitures ({subcategoryCounts.all ?? products.length})
            </button>

            {subcategories.map((sub) => {
              const isSelected = filters.subcategory === sub.slug;
              return (
                <button
                  key={sub.slug}
                  type="button"
                  onClick={() => onSubcategoryChange(sub.slug)}
                  className={`px-4 py-2.5 text-xs font-display uppercase tracking-wider border transition-colors ${
                    isSelected
                      ? "bg-ornate-charcoal text-white border-ornate-charcoal"
                      : "bg-ornate-offwhite text-ornate-charcoal border-ornate-gold/25 hover:border-ornate-charcoal"
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
      <section className="py-12">
        <div className="ornate-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Filter Sidebar */}
            <aside
              aria-label="Furniture filters"
              className="lg:col-span-3 bg-white border border-ornate-gold/20 p-6 lg:sticky lg:top-28 space-y-7"
            >
              <div className="flex items-center justify-between border-b border-ornate-gold/15 pb-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal
                    size={16}
                    className="text-ornate-darkgold"
                    aria-hidden="true"
                  />
                  <h3 className="font-display text-xs uppercase tracking-widest text-ornate-charcoal">
                    Refine Selection
                  </h3>
                </div>
                {activeFilterCount > 0 && (
                  <span className="px-2 py-0.5 text-[11px] font-medium bg-ornate-gold/20 text-ornate-charcoal">
                    {activeFilterCount} active
                  </span>
                )}
              </div>

              {/* Search Input */}
              <div>
                <label
                  htmlFor="desktop-shop-search"
                  className="block font-display text-xs uppercase tracking-wider text-ornate-charcoal/80 mb-2"
                >
                  Search Products
                </label>
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-ornate-charcoal/50"
                    aria-hidden="true"
                  />
                  <input
                    id="desktop-shop-search"
                    type="search"
                    value={filters.search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Desk, chair, brand, SKU..."
                    className="w-full pl-9 pr-8 py-2.5 text-sm bg-ornate-offwhite border border-ornate-gold/25 focus:border-ornate-darkgold outline-none text-ornate-charcoal"
                  />
                  {filters.search && (
                    <button
                      type="button"
                      onClick={() => onSearchChange("")}
                      aria-label="Clear search"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ornate-charcoal/50 hover:text-ornate-charcoal"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Dynamic Subcategories */}
              <div>
                <p className="font-display text-xs uppercase tracking-wider text-ornate-charcoal/80 mb-3">
                  Sub-Categories
                </p>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => onSubcategoryChange("all")}
                    className={`w-full flex items-center justify-between text-left text-sm py-1.5 px-2 transition-colors ${
                      filters.subcategory === "all"
                        ? "bg-ornate-cream font-medium text-ornate-charcoal"
                        : "text-ornate-charcoal/75 hover:text-ornate-charcoal"
                    }`}
                  >
                    <span>All Furnitures</span>
                    <span className="text-xs text-ornate-charcoal/60">
                      {subcategoryCounts.all ?? products.length}
                    </span>
                  </button>
                  {subcategories.map((sub) => (
                    <button
                      key={sub.slug}
                      type="button"
                      onClick={() => onSubcategoryChange(sub.slug)}
                      className={`w-full flex items-center justify-between text-left text-sm py-1.5 px-2 transition-colors ${
                        filters.subcategory === sub.slug
                          ? "bg-ornate-cream font-medium text-ornate-charcoal"
                          : "text-ornate-charcoal/75 hover:text-ornate-charcoal"
                      }`}
                    >
                      <span>{sub.name}</span>
                      <span className="text-xs text-ornate-charcoal/60">
                        {subcategoryCounts[sub.slug] ?? 0}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              {availableBrands.length > 0 && (
                <div>
                  <p className="font-display text-xs uppercase tracking-wider text-ornate-charcoal/80 mb-3">
                    Brand
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => onBrandChange("all")}
                      className={`px-2.5 py-1 text-xs border transition-colors ${
                        filters.brand === "all"
                          ? "bg-ornate-charcoal text-white border-ornate-charcoal"
                          : "bg-white text-ornate-charcoal/80 border-ornate-gold/25 hover:border-ornate-charcoal"
                      }`}
                    >
                      All
                    </button>
                    {availableBrands.map((brand) => (
                      <button
                        key={brand}
                        type="button"
                        onClick={() => onBrandChange(brand)}
                        className={`px-2.5 py-1 text-xs border transition-colors ${
                          filters.brand === brand
                            ? "bg-ornate-charcoal text-white border-ornate-charcoal"
                            : "bg-white text-ornate-charcoal/80 border-ornate-gold/25 hover:border-ornate-charcoal"
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
                  <p className="font-display text-xs uppercase tracking-wider text-ornate-charcoal/80">
                    Max Budget
                  </p>
                  <span className="text-xs font-medium text-ornate-darkgold">
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
                <div className="flex justify-between text-[11px] text-ornate-charcoal/60">
                  <span>{formatINR(priceBounds.min)}</span>
                  <span>{formatINR(priceBounds.max)}</span>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2 border-t border-ornate-gold/15">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="desktop-in-stock"
                    className="text-sm text-ornate-charcoal cursor-pointer"
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
                    className="text-sm text-ornate-charcoal cursor-pointer"
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
            </aside>

            {/* Product Results */}
            <div className="lg:col-span-9 space-y-6">
              {/* Results Header & Sort */}
              <div className="bg-white border border-ornate-gold/20 p-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-ornate-charcoal">
                    Showing{" "}
                    <span className="font-semibold">
                      {filteredProducts.length}
                    </span>{" "}
                    of <span className="font-semibold">{products.length}</span>{" "}
                    furniture pieces
                    {selectedSubcategoryObj
                      ? ` in ${selectedSubcategoryObj.name}`
                      : ""}
                  </p>
                  {selectedSubcategoryObj?.description && (
                    <p className="text-xs text-ornate-charcoal/65 mt-0.5">
                      {selectedSubcategoryObj.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <label
                    htmlFor="desktop-sort"
                    className="text-xs font-display uppercase tracking-wider text-ornate-charcoal/70"
                  >
                    Sort by
                  </label>
                  <select
                    id="desktop-sort"
                    value={filters.sortBy}
                    onChange={(e) =>
                      onSortChange(e.target.value as FurnitureSortOption)
                    }
                    className="px-3 py-2 text-sm bg-ornate-offwhite border border-ornate-gold/25 text-ornate-charcoal focus:border-ornate-darkgold outline-none"
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

              {/* Loading Skeletons */}
              {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-ornate-gold/15 overflow-hidden animate-pulse"
                    >
                      <div className="aspect-[4/3] bg-ornate-cream" />
                      <div className="p-5 space-y-3">
                        <div className="h-3 w-24 bg-ornate-cream" />
                        <div className="h-5 w-3/4 bg-ornate-cream" />
                        <div className="h-3 w-1/2 bg-ornate-cream" />
                        <div className="h-6 w-1/3 bg-ornate-cream pt-2" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Error State */}
              {isError && !isLoading && (
                <div className="bg-white border border-ornate-gold/20 p-12 text-center">
                  <PackageX
                    size={36}
                    className="mx-auto text-ornate-darkgold mb-3"
                    aria-hidden="true"
                  />
                  <h3 className="font-serif text-2xl text-ornate-charcoal mb-2">
                    Unable to Load Furniture Catalog
                  </h3>
                  <p className="text-sm text-ornate-charcoal/75 mb-6 max-w-md mx-auto">
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
                <div className="bg-white border border-ornate-gold/20 p-12 text-center">
                  <Search
                    size={34}
                    className="mx-auto text-ornate-darkgold mb-3"
                    aria-hidden="true"
                  />
                  <h3 className="font-serif text-2xl text-ornate-charcoal mb-2">
                    No Matching Furniture Found
                  </h3>
                  <p className="text-sm text-ornate-charcoal/75 mb-6 max-w-md mx-auto">
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
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => {
                    const wishlisted = isWishlisted(product.id);
                    const compared = compareIds.includes(product.id);
                    const cartQty = cartQtyByProduct.get(product.id) || 0;
                    const lowStock = product.inStock && product.stockCount <= 5;

                    return (
                      <article
                        key={product.id}
                        className="bg-white border border-ornate-gold/20 hover:border-ornate-darkgold/60 rounded-sm transition-all duration-300 flex flex-col group shadow-sm hover:shadow-md overflow-hidden"
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
                            <span className="absolute top-3 left-3 px-2.5 py-1 bg-ornate-softblack/90 text-ornate-gold font-display text-[10px] uppercase tracking-widest">
                              {product.dealActive
                                ? `Deal · ${product.savingsPercent}% Off`
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
                                  : "bg-white/95 border-ornate-gold/25 text-ornate-charcoal hover:bg-ornate-cream"
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
                              className="w-8 h-8 rounded-full bg-white/95 border border-ornate-gold/25 text-ornate-charcoal hover:bg-ornate-cream flex items-center justify-center shadow-sm"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleCompare(product.id, product.name)}
                              aria-label="Compare product"
                              className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm border transition-colors ${
                                compared
                                  ? "bg-ornate-charcoal border-ornate-charcoal text-white"
                                  : "bg-white/95 border-ornate-gold/25 text-ornate-charcoal hover:bg-ornate-cream"
                              }`}
                            >
                              <GitCompareArrows size={13} />
                            </button>
                          </div>

                          <span
                            className={`absolute bottom-2.5 left-3 px-2 py-0.5 text-[11px] font-medium rounded-sm ${
                              !product.inStock
                                ? "bg-white/95 text-rose-700"
                                : lowStock
                                ? "bg-amber-50/95 text-amber-800"
                                : "bg-white/95 text-emerald-800"
                            }`}
                          >
                            {!product.inStock
                              ? "Out of Stock"
                              : lowStock
                              ? `Only ${product.stockCount} left!`
                              : `${product.stockCount} in stock`}
                          </span>
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <span className="font-display text-[11px] uppercase tracking-wider text-ornate-darkgold truncate">
                                {product.subcategoryName}
                              </span>
                              {product.reviewCount > 0 ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-ornate-charcoal shrink-0">
                                  <Star
                                    size={11}
                                    className="text-amber-500 fill-amber-500"
                                  />
                                  {product.averageRating} ({product.reviewCount})
                                </span>
                              ) : (
                                <span className="text-[11px] font-medium text-ornate-charcoal/70 shrink-0">
                                  {product.brand}
                                </span>
                              )}
                            </div>

                            <h3 className="font-serif text-lg text-ornate-charcoal leading-snug mb-2">
                              <Link
                                to={`/shop/${product.slug}`}
                                className="hover:text-ornate-darkgold transition-colors"
                              >
                                {product.name}
                              </Link>
                            </h3>

                            <p className="text-xs text-ornate-charcoal/70 line-clamp-2 mb-3">
                              {product.shortDescription}
                            </p>

                            {product.attributes.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mb-4">
                                {product.attributes.slice(0, 2).map((attr) => (
                                  <span
                                    key={attr.key}
                                    className="px-2 py-0.5 bg-ornate-offwhite border border-ornate-gold/20 rounded-sm text-[11px] text-ornate-charcoal/75"
                                  >
                                    {attr.value}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="pt-3 border-t border-ornate-gold/15 space-y-3">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <div className="flex items-baseline gap-2">
                                  <p className="font-serif text-lg font-semibold text-ornate-charcoal">
                                    {formatINR(product.price)}
                                  </p>
                                  {product.savingsPercent > 0 && (
                                    <span className="text-[11px] font-semibold text-emerald-700">
                                      {product.savingsPercent}% off
                                    </span>
                                  )}
                                </div>
                                {product.mrp && (
                                  <p className="text-xs text-ornate-charcoal/50 line-through">
                                    {formatINR(product.mrp)}
                                  </p>
                                )}
                              </div>

                              <Link
                                to={`/shop/${product.slug}`}
                                className="inline-flex items-center gap-1 text-xs font-medium text-ornate-darkgold hover:underline shrink-0"
                              >
                                Details <ArrowRight size={12} />
                              </Link>
                            </div>

                            {cartQty > 0 ? (
                              <div className="flex items-center justify-between border border-ornate-charcoal rounded-sm bg-ornate-cream/50 h-9 px-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    void updateQuantity(product.id, cartQty - 1)
                                  }
                                  className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-sm"
                                >
                                  <Minus size={13} />
                                </button>
                                <span className="text-xs font-semibold">
                                  In Cart ({cartQty})
                                </span>
                                <button
                                  type="button"
                                  disabled={cartQty >= product.stockCount}
                                  onClick={() =>
                                    void updateQuantity(product.id, cartQty + 1)
                                  }
                                  className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-sm disabled:opacity-40"
                                >
                                  <Plus size={13} />
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                disabled={!product.inStock}
                                onClick={() => void addToCart(product, 1, true)}
                                className="w-full h-9 rounded-sm bg-ornate-charcoal text-white hover:bg-ornate-darkgold transition-colors text-xs font-display uppercase tracking-wider inline-flex items-center justify-center gap-2 disabled:opacity-45"
                              >
                                <ShoppingBag size={13} />
                                {product.inStock ? "Add to Cart" : "Out of Stock"}
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
                <div className="pt-8 border-t border-ornate-gold/20">
                  <h3 className="font-serif text-xl text-ornate-charcoal mb-4">
                    Recently Viewed Pieces
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {recentlyViewedProducts.map((item) => (
                      <Link
                        key={item.id}
                        to={`/shop/${item.slug}`}
                        className="bg-white border border-ornate-gold/20 rounded-sm overflow-hidden hover:border-ornate-darkgold transition-colors"
                      >
                        <div className="aspect-[4/3] bg-ornate-cream">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <p className="font-serif text-sm line-clamp-1">{item.name}</p>
                          <p className="text-xs font-semibold text-ornate-darkgold mt-0.5">
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
