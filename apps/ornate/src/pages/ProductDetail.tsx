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

  const [pincode, setPincode] = useState("560040");
  const [pincodeInfo, setPincodeInfo] = useState<{
    zone: string;
    estimatedDays: string;
    freeInstallation: boolean;
    note: string;
  } | null>(null);

  const [alertEmail, setAlertEmail] = useState("");
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
      <div className="bg-ornate-offwhite min-h-screen pt-6 md:pt-28 pb-16">
        <div className="ornate-container">
          <div className="animate-pulse grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 aspect-[4/3] bg-ornate-cream rounded-2xl" />
            <div className="lg:col-span-6 space-y-4 py-4">
              <div className="h-3 w-40 bg-ornate-cream rounded" />
              <div className="h-9 w-3/4 bg-ornate-cream rounded" />
              <div className="h-6 w-1/3 bg-ornate-cream rounded" />
              <div className="h-28 w-full bg-ornate-cream rounded-2xl" />
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
          <div className="max-w-lg mx-auto ornate-card p-10 text-center">
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
          <div className="max-w-lg mx-auto ornate-card p-10 text-center">
            <PackageX size={38} className="mx-auto text-ornate-darkgold mb-3" />
            <h1 className="font-serif text-3xl text-ornate-charcoal mb-2">
              Product Not Found
            </h1>
            <Link to="/shop" className="ornate-btn-primary inline-flex items-center gap-2 mt-4">
              <ArrowLeft size={15} /> Back to Furniture Store
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
        <section className="pt-28 pb-4 bg-ornate-cream border-b border-ornate-border">
          <div className="ornate-container flex items-center justify-between gap-4">
            <nav aria-label="Breadcrumb">
              <ol className="inline-flex flex-wrap items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-ornate-border text-xs font-medium text-ornate-muted">
                <li>
                  <Link to="/" className="hover:text-ornate-moss">Home</Link>
                </li>
                <li><ChevronRight size={13} className="text-ornate-darkgold" /></li>
                <li>
                  <Link to="/shop" className="hover:text-ornate-moss">Shop</Link>
                </li>
                <li><ChevronRight size={13} className="text-ornate-darkgold" /></li>
                <li>
                  <Link
                    to={`/shop?category=${product.subcategorySlug}`}
                    className="hover:text-ornate-moss"
                  >
                    {product.subcategoryName}
                  </Link>
                </li>
                <li><ChevronRight size={13} className="text-ornate-darkgold" /></li>
                <li aria-current="page" className="text-ornate-charcoal font-semibold truncate max-w-[260px]">
                  {product.name}
                </li>
              </ol>
            </nav>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-ornate-charcoal hover:text-ornate-moss px-3 py-1.5 rounded-full bg-white border border-ornate-border"
              >
                <Share2 size={13} /> Share
              </button>
              <Link
                to="/shop"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-ornate-moss hover:text-ornate-darkgold shrink-0"
              >
                <ArrowLeft size={14} /> All Furniture
              </Link>
            </div>
          </div>
        </section>

        <section className="py-10 lg:py-12">
          <div className="ornate-container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              {/* Gallery */}
              <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-3">
                <div className="relative aspect-[4/3] bg-white border border-ornate-border rounded-2xl overflow-hidden shadow-sm">
                  <img
                    src={activeImage.url}
                    alt={activeImage.alt || product.name}
                    className="w-full h-full object-cover"
                  />
                  {(product.dealActive || product.isFeatured) && (
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-ornate-moss text-white text-xs font-semibold">
                      {product.dealActive
                        ? `Deal · ${product.savingsPercent}% Off`
                        : "Featured Piece"}
                    </span>
                  )}
                  <span
                    className={`absolute top-4 right-4 px-3 py-1 text-xs font-semibold rounded-full border ${
                      product.inStock
                        ? "bg-white/95 text-emerald-800 border-emerald-200"
                        : "bg-white/95 text-rose-700 border-rose-200"
                    }`}
                  >
                    {product.inStock
                      ? `In Stock (${product.stockCount})`
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
                        className={`aspect-square overflow-hidden rounded-xl border bg-white ${
                          idx === activeImageIdx
                            ? "border-ornate-moss ring-2 ring-ornate-moss/40"
                            : "border-ornate-border opacity-75 hover:opacity-100"
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
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-ornate-darkgold mb-2">
                    <span>{product.subcategoryName}</span>
                    <span>·</span>
                    <span>{product.brand}</span>
                    <span>·</span>
                    <span className="font-mono text-ornate-muted">{product.sku}</span>
                  </div>

                  <h1 className="font-serif text-3xl lg:text-4xl text-ornate-charcoal leading-[1.12] tracking-tight mb-3">
                    {product.name}
                  </h1>

                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    {reviews.length > 0 && (
                      <a
                        href="#product-reviews"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white px-3 py-1 border border-ornate-border rounded-full"
                      >
                        <Star size={13} className="text-amber-500 fill-amber-500" />
                        <span>{product.averageRating || "5.0"}</span>
                        <span className="text-ornate-muted">
                          ({reviews.length} reviews)
                        </span>
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => void toggleWishlist(product.id, product.name)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-ornate-charcoal hover:text-rose-700 px-3 py-1 rounded-full bg-white border border-ornate-border"
                    >
                      <Heart
                        size={13}
                        className={wishlisted ? "fill-rose-600 text-rose-600" : ""}
                      />
                      {wishlisted ? "Saved" : "Wishlist"}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleCompare(product.id, product.name)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-ornate-charcoal hover:text-ornate-moss px-3 py-1 rounded-full bg-white border border-ornate-border"
                    >
                      <GitCompareArrows size={13} />
                      {compared ? "In Compare" : "Compare"}
                    </button>
                  </div>

                  {product.shortDescription && (
                    <p className="text-sm text-ornate-muted leading-relaxed">
                      {product.shortDescription}
                    </p>
                  )}
                </div>

                {/* Price & Cart Box */}
                <div className="ornate-card p-6 space-y-4">
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span className="font-sans text-3xl font-bold text-ornate-charcoal price-nums">
                      {formatINR(product.price)}
                    </span>
                    {product.mrp && (
                      <span className="text-base text-ornate-muted line-through price-nums">
                        {formatINR(product.mrp)}
                      </span>
                    )}
                    {product.savingsPercent > 0 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
                        <Tag size={12} />
                        {product.savingsPercent}% off
                        {savingsAmount > 0 ? ` (Save ${formatINR(savingsAmount)})` : ""}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ornate-muted">
                    Inclusive of all taxes (18% GST). Free insured delivery above ₹25,000.
                  </p>

                  {product.inStock ? (
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-ornate-border rounded-full bg-ornate-offwhite px-1">
                          <button
                            type="button"
                            onClick={() => setQty((q) => Math.max(1, q - 1))}
                            aria-label="Decrease quantity"
                            className="w-9 h-10 flex items-center justify-center rounded-full hover:bg-white"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-9 text-center text-sm font-bold price-nums">
                            {qty}
                          </span>
                          <button
                            type="button"
                            disabled={qty >= product.stockCount}
                            onClick={() =>
                              setQty((q) => Math.min(product.stockCount, q + 1))
                            }
                            aria-label="Increase quantity"
                            className="w-9 h-10 flex items-center justify-center rounded-full hover:bg-white disabled:opacity-40"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => void addToCart(product, qty, true)}
                          className="flex-1 ornate-btn-primary h-11 gap-2"
                        >
                          <ShoppingBag size={15} /> Add to Bag
                        </button>

                        <button
                          type="button"
                          onClick={handleBuyNow}
                          className="ornate-btn-accent h-11 gap-1.5"
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
                      <p className="text-xs font-semibold text-rose-700">
                        Currently Out of Stock — get notified when restocked:
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          required
                          value={alertEmail}
                          onChange={(e) => setAlertEmail(e.target.value)}
                          placeholder="Enter email for restock alert"
                          className="ornate-input flex-1"
                        />
                        <button
                          type="submit"
                          className="ornate-btn-primary py-2 px-4 text-xs gap-1.5"
                        >
                          <Bell size={13} /> Notify Me
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Pincode Delivery Checker */}
                  <div className="pt-4 border-t border-ornate-border space-y-2">
                    <form onSubmit={handleCheckPincode} className="flex items-center gap-2">
                      <MapPin size={15} className="text-ornate-moss shrink-0" />
                      <input
                        type="text"
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                        placeholder="6-digit pincode"
                        className="w-40 px-3 py-1.5 text-xs border border-ornate-border rounded-full bg-ornate-offwhite"
                      />
                      <button
                        type="submit"
                        className="text-xs font-semibold text-ornate-moss hover:text-ornate-darkgold"
                      >
                        Check Delivery
                      </button>
                    </form>
                    {pincodeInfo && (
                      <p className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl">
                        <strong>{pincodeInfo.zone}:</strong> Estimated delivery in{" "}
                        {pincodeInfo.estimatedDays}. {pincodeInfo.note}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-ornate-border text-xs text-ornate-muted">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={15} className="text-ornate-moss shrink-0" />
                      <span>Razorpay Verified Online Checkout</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck size={15} className="text-ornate-moss shrink-0" />
                      <span>Bengaluru Delivery &amp; Setup</span>
                    </div>
                  </div>
                </div>

                {product.longDescription && (
                  <div className="space-y-2">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-ornate-darkgold">
                      Overview
                    </h2>
                    <p className="text-sm md:text-base text-ornate-charcoal/85 leading-relaxed">
                      {product.longDescription}
                    </p>
                  </div>
                )}

                <div className="ornate-card overflow-hidden">
                  <div className="px-5 py-3.5 bg-ornate-cream/70 border-b border-ornate-border flex items-center gap-2">
                    <Sparkles size={15} className="text-ornate-moss" />
                    <h2 className="font-sans text-xs font-semibold uppercase tracking-wider text-ornate-charcoal">
                      Specifications &amp; Details
                    </h2>
                  </div>

                  <dl className="divide-y divide-ornate-border text-sm">
                    <div className="px-5 py-3 flex items-center justify-between gap-4">
                      <dt className="text-ornate-muted">Brand</dt>
                      <dd className="font-semibold text-right">{product.brand}</dd>
                    </div>
                    <div className="px-5 py-3 flex items-center justify-between gap-4">
                      <dt className="text-ornate-muted">Collection</dt>
                      <dd className="font-semibold text-right">{product.subcategoryName}</dd>
                    </div>
                    <div className="px-5 py-3 flex items-center justify-between gap-4">
                      <dt className="text-ornate-muted">SKU</dt>
                      <dd className="font-mono text-xs font-medium text-right">{product.sku}</dd>
                    </div>
                    {product.attributes.map((attr) => (
                      <div
                        key={attr.key}
                        className="px-5 py-3 flex items-start justify-between gap-4"
                      >
                        <dt className="text-ornate-muted shrink-0">
                          {formatAttributeKey(attr.key)}
                        </dt>
                        <dd className="font-semibold text-right">{attr.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>

            {/* Customer Reviews */}
            <div id="product-reviews" className="mt-16 pt-12 border-t border-ornate-border grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5 ornate-card p-6 space-y-4">
                <h2 className="font-serif text-2xl text-ornate-charcoal">
                  Customer Reviews ({reviews.length})
                </h2>
                {isAuthenticated ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1">Your Rating</label>
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
                      className="ornate-input"
                    />
                    <textarea
                      rows={3}
                      required
                      placeholder="Share comfort, finish quality, and delivery experience..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="ornate-input"
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
                  <div className="bg-ornate-offwhite p-4 rounded-xl border border-ornate-border text-xs space-y-2">
                    <p>Sign in to rate and review this furniture piece.</p>
                    <Link
                      to={`/login?redirect=/shop/${product.slug}`}
                      className="inline-block text-ornate-moss font-semibold hover:underline"
                    >
                      Sign In to Write Review →
                    </Link>
                  </div>
                )}
              </div>

              <div className="lg:col-span-7 space-y-3">
                {reviews.length === 0 ? (
                  <div className="ornate-card p-8 text-center text-sm text-ornate-muted">
                    No customer reviews yet. Be the first to review {product.name}!
                  </div>
                ) : (
                  reviews.map((r) => (
                    <div
                      key={r.id}
                      className="ornate-card p-5 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-amber-600 text-xs font-semibold">
                            <Star size={13} fill="currentColor" /> {r.rating}/5
                          </span>
                          <span className="font-semibold text-sm">{r.userName}</span>
                          {r.verifiedPurchase && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-semibold">
                              <CheckCircle2 size={10} /> Verified Buyer
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-ornate-muted">
                          {new Date(r.createdAt).toLocaleDateString("en-IN")}
                        </span>
                      </div>
                      <h3 className="font-sans font-semibold text-base">{r.title}</h3>
                      <p className="text-xs text-ornate-muted leading-relaxed">
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
          <section className="py-14 bg-white border-t border-ornate-border">
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
                        className="group ornate-card bg-ornate-offwhite overflow-hidden"
                      >
                        <div className="aspect-[4/3] bg-ornate-cream overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-4">
                          <p className="text-xs font-medium text-ornate-darkgold">
                            {item.subcategoryName}
                          </p>
                          <h3 className="font-sans font-semibold text-base mt-1 text-ornate-charcoal">
                            {item.name}
                          </h3>
                          <p className="font-bold text-sm mt-2 price-nums">
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
                        className="ornate-card bg-ornate-offwhite overflow-hidden"
                      >
                        <div className="aspect-[4/3] bg-ornate-cream">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <p className="font-sans text-sm font-semibold line-clamp-1">{item.name}</p>
                          <p className="text-xs font-bold text-ornate-moss mt-1 price-nums">
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

      {/* Mobile Native View (Full Parity!) */}
      <div className="md:hidden pb-36">
        <div className="bg-white border-b border-ornate-border">
          <div className="relative aspect-[4/3] bg-ornate-cream overflow-hidden">
            <img
              src={activeImage.url}
              alt={activeImage.alt || product.name}
              className="w-full h-full object-cover"
            />
            {product.dealActive && (
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-ornate-moss text-white text-xs font-semibold">
                {product.savingsPercent}% Off
              </span>
            )}
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                aria-label="Share product"
                className="w-9 h-9 rounded-full bg-white/95 border border-ornate-border flex items-center justify-center shadow"
              >
                <Share2 size={15} className="text-ornate-charcoal" />
              </button>
              <button
                type="button"
                onClick={() => void toggleWishlist(product.id, product.name)}
                aria-label="Toggle wishlist"
                className="w-9 h-9 rounded-full bg-white/95 border border-ornate-border flex items-center justify-center shadow"
              >
                <Heart
                  size={16}
                  className={wishlisted ? "fill-rose-600 text-rose-600" : "text-ornate-charcoal"}
                />
              </button>
            </div>
          </div>
          {galleryImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-2.5">
              {galleryImages.map((img, idx) => (
                <button
                  key={img.id || img.url}
                  type="button"
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-14 h-14 shrink-0 rounded-xl overflow-hidden border ${
                    idx === activeImageIdx ? "border-ornate-moss ring-2 ring-ornate-moss/40" : "border-ornate-border"
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 pt-4 space-y-4">
          <div className="bg-white rounded-2xl border border-ornate-border p-4 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-ornate-darkgold">
                {product.subcategoryName} · {product.brand}
              </p>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                  product.inStock
                    ? "bg-emerald-50 text-emerald-800"
                    : "bg-rose-50 text-rose-700"
                }`}
              >
                {product.inStock ? `${product.stockCount} in stock` : "Sold Out"}
              </span>
            </div>
            <h1 className="font-serif text-2xl text-ornate-charcoal leading-tight">
              {product.name}
            </h1>
            <div className="flex items-baseline gap-2.5">
              <span className="font-sans text-2xl font-bold text-ornate-charcoal price-nums">
                {formatINR(product.price)}
              </span>
              {product.mrp && (
                <span className="text-sm text-ornate-muted line-through price-nums">
                  {formatINR(product.mrp)}
                </span>
              )}
              {product.savingsPercent > 0 && (
                <span className="text-xs font-semibold text-emerald-700">
                  -{product.savingsPercent}%
                </span>
              )}
            </div>
            <p className="text-xs text-ornate-muted">
              Incl. 18% GST · Free delivery above ₹25,000
            </p>
            {(product.longDescription || product.shortDescription) && (
              <p className="text-xs text-ornate-charcoal/85 leading-relaxed pt-2 border-t border-ornate-border">
                {product.longDescription || product.shortDescription}
              </p>
            )}
          </div>

          {/* Mobile Pincode Checker */}
          <div className="bg-white rounded-2xl border border-ornate-border p-4 space-y-2">
            <p className="text-xs font-semibold text-ornate-darkgold">
              Check Delivery Timeline
            </p>
            <form onSubmit={handleCheckPincode} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                placeholder="560040"
                className="flex-1 px-3 py-2 text-xs border border-ornate-border rounded-full bg-ornate-offwhite"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-ornate-moss text-white text-xs font-semibold rounded-full"
              >
                Check
              </button>
            </form>
            {pincodeInfo && (
              <p className="text-xs text-emerald-800">{pincodeInfo.estimatedDays}</p>
            )}
          </div>

          {/* Mobile Specifications Table */}
          <div className="bg-white rounded-2xl border border-ornate-border overflow-hidden">
            <div className="px-4 py-3 bg-ornate-cream/65 border-b border-ornate-border">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-ornate-charcoal">
                Specifications &amp; Details
              </h2>
            </div>
            <dl className="divide-y divide-ornate-border text-xs">
              <div className="px-4 py-2.5 flex justify-between">
                <dt className="text-ornate-muted">SKU</dt>
                <dd className="font-mono font-medium">{product.sku}</dd>
              </div>
              <div className="px-4 py-2.5 flex justify-between">
                <dt className="text-ornate-muted">Brand</dt>
                <dd className="font-semibold">{product.brand}</dd>
              </div>
              {product.attributes.map((attr) => (
                <div key={attr.key} className="px-4 py-2.5 flex justify-between gap-4">
                  <dt className="text-ornate-muted">{formatAttributeKey(attr.key)}</dt>
                  <dd className="font-semibold text-right">{attr.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Mobile Custom Enquiry */}
          <div className="bg-ornate-cream rounded-2xl border border-ornate-border p-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-ornate-charcoal">
                Custom Finish or Size?
              </p>
              <p className="text-xs text-ornate-muted">
                Enquire with our Bengaluru studio
              </p>
            </div>
            <Link
              to={enquiryHref}
              className="px-3.5 py-2 rounded-full bg-white border border-ornate-border text-xs font-semibold text-ornate-moss shrink-0"
            >
              Enquire
            </Link>
          </div>

          {/* Mobile Reviews */}
          <div className="bg-white rounded-2xl border border-ornate-border p-4 space-y-3">
            <h2 className="font-serif text-lg text-ornate-charcoal">
              Customer Reviews ({reviews.length})
            </h2>
            {reviews.length === 0 ? (
              <p className="text-xs text-ornate-muted">
                No reviews yet for this piece.
              </p>
            ) : (
              <div className="space-y-2.5">
                {reviews.slice(0, 3).map((r) => (
                  <div
                    key={r.id}
                    className="p-3 rounded-xl bg-ornate-offwhite border border-ornate-border space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-ornate-charcoal">
                        {r.userName}
                      </span>
                      <span className="inline-flex items-center gap-0.5 text-amber-600 font-semibold">
                        <Star size={11} fill="currentColor" /> {r.rating}
                      </span>
                    </div>
                    <p className="text-xs font-semibold">{r.title}</p>
                    <p className="text-xs text-ornate-muted">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Related Products */}
          {relatedProducts.length > 0 && (
            <div className="space-y-2.5">
              <h2 className="font-serif text-lg text-ornate-charcoal px-1">
                Similar Pieces
              </h2>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                {relatedProducts.map((item) => (
                  <Link
                    key={item.id}
                    to={`/shop/${item.slug}`}
                    className="w-40 shrink-0 bg-white rounded-2xl border border-ornate-border overflow-hidden"
                  >
                    <div className="h-28 bg-ornate-cream">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs font-semibold text-ornate-charcoal line-clamp-1">
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

        {/* Sticky Mobile Purchase Bar */}
        <div className="fixed bottom-16 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-ornate-border px-4 py-2.5 flex items-center gap-2.5 shadow-[0_-4px_16px_rgba(20,18,16,0.06)]">
          <button
            type="button"
            disabled={!product.inStock}
            onClick={() => void addToCart(product, 1, true)}
            className="flex-1 h-11 rounded-full border border-ornate-moss text-ornate-moss text-xs font-semibold inline-flex items-center justify-center gap-1.5 disabled:opacity-45"
          >
            <ShoppingBag size={14} /> Add to Bag
          </button>
          <button
            type="button"
            disabled={!product.inStock}
            onClick={handleBuyNow}
            className="flex-1 h-11 rounded-full bg-ornate-moss text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 disabled:opacity-45"
          >
            <Zap size={14} /> Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
