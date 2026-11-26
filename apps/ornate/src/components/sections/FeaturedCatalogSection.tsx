import React from "react";
import { Link } from "react-router-dom";
import {
  Archive,
  Armchair,
  ArrowRight,
  BedDouble,
  Briefcase,
  Heart,
  type LucideIcon,
  ShoppingBag,
  Sofa,
  Star,
  Sun,
  UtensilsCrossed,
} from "lucide-react";
import { useFurnitureCatalog } from "@/hooks/useFurnitureCatalog";
import { formatINR } from "@/lib/furnitureFilters";
import { useCart } from "@/context/CartContext";
import { useStoreExtras } from "@/context/StoreExtrasContext";

const SUBCATEGORY_ICONS: Record<string, LucideIcon> = {
  "bedroom-furniture": BedDouble,
  "dining-room-furniture": UtensilsCrossed,
  "living-room-furniture": Armchair,
  "office-furniture": Briefcase,
  "outdoor-furniture": Sun,
  "storage-furniture": Archive,
};

const FeaturedCatalogSection: React.FC = () => {
  const { data, isLoading } = useFurnitureCatalog();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useStoreExtras();

  const subcategories = data?.subcategories ?? [];
  const products = data?.products ?? [];
  const featured = products.slice(0, 4);

  if (!isLoading && subcategories.length === 0 && products.length === 0) {
    return null;
  }

  return (
    <>
      {/* Browse Collections Strip */}
      {(isLoading || subcategories.length > 0) && (
        <section className="py-16 bg-white border-b border-ornate-border">
          <div className="ornate-container">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="ornate-pill-label mb-2.5">Shop by Room</span>
                <h2 className="ornate-title">Explore Furniture Collections</h2>
              </div>
              <Link
                to="/shop"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-ornate-moss hover:text-ornate-darkgold transition-colors"
              >
                Browse full catalog <ArrowRight size={15} />
              </Link>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-28 rounded-2xl bg-ornate-offwhite border border-ornate-border animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {subcategories.map((sub) => {
                  const Icon = SUBCATEGORY_ICONS[sub.slug] ?? Sofa;
                  const count = products.filter(
                    (p) => p.subcategorySlug === sub.slug
                  ).length;
                  return (
                    <Link
                      key={sub.slug}
                      to={`/shop?category=${sub.slug}`}
                      className="group p-5 rounded-2xl bg-ornate-offwhite border border-ornate-border hover:border-ornate-moss hover:bg-ornate-sage/40 transition-all flex flex-col items-start justify-between gap-4"
                    >
                      <span className="w-11 h-11 rounded-xl bg-white border border-ornate-border group-hover:bg-ornate-moss group-hover:text-white group-hover:border-ornate-moss flex items-center justify-center text-ornate-moss transition-colors">
                        <Icon size={20} />
                      </span>
                      <div>
                        <h3 className="font-sans text-sm font-semibold text-ornate-charcoal group-hover:text-ornate-moss leading-snug">
                          {sub.name}
                        </h3>
                        <p className="text-xs text-ornate-muted mt-1 price-nums">
                          {count} {count === 1 ? "piece" : "pieces"}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Featured Furniture Pieces */}
      {(isLoading || featured.length > 0) && (
        <section className="py-18 py-16 bg-ornate-offwhite">
          <div className="ornate-container">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-9">
              <div>
                <span className="ornate-pill-label mb-2.5">Curated Store</span>
                <h2 className="ornate-title">Featured Furniture Pieces</h2>
              </div>
              <Link to="/shop" className="ornate-btn-outline gap-2">
                View All {products.length || ""} Pieces
                <ArrowRight size={15} />
              </Link>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="ornate-card overflow-hidden animate-pulse"
                  >
                    <div className="aspect-[4/3] bg-ornate-cream" />
                    <div className="p-5 space-y-2.5">
                      <div className="h-3 w-20 bg-ornate-cream rounded" />
                      <div className="h-5 w-3/4 bg-ornate-cream rounded" />
                      <div className="h-9 w-full bg-ornate-cream rounded-full mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featured.map((product) => {
                  const wishlisted = isWishlisted(product.id);
                  return (
                    <article
                      key={product.id}
                      className="ornate-card overflow-hidden flex flex-col justify-between group hover:border-ornate-moss/45 hover:shadow-md"
                    >
                      <div>
                        <div className="relative aspect-[4/3] bg-ornate-cream overflow-hidden">
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
                            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-ornate-moss text-white text-[11px] font-semibold">
                              {product.dealActive
                                ? `${product.savingsPercent}% Off`
                                : "Featured"}
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              void toggleWishlist(product.id, product.name)
                            }
                            aria-label="Toggle wishlist"
                            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-sm border transition-colors ${
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
                        </div>

                        <div className="p-5 pb-3">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-xs font-medium text-ornate-darkgold truncate">
                              {product.subcategoryName}
                            </span>
                            {product.reviewCount > 0 && (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-ornate-charcoal shrink-0">
                                <Star
                                  size={12}
                                  className="text-amber-500 fill-amber-500"
                                />
                                {product.averageRating}
                              </span>
                            )}
                          </div>
                          <h3 className="font-sans text-base font-semibold text-ornate-charcoal leading-snug line-clamp-2">
                            <Link
                              to={`/shop/${product.slug}`}
                              className="hover:text-ornate-moss transition-colors"
                            >
                              {product.name}
                            </Link>
                          </h3>
                        </div>
                      </div>

                      <div className="px-5 pb-5 pt-2 space-y-3">
                        <div className="flex items-baseline gap-2">
                          <span className="font-sans text-lg font-bold text-ornate-charcoal price-nums">
                            {formatINR(product.price)}
                          </span>
                          {product.mrp && (
                            <span className="text-xs text-ornate-muted line-through price-nums">
                              {formatINR(product.mrp)}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          disabled={!product.inStock}
                          onClick={() => void addToCart(product, 1, true)}
                          className="w-full h-10 rounded-full bg-ornate-moss text-white hover:bg-ornate-mossLight transition-colors text-xs font-semibold inline-flex items-center justify-center gap-1.5 disabled:opacity-45"
                        >
                          <ShoppingBag size={14} />
                          {product.inStock ? "Add to Bag" : "Out of Stock"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
};

export default FeaturedCatalogSection;
