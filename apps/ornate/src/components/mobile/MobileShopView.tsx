import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpDown,
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
  const { items: cartItems, addToCart, updateQuantity } = useCart();
  const { isWishlisted, toggleWishlist, recentlyViewedIds } = useStoreExtras();

  const cartQtyByProduct = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of cartItems) map.set(item.productId, item.quantity);
    return map;
  }, [cartItems]);

  const recentlyViewed = useMemo(() => {
    const map = new Map(products.map((p) => [p.id, p]));
    return recentlyViewedIds
      .map((id) => map.get(id))
      .filter((p): p is FurnitureProduct => Boolean(p))
      .slice(0, 5);
  }, [products, recentlyViewedIds]);

  return (
    <div className="bg-ornate-offwhite min-h-screen pb-6">
      <div className="sticky top-14 z-30 bg-ornate-offwhite/95 backdrop-blur-md border-b border-ornate-border pt-3 pb-2.5 px-4 space-y-2.5">
        <div className="relative">
          <Search
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ornate-muted"
            aria-hidden="true"
          />
          <input
            type="search"
            value={filters.search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search desks, chairs, brands..."
            aria-label="Search furniture products"
            className="w-full h-11 pl-10 pr-10 rounded-full bg-white border border-ornate-border shadow-xs text-sm text-ornate-charcoal placeholder:text-ornate-muted/70 focus:border-ornate-moss outline-none"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-ornate-cream flex items-center justify-center text-ornate-charcoal"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <button
            type="button"
            onClick={() => onSubcategoryChange("all")}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              filters.subcategory === "all"
                ? "bg-ornate-moss text-white border-ornate-moss shadow-xs"
                : "bg-white text-ornate-charcoal border-ornate-border"
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
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  isActive
                    ? "bg-ornate-moss text-white border-ornate-moss shadow-xs"
                    : "bg-white text-ornate-charcoal border-ornate-border"
                }`}
              >
                {sub.name} ({subcategoryCounts[sub.slug] ?? 0})
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-2 pt-0.5">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <button
              type="button"
              onClick={() => setFilterSheetOpen(true)}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                activeFilterCount > 0
                  ? "bg-ornate-sage border-ornate-moss text-ornate-moss"
                  : "bg-white border-ornate-border text-ornate-charcoal"
              }`}
            >
              <SlidersHorizontal size={13} aria-hidden="true" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-ornate-moss text-white text-[10px]">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => onDealsOnlyChange(!filters.dealsOnly)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                filters.dealsOnly
                  ? "bg-amber-50 border-ornate-darkgold text-ornate-darkgold"
                  : "bg-white border-ornate-border text-ornate-charcoal"
              }`}
            >
              Deals
            </button>

            <button
              type="button"
              onClick={() => setFilterSheetOpen(true)}
              className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-ornate-border text-ornate-charcoal"
            >
              <ArrowUpDown size={12} aria-hidden="true" />
              {SORT_LABELS[filters.sortBy]}
            </button>
          </div>

          <span className="shrink-0 text-xs font-semibold text-ornate-muted price-nums">
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
                className="bg-white rounded-2xl border border-ornate-border overflow-hidden animate-pulse"
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
          <div className="ornate-card p-8 text-center mt-4">
            <PackageX size={34} className="mx-auto text-ornate-darkgold mb-2" />
            <h2 className="font-serif text-xl text-ornate-charcoal mb-1.5">
              Could Not Load Catalog
            </h2>
            <p className="text-xs text-ornate-muted mb-5">
              Tap below to reload products from the store API.
            </p>
            <button
              type="button"
              onClick={onRetry}
              className="ornate-btn-primary text-xs py-2.5 px-5 gap-2"
            >
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        )}

        {!isLoading && !isError && filteredProducts.length === 0 && (
          <div className="ornate-card p-8 text-center mt-4">
            <Search size={30} className="mx-auto text-ornate-darkgold mb-2" />
            <h2 className="font-serif text-xl text-ornate-charcoal mb-1.5">
              No Furniture Found
            </h2>
            <p className="text-xs text-ornate-muted mb-4">
              Try clearing your active filters or search terms.
            </p>
            <button
              type="button"
              onClick={onResetFilters}
              className="ornate-btn-primary text-xs py-2.5 px-5 gap-1.5"
            >
              <RotateCcw size={13} /> Reset Filters
            </button>
          </div>
        )}

        {!isLoading && !isError && filteredProducts.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => {
              const wishlisted = isWishlisted(product.id);
              const cartQty = cartQtyByProduct.get(product.id) || 0;
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-ornate-border overflow-hidden shadow-xs flex flex-col justify-between"
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
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-ornate-moss text-white text-[10px] font-semibold">
                          {product.dealActive
                            ? `${product.savingsPercent}% OFF`
                            : "Featured"}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => void toggleWishlist(product.id, product.name)}
                        aria-label="Save to wishlist"
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/95 border border-ornate-border flex items-center justify-center shadow-xs"
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
                        <p className="text-[11px] font-medium text-ornate-darkgold truncate">
                          {product.brand}
                        </p>
                        {product.reviewCount > 0 && (
                          <span className="inline-flex items-center gap-0.5 text-[11px] text-amber-600 font-semibold">
                            <Star size={10} fill="currentColor" />
                            {product.averageRating}
                          </span>
                        )}
                      </div>
                      <h3 className="font-sans text-sm font-semibold text-ornate-charcoal leading-snug line-clamp-2 mt-0.5">
                        {product.name}
                      </h3>
                    </Link>
                  </div>

                  <div className="px-3 pb-3 pt-1 space-y-2.5">
                    <div className="flex items-end justify-between gap-1">
                      <div>
                        <p className="font-sans text-sm font-bold text-ornate-charcoal price-nums">
                          {formatINR(product.price)}
                        </p>
                        {product.mrp && (
                          <p className="text-[11px] text-ornate-muted/75 line-through price-nums">
                            {formatINR(product.mrp)}
                          </p>
                        )}
                      </div>
                      {product.savingsPercent > 0 && (
                        <span className="text-[11px] font-semibold text-emerald-700">
                          -{product.savingsPercent}%
                        </span>
                      )}
                    </div>

                    {cartQty > 0 ? (
                      <div className="flex items-center justify-between border border-ornate-moss rounded-full bg-ornate-sage/50 h-8 px-1.5">
                        <button
                          type="button"
                          onClick={() => void updateQuantity(product.id, cartQty - 1)}
                          aria-label="Decrease quantity"
                          className="w-6 h-6 rounded-full flex items-center justify-center text-ornate-moss"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-bold text-ornate-moss price-nums">
                          {cartQty}
                        </span>
                        <button
                          type="button"
                          disabled={cartQty >= product.stockCount}
                          onClick={() => void updateQuantity(product.id, cartQty + 1)}
                          aria-label="Increase quantity"
                          className="w-6 h-6 rounded-full flex items-center justify-center text-ornate-moss disabled:opacity-40"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={!product.inStock}
                        onClick={() => void addToCart(product, 1, true)}
                        className="w-full h-8 rounded-full bg-ornate-moss text-white text-xs font-semibold inline-flex items-center justify-center gap-1 disabled:opacity-45"
                      >
                        {product.inStock ? (
                          <>
                            <Plus size={13} /> Add
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={12} /> Sold Out
                          </>
                        )}
                      </button>
                    )}
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
                  className="w-36 shrink-0 bg-white rounded-2xl border border-ornate-border overflow-hidden"
                >
                  <div className="h-24 bg-ornate-cream">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-2.5">
                    <p className="font-sans text-xs font-semibold text-ornate-charcoal line-clamp-1">
                      {item.name}
                    </p>
                    <p className="text-xs font-bold text-ornate-moss mt-0.5 price-nums">
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
        <DrawerContent className="max-h-[85vh] bg-ornate-offwhite rounded-t-3xl">
          <DrawerHeader className="text-left border-b border-ornate-border pb-3">
            <div className="flex items-center justify-between">
              <DrawerTitle className="font-serif text-xl text-ornate-charcoal">
                Filter &amp; Sort
              </DrawerTitle>
              <button
                type="button"
                onClick={onResetFilters}
                className="text-xs font-semibold text-ornate-darkgold"
              >
                Reset All
              </button>
            </div>
            <DrawerDescription className="text-xs text-ornate-muted">
              Narrow down furniture by brand, budget, deals, and availability.
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 py-4 overflow-y-auto space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ornate-muted mb-2.5">
                Sort By
              </p>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(SORT_LABELS) as FurnitureSortOption[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onSortChange(key)}
                    className={`px-3.5 py-2 rounded-full text-xs font-semibold border ${
                      filters.sortBy === key
                        ? "bg-ornate-moss text-white border-ornate-moss"
                        : "bg-white text-ornate-charcoal border-ornate-border"
                    }`}
                  >
                    {SORT_LABELS[key]}
                  </button>
                ))}
              </div>
            </div>

            {availableBrands.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-ornate-muted mb-2.5">
                  Brand
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onBrandChange("all")}
                    className={`px-3.5 py-2 rounded-full text-xs font-semibold border ${
                      filters.brand === "all"
                        ? "bg-ornate-moss text-white border-ornate-moss"
                        : "bg-white text-ornate-charcoal border-ornate-border"
                    }`}
                  >
                    All Brands
                  </button>
                  {availableBrands.map((brand) => (
                    <button
                      key={brand}
                      type="button"
                      onClick={() => onBrandChange(brand)}
                      className={`px-3.5 py-2 rounded-full text-xs font-semibold border ${
                        filters.brand === brand
                          ? "bg-ornate-moss text-white border-ornate-moss"
                          : "bg-white text-ornate-charcoal border-ornate-border"
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
                <p className="text-xs font-semibold uppercase tracking-wider text-ornate-muted">
                  Max Budget
                </p>
                <span className="text-sm font-bold text-ornate-moss price-nums">
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

            <div className="bg-white rounded-2xl border border-ornate-border divide-y divide-ornate-border">
              <div className="p-4 flex items-center justify-between">
                <span className="text-sm font-medium text-ornate-charcoal">In Stock Only</span>
                <Switch
                  checked={filters.inStockOnly}
                  onCheckedChange={onInStockChange}
                />
              </div>
              <div className="p-4 flex items-center justify-between">
                <span className="text-sm font-medium text-ornate-charcoal">Special Deals Only</span>
                <Switch
                  checked={filters.dealsOnly}
                  onCheckedChange={onDealsOnlyChange}
                />
              </div>
            </div>
          </div>

          <DrawerFooter className="border-t border-ornate-border bg-white">
            <button
              type="button"
              onClick={() => setFilterSheetOpen(false)}
              className="w-full h-12 rounded-full bg-ornate-moss text-white text-sm font-semibold"
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
