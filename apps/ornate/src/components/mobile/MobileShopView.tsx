import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpDown,
  Heart,
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
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { formatINR } from "@/lib/furnitureFilters";
import type { FurnitureProduct, FurnitureSortOption } from "@/types/furniture";
import type { ShopViewProps } from "@/components/shop/ShopViewProps";
import { useCart } from "@/context/CartContext";
import { useStoreExtras } from "@/context/StoreExtrasContext";

const SORT_LABELS: Record<FurnitureSortOption, string> = {
  featured: "Featured",
  "price-asc": "Price: Low–High",
  "price-desc": "Price: High–Low",
  "discount-desc": "Top Discount",
  newest: "Newest",
  "name-asc": "Name: A–Z",
};

const MobileShopView: React.FC<ShopViewProps> = ({
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
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist, recentlyViewedIds } = useStoreExtras();

  const recentlyViewed = useMemo(() => {
    const map = new Map(products.map((p) => [p.id, p]));
    return recentlyViewedIds
      .map((id) => map.get(id))
      .filter((p): p is FurnitureProduct => Boolean(p))
      .slice(0, 5);
  }, [products, recentlyViewedIds]);

  return (
    <div className="bg-ornate-offwhite min-h-screen pb-4">
      <div className="sticky top-14 z-30 bg-ornate-offwhite/95 backdrop-blur-md border-b border-ornate-gold/20 pt-3 pb-2.5 px-4 space-y-2.5">
        <div className="relative">
          <Search
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ornate-charcoal/50"
            aria-hidden="true"
          />
          <input
            type="search"
            value={filters.search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search desks, chairs, brands..."
            aria-label="Search furniture products"
            className="w-full h-11 pl-10 pr-10 rounded-xl bg-white border border-ornate-gold/25 shadow-sm text-sm text-ornate-charcoal placeholder:text-ornate-charcoal/45 focus:border-ornate-darkgold outline-none"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-ornate-cream flex items-center justify-center text-ornate-charcoal/70"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-0.5 -mx-0.5">
          <button
            type="button"
            onClick={() => onSubcategoryChange("all")}
            className={`shrink-0 px-3.5 py-1.5 rounded-md text-xs font-medium border transition-all ${
              filters.subcategory === "all"
                ? "bg-ornate-charcoal text-white border-ornate-charcoal shadow-sm"
                : "bg-white text-ornate-charcoal border-ornate-gold/25"
            }`}
          >
            All ({subcategoryCounts.all ?? products.length})
          </button>
          {subcategories.map((sub) => {
            const isActive = filters.subcategory === sub.slug;
            return (
              <button
                key={sub.slug}
                type="button"
                onClick={() => onSubcategoryChange(sub.slug)}
                className={`shrink-0 px-3.5 py-1.5 rounded-md text-xs font-medium border transition-all ${
                  isActive
                    ? "bg-ornate-charcoal text-white border-ornate-charcoal shadow-sm"
                    : "bg-white text-ornate-charcoal border-ornate-gold/25"
                }`}
              >
                {sub.name} ({subcategoryCounts[sub.slug] ?? 0})
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-2 pt-0.5">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 px-0.5 -mx-0.5">
            <button
              type="button"
              onClick={() => setFilterSheetOpen(true)}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                activeFilterCount > 0
                  ? "bg-ornate-gold/20 border-ornate-darkgold text-ornate-charcoal"
                  : "bg-white border-ornate-gold/25 text-ornate-charcoal"
              }`}
            >
              <SlidersHorizontal size={13} aria-hidden="true" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-ornate-charcoal text-white text-[10px]">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => onDealsOnlyChange(!filters.dealsOnly)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                filters.dealsOnly
                  ? "bg-amber-50 border-ornate-darkgold text-ornate-charcoal"
                  : "bg-white border-ornate-gold/25 text-ornate-charcoal/80"
              }`}
            >
              Deals
            </button>

            <button
              type="button"
              onClick={() => setFilterSheetOpen(true)}
              className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-ornate-gold/25 text-ornate-charcoal/80"
            >
              <ArrowUpDown size={12} aria-hidden="true" />
              {SORT_LABELS[filters.sortBy]}
            </button>
          </div>

          <span className="shrink-0 text-[11px] font-medium text-ornate-charcoal/60">
            {filteredProducts.length} items
          </span>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-6">
        {isLoading && (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-ornate-gold/15 overflow-hidden animate-pulse"
              >
                <div className="aspect-[4/4.2] bg-ornate-cream" />
                <div className="p-3 space-y-2">
                  <div className="h-2.5 w-16 bg-ornate-cream rounded" />
                  <div className="h-4 w-full bg-ornate-cream rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && !isLoading && (
          <div className="bg-white rounded-3xl border border-ornate-gold/20 p-8 text-center mt-4">
            <PackageX size={34} className="mx-auto text-ornate-darkgold mb-2" />
            <h2 className="font-serif text-xl text-ornate-charcoal mb-1.5">
              Could Not Load Catalog
            </h2>
            <p className="text-xs text-ornate-charcoal/70 mb-5">
              Tap below to reload products from the store API.
            </p>
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ornate-charcoal text-white text-xs font-medium"
            >
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        )}

        {!isLoading && !isError && filteredProducts.length === 0 && (
          <div className="bg-white rounded-3xl border border-ornate-gold/20 p-8 text-center mt-4">
            <Search size={30} className="mx-auto text-ornate-darkgold mb-2" />
            <h2 className="font-serif text-xl text-ornate-charcoal mb-1.5">
              No Furniture Found
            </h2>
            <button
              type="button"
              onClick={onResetFilters}
              className="mt-3 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-ornate-charcoal text-white text-xs font-medium"
            >
              <RotateCcw size={13} /> Reset Filters
            </button>
          </div>
        )}

        {!isLoading && !isError && filteredProducts.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => {
              const wishlisted = isWishlisted(product.id);
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-xl border border-ornate-gold/20 overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[4/4.2] bg-ornate-cream overflow-hidden">
                      <Link to={`/shop/${product.slug}`} className="block w-full h-full">
                        <img
                          src={product.image}
                          alt={product.images[0]?.alt || product.name}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </Link>
                      {(product.dealActive || product.isFeatured) && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-sm bg-ornate-softblack/90 text-ornate-gold text-[10px] font-display uppercase tracking-wider">
                          {product.dealActive
                            ? `${product.savingsPercent}% OFF`
                            : "Featured"}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => void toggleWishlist(product.id, product.name)}
                        aria-label="Save to wishlist"
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow-xs"
                      >
                        <Heart
                          size={13}
                          className={
                            wishlisted ? "text-rose-600 fill-rose-600" : "text-ornate-charcoal"
                          }
                        />
                      </button>
                    </div>

                    <Link to={`/shop/${product.slug}`} className="block p-3 pb-1.5">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-[10px] font-medium uppercase tracking-wider text-ornate-darkgold truncate">
                          {product.brand}
                        </p>
                        {product.reviewCount > 0 && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-600 font-semibold">
                            <Star size={10} fill="currentColor" />
                            {product.averageRating}
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif text-sm text-ornate-charcoal leading-snug line-clamp-2 mt-0.5">
                        {product.name}
                      </h3>
                    </Link>
                  </div>

                  <div className="px-3 pb-3 pt-1 space-y-2">
                    <div className="flex items-end justify-between gap-1">
                      <div>
                        <p className="font-serif text-sm font-semibold text-ornate-charcoal">
                          {formatINR(product.price)}
                        </p>
                        {product.mrp && (
                          <p className="text-[10px] text-ornate-charcoal/45 line-through">
                            {formatINR(product.mrp)}
                          </p>
                        )}
                      </div>
                      {product.savingsPercent > 0 && (
                        <span className="text-[10px] font-semibold text-emerald-700">
                          -{product.savingsPercent}%
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={!product.inStock}
                      onClick={() => void addToCart(product, 1, true)}
                      className="w-full h-8 rounded-lg bg-ornate-charcoal text-white text-[11px] font-medium inline-flex items-center justify-center gap-1 disabled:opacity-45"
                    >
                      {product.inStock ? (
                        <>
                          <Plus size={12} /> Add to Cart
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={11} /> Sold Out
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {recentlyViewed.length > 0 && (
          <section className="pt-2">
            <h2 className="font-serif text-lg text-ornate-charcoal mb-2.5">
              Recently Viewed
            </h2>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {recentlyViewed.map((item) => (
                <Link
                  key={item.id}
                  to={`/shop/${item.slug}`}
                  className="w-36 shrink-0 bg-white rounded-xl border border-ornate-gold/20 overflow-hidden"
                >
                  <div className="h-24 bg-ornate-cream">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-2">
                    <p className="font-serif text-xs line-clamp-1">{item.name}</p>
                    <p className="text-xs font-semibold text-ornate-darkgold">
                      {formatINR(item.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Filter Sheet */}
      <Drawer open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
        <DrawerContent className="max-h-[85vh] bg-ornate-offwhite rounded-t-2xl">
          <DrawerHeader className="text-left border-b border-ornate-gold/15 pb-3">
            <div className="flex items-center justify-between">
              <DrawerTitle className="font-serif text-xl text-ornate-charcoal">
                Filter &amp; Sort
              </DrawerTitle>
              <button
                type="button"
                onClick={onResetFilters}
                className="text-xs font-medium text-ornate-darkgold"
              >
                Reset All
              </button>
            </div>
            <DrawerDescription className="text-xs text-ornate-charcoal/65">
              Narrow down furniture by brand, budget, deals, and availability.
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 py-4 overflow-y-auto space-y-6">
            <div>
              <p className="text-xs font-display uppercase tracking-wider text-ornate-charcoal/75 mb-2.5">
                Sort By
              </p>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(SORT_LABELS) as FurnitureSortOption[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onSortChange(key)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium border ${
                      filters.sortBy === key
                        ? "bg-ornate-charcoal text-white border-ornate-charcoal"
                        : "bg-white text-ornate-charcoal border-ornate-gold/25"
                    }`}
                  >
                    {SORT_LABELS[key]}
                  </button>
                ))}
              </div>
            </div>

            {availableBrands.length > 0 && (
              <div>
                <p className="text-xs font-display uppercase tracking-wider text-ornate-charcoal/75 mb-2.5">
                  Brand
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onBrandChange("all")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium border ${
                      filters.brand === "all"
                        ? "bg-ornate-charcoal text-white border-ornate-charcoal"
                        : "bg-white text-ornate-charcoal border-ornate-gold/25"
                    }`}
                  >
                    All Brands
                  </button>
                  {availableBrands.map((brand) => (
                    <button
                      key={brand}
                      type="button"
                      onClick={() => onBrandChange(brand)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-medium border ${
                        filters.brand === brand
                          ? "bg-ornate-charcoal text-white border-ornate-charcoal"
                          : "bg-white text-ornate-charcoal border-ornate-gold/25"
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-display uppercase tracking-wider text-ornate-charcoal/75">
                  Max Budget
                </p>
                <span className="text-sm font-semibold text-ornate-darkgold">
                  {formatINR(filters.maxPrice)}
                </span>
              </div>
              <Slider
                min={priceBounds.min}
                max={priceBounds.max}
                step={500}
                value={[filters.maxPrice]}
                onValueChange={([val]) => onPriceRangeChange(priceBounds.min, val)}
                aria-label="Maximum furniture price"
                className="my-3"
              />
            </div>

            <div className="bg-white rounded-2xl border border-ornate-gold/20 divide-y divide-ornate-gold/10">
              <div className="p-4 flex items-center justify-between">
                <span className="text-sm font-medium">In Stock Only</span>
                <Switch
                  checked={filters.inStockOnly}
                  onCheckedChange={onInStockChange}
                />
              </div>
              <div className="p-4 flex items-center justify-between">
                <span className="text-sm font-medium">Special Deals Only</span>
                <Switch
                  checked={filters.dealsOnly}
                  onCheckedChange={onDealsOnlyChange}
                />
              </div>
            </div>
          </div>

          <DrawerFooter className="border-t border-ornate-gold/15 bg-white">
            <button
              type="button"
              onClick={() => setFilterSheetOpen(false)}
              className="w-full h-12 rounded-xl bg-ornate-charcoal text-white font-display text-xs uppercase tracking-wider"
            >
              Show {filteredProducts.length} Furniture Pieces
            </button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default MobileShopView;
