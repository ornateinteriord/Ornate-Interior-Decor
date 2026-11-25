import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  CheckCircle2,
  ChevronRight,
  GitCompareArrows,
  Heart,
  MapPin,
  Minus,
  PackageX,
  Phone,
  Plus,
  RefreshCw,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Tag,
  Truck,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { getApiErrorMessage } from "@ornate/utils";
import Seo from "@/components/seo/Seo";
import { useFurnitureCatalog } from "@/hooks/useFurnitureCatalog";
import { formatAttributeKey, formatINR } from "@/lib/furnitureFilters";
import { STUDIO_INFO } from "@/lib/seo";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useStoreExtras } from "@/context/StoreExtrasContext";
import { ecommerceApi } from "@/services/ecommerceApi";

const ProductDetail: React.FC = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch } = useFurnitureCatalog();
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const {
    isWishlisted,
    toggleWishlist,
    compareIds,
    toggleCompare,
    trackProductView,
    recentlyViewedIds,
  } = useStoreExtras();

  const products = useMemo(() => data?.products ?? [], [data?.products]);
  const product = useMemo(
    () =>
      products.find(
        (item) => item.slug === productSlug || item.id === productSlug
      ) ?? null,
    [products, productSlug]
  );

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [qty, setQty] = useState(1);

  // Pincode check
  const [pincode, setPincode] = useState("560040");
  const [pincodeInfo, setPincodeInfo] = useState<{
    zone: string;
    estimatedDays: string;
    freeInstallation: boolean;
    note: string;
  } | null>(null);

  // Stock Alert
  const [alertEmail, setAlertEmail] = useState("");

  // Reviews
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const { data: reviews = [] } = useQuery({
    queryKey: ["product-reviews", product?.id],
    enabled: Boolean(product?.id),
    queryFn: () => ecommerceApi.getProductReviews(product!.id),
  });

  useEffect(() => {
    setActiveImageIdx(0);
    setQty(1);
    if (product?.id) {
      trackProductView(product.id);
    }
  }, [product?.id, trackProductView]);

  useEffect(() => {
    if (user?.email) setAlertEmail(user.email);
  }, [user?.email]);

  const galleryImages = useMemo(() => {
    if (!product) return [];
    if (product.images.length > 0) return product.images;
    return [
      {
        id: "primary",
        url: product.image,
        alt: product.name,
        order: 0,
      },
    ];
  }, [product]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    const sameCategory = products.filter(
      (item) =>
        item.id !== product.id &&
        item.subcategorySlug === product.subcategorySlug
    );
    if (sameCategory.length >= 3) return sameCategory.slice(0, 3);
    const others = products.filter(
      (item) =>
        item.id !== product.id &&
        item.subcategorySlug !== product.subcategorySlug
    );
    return [...sameCategory, ...others].slice(0, 3);
  }, [product, products]);

  const recentlyViewedProducts = useMemo(() => {
    const map = new Map(products.map((p) => [p.id, p]));
    return recentlyViewedIds
      .filter((id) => id !== product?.id)
      .map((id) => map.get(id))
      .filter((p): p is NonNullable<typeof p> => Boolean(p))
      .slice(0, 4);
  }, [products, recentlyViewedIds, product?.id]);

  if (isLoading) {
    return (
      <div className="bg-ornate-offwhite min-h-screen pt-4 md:pt-28 pb-16">
        <div className="ornate-container">
          <div className="animate-pulse grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 aspect-[4/3] bg-ornate-cream rounded-sm" />
            <div className="lg:col-span-6 space-y-4 py-4">
              <div className="h-3 w-40 bg-ornate-cream rounded" />
              <div className="h-9 w-3/4 bg-ornate-cream rounded" />
              <div className="h-6 w-1/3 bg-ornate-cream rounded" />
              <div className="h-28 w-full bg-ornate-cream rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-ornate-offwhite min-h-screen pt-10 md:pt-32 pb-20">
        <div className="ornate-container">
          <div className="max-w-lg mx-auto bg-white border border-ornate-gold/20 rounded-sm p-10 text-center shadow-sm">
            <PackageX size={38} className="mx-auto text-ornate-darkgold mb-3" />
            <h1 className="font-serif text-2xl text-ornate-charcoal mb-2">
              Unable to Load Product
            </h1>
            <button
              type="button"
              onClick={() => void refetch()}
              className="ornate-btn-primary inline-flex items-center gap-2 mt-4"
            >
              <RefreshCw size={15} /> Retry Loading
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-ornate-offwhite min-h-screen pt-10 md:pt-32 pb-20">
        <Seo
          title="Product Not Found"
          description="The requested furniture piece could not be found."
          path={`/shop/${productSlug ?? ""}`}
          noIndex
        />
        <div className="ornate-container">
          <div className="max-w-lg mx-auto bg-white border border-ornate-gold/20 rounded-sm p-10 text-center shadow-sm">
            <PackageX size={38} className="mx-auto text-ornate-darkgold mb-3" />
            <h1 className="font-serif text-3xl text-ornate-charcoal mb-2">
              Product Not Found
            </h1>
            <Link to="/shop" className="ornate-btn-primary inline-flex items-center gap-2 mt-4">
              <ArrowLeft size={15} /> Back to Furniture Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const activeImage = galleryImages[activeImageIdx] ?? galleryImages[0];
  const savingsAmount =
    product.mrp && product.mrp > product.price ? product.mrp - product.price : 0;
  const enquiryHref = `/contact?product=${encodeURIComponent(
    product.name
  )}&sku=${encodeURIComponent(product.sku)}`;
  const wishlisted = isWishlisted(product.id);
  const compared = compareIds.includes(product.id);

  const handleBuyNow = async () => {
    await addToCart(product, qty, false);
    if (!isAuthenticated) {
      navigate("/login?redirect=/checkout");
    } else {
      navigate("/checkout");
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url });
        return;
      } catch {
        // fallback to clipboard
      }
    }
    await navigator.clipboard.writeText(url);
    toast.success("Product link copied to clipboard");
  };

  const handleCheckPincode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const info = await ecommerceApi.checkPincode(pincode);
      setPincodeInfo(info);
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Invalid pincode"));
    }
  };

  const handleStockAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const msg = await ecommerceApi.subscribeStockAlert(product.id, alertEmail);
      toast.success(msg);
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Could not subscribe alert"));
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await ecommerceApi.submitProductReview(product.id, {
        rating,
        title: reviewTitle,
        comment: reviewComment,
      });
      setReviewTitle("");
      setReviewComment("");
      void queryClient.invalidateQueries({ queryKey: ["product-reviews", product.id] });
      void queryClient.invalidateQueries({ queryKey: ["furniture-catalog"] });
      toast.success("Thank you! Your review has been published.");
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Could not submit review"));
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="bg-ornate-offwhite min-h-screen">
      <Seo
        title={product.name}
        description={
          product.shortDescription ||
          `${product.name} by ${product.brand} — Ornate Interior Decor.`
        }
        path={`/shop/${product.slug}`}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
          { name: product.name, path: `/shop/${product.slug}` },
        ]}
      />

      {/* Desktop View */}
      <div className="hidden md:block">
        <section className="pt-24 pb-5 bg-ornate-cream/65 border-b border-ornate-gold/20">
          <div className="ornate-container flex items-center justify-between gap-4">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 text-[11px] font-display uppercase tracking-[0.16em] text-ornate-charcoal/65">
                <li>
                  <Link to="/" className="hover:text-ornate-darkgold">Home</Link>
                </li>
                <li><ChevronRight size={13} className="text-ornate-darkgold" /></li>
                <li>
                  <Link to="/shop" className="hover:text-ornate-darkgold">Shop</Link>
                </li>
                <li><ChevronRight size={13} className="text-ornate-darkgold" /></li>
                <li>
                  <Link
                    to={`/shop?category=${product.subcategorySlug}`}
                    className="hover:text-ornate-darkgold"
                  >
                    {product.subcategoryName}
                  </Link>
                </li>
                <li><ChevronRight size={13} className="text-ornate-darkgold" /></li>
                <li aria-current="page" className="text-ornate-charcoal font-medium truncate max-w-[260px]">
                  {product.name}
                </li>
              </ol>
            </nav>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 text-xs text-ornate-charcoal/75 hover:text-ornate-darkgold"
              >
                <Share2 size={14} /> Share
              </button>
              <Link
                to="/shop"
                className="inline-flex items-center gap-1.5 font-display text-xs uppercase tracking-[0.14em] text-ornate-darkgold hover:text-ornate-charcoal shrink-0"
              >
                <ArrowLeft size={14} /> All Furniture
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12 lg:py-14">
          <div className="ornate-container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              {/* Gallery */}
              <div className="lg:col-span-6 lg:sticky lg:top-28 space-y-3">
                <div className="relative aspect-[4/3] bg-white border border-ornate-gold/25 rounded-sm overflow-hidden shadow-sm">
                  <img
                    src={activeImage.url}
                    alt={activeImage.alt || product.name}
                    className="w-full h-full object-cover"
                  />
                  {(product.dealActive || product.isFeatured) && (
                    <span className="absolute top-4 left-4 px-3 py-1 bg-ornate-softblack/90 text-ornate-gold font-display text-[10px] uppercase tracking-[0.16em]">
                      {product.dealActive
                        ? `Deal · ${product.savingsPercent}% Off`
                        : "Featured Piece"}
                    </span>
                  )}
                  <span
                    className={`absolute top-4 right-4 px-3 py-1 text-xs font-medium rounded-sm border ${
                      product.inStock
                        ? "bg-white/95 text-emerald-800 border-emerald-200"
                        : "bg-white/95 text-rose-700 border-rose-200"
                    }`}
                  >
                    {product.inStock
                      ? `In Stock (${product.stockCount} available)`
                      : "Out of Stock"}
                  </span>
                </div>

                {galleryImages.length > 1 && (
                  <div className="grid grid-cols-5 gap-2.5">
                    {galleryImages.map((img, idx) => (
                      <button
                        key={img.id || img.url}
                        type="button"
                        onClick={() => setActiveImageIdx(idx)}
                        className={`aspect-square overflow-hidden rounded-sm border bg-white ${
                          idx === activeImageIdx
                            ? "border-ornate-charcoal ring-1 ring-ornate-charcoal"
                            : "border-ornate-gold/25 opacity-75 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={img.alt || product.name}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Details & Purchase Controls */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-display uppercase tracking-[0.16em] text-ornate-darkgold mb-2">
                    <span>{product.subcategoryName}</span>
                    <span>·</span>
                    <span>{product.brand}</span>
                    <span>·</span>
                    <span className="text-ornate-charcoal/60">{product.sku}</span>
                  </div>

                  <h1 className="font-serif text-3xl lg:text-4xl text-ornate-charcoal leading-[1.15] tracking-tight mb-3">
                    {product.name}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 mb-3">
                    {reviews.length > 0 && (
                      <a
                        href="#product-reviews"
                        className="inline-flex items-center gap-1.5 text-xs font-medium bg-white px-2.5 py-1 border border-ornate-gold/25 rounded-sm"
                      >
                        <Star size={13} className="text-amber-500 fill-amber-500" />
                        <span>{product.averageRating || "5.0"}</span>
                        <span className="text-ornate-charcoal/60">
                          ({reviews.length} reviews)
                        </span>
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => void toggleWishlist(product.id, product.name)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-ornate-charcoal/80 hover:text-rose-700"
                    >
                      <Heart
                        size={14}
                        className={wishlisted ? "fill-rose-600 text-rose-600" : ""}
                      />
                      {wishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleCompare(product.id, product.name)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-ornate-charcoal/80 hover:text-ornate-darkgold"
                    >
                      <GitCompareArrows size={14} />
                      {compared ? "In Compare" : "Compare"}
                    </button>
                  </div>

                  {product.shortDescription && (
                    <p className="text-sm text-ornate-charcoal/75 leading-relaxed">
                      {product.shortDescription}
                    </p>
                  )}
                </div>

                {/* Price & Cart Box */}
                <div className="bg-white border border-ornate-gold/25 rounded-sm p-6 space-y-4 shadow-sm">
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span className="font-serif text-3xl font-semibold text-ornate-charcoal">
                      {formatINR(product.price)}
                    </span>
                    {product.mrp && (
                      <span className="text-base text-ornate-charcoal/45 line-through">
                        {formatINR(product.mrp)}
                      </span>
                    )}
                    {product.savingsPercent > 0 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
                        <Tag size={12} />
                        {product.savingsPercent}% off
                        {savingsAmount > 0 ? ` (Save ${formatINR(savingsAmount)})` : ""}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ornate-charcoal/60">
                    Inclusive of all taxes (18% GST). Free shipping above ₹25,000.
                  </p>

                  {product.inStock ? (
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-ornate-gold/30 rounded-sm bg-ornate-offwhite">
                          <button
                            type="button"
                            onClick={() => setQty((q) => Math.max(1, q - 1))}
                            className="w-10 h-11 flex items-center justify-center hover:bg-ornate-cream"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-10 text-center text-sm font-semibold">
                            {qty}
                          </span>
                          <button
                            type="button"
                            disabled={qty >= product.stockCount}
                            onClick={() =>
                              setQty((q) => Math.min(product.stockCount, q + 1))
                            }
                            className="w-10 h-11 flex items-center justify-center hover:bg-ornate-cream disabled:opacity-40"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => void addToCart(product, qty, true)}
                          className="flex-1 ornate-btn-primary h-11 gap-2"
                        >
                          <ShoppingBag size={15} /> Add to Cart
                        </button>

                        <button
                          type="button"
                          onClick={handleBuyNow}
                          className="ornate-btn h-11 bg-ornate-gold text-ornate-softblack hover:bg-ornate-darkgold hover:text-white gap-1.5"
                        >
                          <Zap size={15} /> Buy Now
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-3 pt-1">
                        <Link
                          to={enquiryHref}
                          className="ornate-btn-outline flex-1 py-2.5 gap-2"
                        >
                          Enquire Custom Finish <ArrowRight size={14} />
                        </Link>
                        <a
                          href={STUDIO_INFO.phoneHref}
                          className="ornate-btn-outline py-2.5 gap-2"
                        >
                          <Phone size={14} /> Call Studio
                        </a>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleStockAlert} className="space-y-2.5 pt-2">
                      <p className="text-xs font-medium text-rose-700">
                        Currently Out of Stock — get notified when restocked:
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          required
                          value={alertEmail}
                          onChange={(e) => setAlertEmail(e.target.value)}
                          placeholder="Enter email for restock alert"
                          className="flex-1 px-3 py-2 text-xs border border-ornate-gold/30 rounded-sm bg-ornate-offwhite"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-ornate-charcoal text-white text-xs font-medium rounded-sm inline-flex items-center gap-1.5"
                        >
                          <Bell size={13} /> Notify Me
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Pincode Delivery Checker */}
                  <div className="pt-4 border-t border-ornate-gold/15 space-y-2">
                    <form onSubmit={handleCheckPincode} className="flex items-center gap-2">
                      <MapPin size={15} className="text-ornate-darkgold shrink-0" />
                      <input
                        type="text"
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                        placeholder="Enter 6-digit delivery pincode"
                        className="w-44 px-3 py-1.5 text-xs border border-ornate-gold/30 rounded-sm bg-ornate-offwhite"
                      />
                      <button
                        type="submit"
                        className="text-xs font-medium text-ornate-darkgold hover:underline"
                      >
                        Check Delivery
                      </button>
                    </form>
                    {pincodeInfo && (
                      <p className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-sm">
                        <strong>{pincodeInfo.zone}:</strong> Estimated delivery in{" "}
                        {pincodeInfo.estimatedDays}. {pincodeInfo.note}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-ornate-gold/15 text-xs text-ornate-charcoal/75">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={15} className="text-ornate-darkgold shrink-0" />
                      <span>Razorpay Verified Online Checkout</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck size={15} className="text-ornate-darkgold shrink-0" />
                      <span>Bengaluru Delivery &amp; Setup</span>
                    </div>
                  </div>
                </div>

                {product.longDescription && (
                  <div className="space-y-2">
                    <h2 className="font-display text-xs uppercase tracking-[0.16em] text-ornate-darkgold">
                      Overview
                    </h2>
                    <p className="text-sm md:text-base text-ornate-charcoal/80 leading-relaxed">
                      {product.longDescription}
                    </p>
                  </div>
                )}

                <div className="bg-white border border-ornate-gold/25 rounded-sm overflow-hidden">
                  <div className="px-5 py-3.5 bg-ornate-cream/55 border-b border-ornate-gold/15 flex items-center gap-2">
                    <Sparkles size={14} className="text-ornate-darkgold" />
                    <h2 className="font-display text-xs uppercase tracking-[0.16em] text-ornate-charcoal">
                      Specifications &amp; Details
                    </h2>
                  </div>

                  <dl className="divide-y divide-ornate-gold/15 text-sm">
                    <div className="px-5 py-3 flex items-center justify-between gap-4">
                      <dt className="text-ornate-charcoal/65">Brand</dt>
                      <dd className="font-medium text-right">{product.brand}</dd>
                    </div>
                    <div className="px-5 py-3 flex items-center justify-between gap-4">
                      <dt className="text-ornate-charcoal/65">Collection</dt>
                      <dd className="font-medium text-right">{product.subcategoryName}</dd>
                    </div>
                    <div className="px-5 py-3 flex items-center justify-between gap-4">
                      <dt className="text-ornate-charcoal/65">SKU</dt>
                      <dd className="font-medium text-right">{product.sku}</dd>
                    </div>
                    {product.attributes.map((attr) => (
                      <div
                        key={attr.key}
                        className="px-5 py-3 flex items-start justify-between gap-4"
                      >
                        <dt className="text-ornate-charcoal/65 shrink-0">
                          {formatAttributeKey(attr.key)}
                        </dt>
                        <dd className="font-medium text-right">{attr.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>

            {/* Customer Reviews */}
            <div id="product-reviews" className="mt-16 pt-12 border-t border-ornate-gold/20 grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5 bg-white border border-ornate-gold/25 rounded-sm p-6 space-y-4">
                <h2 className="font-serif text-2xl text-ornate-charcoal">
                  Customer Reviews ({reviews.length})
                </h2>
                {isAuthenticated ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium mb-1">Your Rating</label>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((starVal) => (
                          <button
                            key={starVal}
                            type="button"
                            onClick={() => setRating(starVal)}
                            className="p-1"
                          >
                            <Star
                              size={20}
                              className={
                                starVal <= rating
                                  ? "text-amber-500 fill-amber-500"
                                  : "text-gray-300"
                              }
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Review headline"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-ornate-gold/30 rounded-sm bg-ornate-offwhite"
                    />
                    <textarea
                      rows={3}
                      required
                      placeholder="Share comfort, finish quality, and delivery experience..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-ornate-gold/30 rounded-sm bg-ornate-offwhite"
                    />
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="ornate-btn-primary py-2.5 px-5"
                    >
                      {submittingReview ? "Posting..." : "Submit Review"}
                    </button>
                  </form>
                ) : (
                  <div className="bg-ornate-offwhite p-4 rounded-sm border border-ornate-gold/20 text-xs space-y-2">
                    <p>Sign in to rate and review this furniture piece.</p>
                    <Link
                      to={`/login?redirect=/shop/${product.slug}`}
                      className="inline-block text-ornate-darkgold font-semibold hover:underline"
                    >
                      Sign In to Write Review →
                    </Link>
                  </div>
                )}
              </div>

              <div className="lg:col-span-7 space-y-3">
                {reviews.length === 0 ? (
                  <div className="bg-white border border-ornate-gold/20 rounded-sm p-8 text-center text-sm text-ornate-charcoal/65">
                    No customer reviews yet. Be the first to review {product.name}!
                  </div>
                ) : (
                  reviews.map((r) => (
                    <div
                      key={r.id}
                      className="bg-white border border-ornate-gold/20 rounded-sm p-5 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-amber-600 text-xs font-semibold">
                            <Star size={13} fill="currentColor" /> {r.rating}/5
                          </span>
                          <span className="font-medium text-sm">{r.userName}</span>
                          {r.verifiedPurchase && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-medium">
                              <CheckCircle2 size={10} /> Verified Buyer
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-ornate-charcoal/55">
                          {new Date(r.createdAt).toLocaleDateString("en-IN")}
                        </span>
                      </div>
                      <h3 className="font-serif text-base">{r.title}</h3>
                      <p className="text-xs text-ornate-charcoal/75 leading-relaxed">
                        {r.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {(relatedProducts.length > 0 || recentlyViewedProducts.length > 0) && (
          <section className="py-14 bg-white border-t border-ornate-gold/15">
            <div className="ornate-container space-y-12">
              {relatedProducts.length > 0 && (
                <div>
                  <h2 className="font-serif text-2xl md:text-3xl text-ornate-charcoal mb-6">
                    Related Furniture Pieces
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedProducts.map((item) => (
                      <Link
                        key={item.id}
                        to={`/shop/${item.slug}`}
                        className="group bg-ornate-offwhite border border-ornate-gold/20 rounded-sm overflow-hidden"
                      >
                        <div className="aspect-[4/3] bg-ornate-cream overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-4">
                          <p className="text-[11px] uppercase tracking-wider text-ornate-darkgold">
                            {item.subcategoryName}
                          </p>
                          <h3 className="font-serif text-lg mt-1">{item.name}</h3>
                          <p className="font-semibold text-sm mt-2">
                            {formatINR(item.price)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {recentlyViewedProducts.length > 0 && (
                <div>
                  <h2 className="font-serif text-2xl text-ornate-charcoal mb-5">
                    Recently Viewed
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {recentlyViewedProducts.map((item) => (
                      <Link
                        key={item.id}
                        to={`/shop/${item.slug}`}
                        className="bg-ornate-offwhite border border-ornate-gold/20 rounded-sm overflow-hidden"
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
                          <p className="text-xs font-semibold text-ornate-darkgold mt-1">
                            {formatINR(item.price)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </div>

      {/* Mobile Native View */}
      <div className="md:hidden pb-24">
        <div className="bg-white border-b border-ornate-gold/15">
          <div className="relative aspect-[4/3] bg-ornate-cream overflow-hidden">
            <img
              src={activeImage.url}
              alt={activeImage.alt || product.name}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => void toggleWishlist(product.id, product.name)}
              className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/95 flex items-center justify-center shadow"
            >
              <Heart
                size={16}
                className={wishlisted ? "fill-rose-600 text-rose-600" : "text-ornate-charcoal"}
              />
            </button>
          </div>
          {galleryImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-2.5">
              {galleryImages.map((img, idx) => (
                <button
                  key={img.id || img.url}
                  type="button"
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-14 h-14 shrink-0 rounded-md overflow-hidden border ${
                    idx === activeImageIdx ? "border-ornate-charcoal" : "border-ornate-gold/25"
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 pt-4 space-y-4">
          <div className="bg-white rounded-xl border border-ornate-gold/20 p-4 space-y-2.5">
            <p className="text-[11px] font-display uppercase tracking-wider text-ornate-darkgold">
              {product.subcategoryName} · {product.brand}
            </p>
            <h1 className="font-serif text-2xl text-ornate-charcoal">{product.name}</h1>
            <div className="flex items-baseline gap-2.5">
              <span className="font-serif text-2xl font-semibold">
                {formatINR(product.price)}
              </span>
              {product.mrp && (
                <span className="text-sm text-ornate-charcoal/45 line-through">
                  {formatINR(product.mrp)}
                </span>
              )}
            </div>
            {product.longDescription && (
              <p className="text-xs text-ornate-charcoal/80 leading-relaxed pt-2 border-t border-ornate-gold/10">
                {product.longDescription}
              </p>
            )}
          </div>

          <div className="bg-white rounded-xl border border-ornate-gold/20 p-4 space-y-2">
            <p className="text-xs font-display uppercase tracking-wider text-ornate-darkgold">
              Check Pincode Delivery
            </p>
            <form onSubmit={handleCheckPincode} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                placeholder="560040"
                className="flex-1 px-3 py-2 text-xs border border-ornate-gold/30 rounded-lg"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-ornate-charcoal text-white text-xs rounded-lg"
              >
                Check
              </button>
            </form>
            {pincodeInfo && (
              <p className="text-xs text-emerald-800">{pincodeInfo.estimatedDays}</p>
            )}
          </div>
        </div>

        {/* Sticky Mobile Purchase Bar */}
        <div className="fixed bottom-16 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-ornate-gold/20 px-4 py-2.5 flex items-center gap-2 shadow-[0_-4px_16px_rgba(26,24,22,0.06)]">
          <button
            type="button"
            disabled={!product.inStock}
            onClick={() => void addToCart(product, 1, true)}
            className="flex-1 h-11 rounded-xl border border-ornate-charcoal text-ornate-charcoal text-xs font-semibold inline-flex items-center justify-center gap-1.5 disabled:opacity-45"
          >
            <ShoppingBag size={14} /> Add to Cart
          </button>
          <button
            type="button"
            disabled={!product.inStock}
            onClick={handleBuyNow}
            className="flex-1 h-11 rounded-xl bg-ornate-charcoal text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 disabled:opacity-45"
          >
            <Zap size={14} /> Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
