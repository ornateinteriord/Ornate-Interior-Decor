import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, ShoppingBag, Trash2 } from "lucide-react";
import { formatINR } from "@ornate/utils";
import Seo from "@/components/seo/Seo";
import PageHeader from "@/components/ui-components/PageHeader";
import { useFurnitureCatalog } from "@/hooks/useFurnitureCatalog";
import { useStoreExtras } from "@/context/StoreExtrasContext";
import { useCart } from "@/context/CartContext";

const WishlistPage: React.FC = () => {
  const { data } = useFurnitureCatalog();
  const { wishlistIds, toggleWishlist } = useStoreExtras();
  const { addToCart } = useCart();

  const savedProducts = useMemo(() => {
    const products = data?.products ?? [];
    return wishlistIds
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is NonNullable<typeof p> => Boolean(p));
  }, [wishlistIds, data?.products]);

  return (
    <div className="bg-ornate-offwhite min-h-screen pb-16">
      <Seo
        title="Saved Wishlist"
        description="Your curated furniture wishlist at Ornate Interior Decor."
        path="/wishlist"
        noIndex
      />

      <div className="hidden md:block">
        <PageHeader
          subtitle="Favorites"
          title="Saved Furniture Wishlist"
          description="Keep track of pieces you love and move them into your bag anytime."
          breadcrumbs={[
            { name: "Home", path: "/" },
            { name: "Shop", path: "/shop" },
            { name: "Wishlist", path: "/wishlist" },
          ]}
        />
      </div>

      <section className="py-8 md:py-12">
        <div className="ornate-container">
          {savedProducts.length === 0 ? (
            <div className="max-w-lg mx-auto ornate-card p-10 text-center space-y-4">
              <Heart size={40} className="mx-auto text-ornate-darkgold" />
              <h1 className="font-serif text-3xl text-ornate-charcoal">
                No Saved Items Yet
              </h1>
              <p className="text-sm text-ornate-muted">
                Tap the heart icon on any furniture piece while browsing to save it here.
              </p>
              <Link to="/shop" className="ornate-btn-primary inline-flex items-center gap-2">
                Explore Collection <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProducts.map((product) => (
                <div
                  key={product.id}
                  className="ornate-card overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <Link
                      to={`/shop/${product.slug}`}
                      className="relative aspect-[4/3] bg-ornate-cream block overflow-hidden"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    <div className="p-5 space-y-1.5">
                      <p className="text-xs font-semibold text-ornate-darkgold">
                        {product.subcategoryName} · {product.brand}
                      </p>
                      <Link
                        to={`/shop/${product.slug}`}
                        className="font-sans font-semibold text-lg text-ornate-charcoal hover:text-ornate-moss block"
                      >
                        {product.name}
                      </Link>
                      <div className="flex items-baseline gap-2 pt-1">
                        <span className="font-sans text-lg font-bold price-nums">
                          {formatINR(product.price)}
                        </span>
                        {product.mrp && (
                          <span className="text-xs text-ornate-muted line-through price-nums">
                            {formatINR(product.mrp)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="px-5 pb-5 flex gap-2">
                    <button
                      type="button"
                      disabled={!product.inStock}
                      onClick={() => void addToCart(product, 1, true)}
                      className="flex-1 ornate-btn-primary py-2.5 text-xs gap-1.5 disabled:opacity-50"
                    >
                      <ShoppingBag size={14} />
                      {product.inStock ? "Move to Bag" : "Out of Stock"}
                    </button>
                    <button
                      type="button"
                      onClick={() => void toggleWishlist(product.id, product.name)}
                      aria-label="Remove from wishlist"
                      className="px-3.5 border border-rose-200 text-rose-700 rounded-full hover:bg-rose-50"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default WishlistPage;
