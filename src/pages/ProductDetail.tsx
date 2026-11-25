import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  PackageX,
  Phone,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Tag,
  Truck,
} from "lucide-react";
import Seo from "@/components/seo/Seo";
import { useFurnitureCatalog } from "@/hooks/useFurnitureCatalog";
import { formatAttributeKey, formatINR } from "@/lib/furnitureFilters";
import { STUDIO_INFO } from "@/lib/seo";

const ProductDetail: React.FC = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  const { data, isLoading, isError, refetch } = useFurnitureCatalog();

  const products = useMemo(() => data?.products ?? [], [data?.products]);
  const product = useMemo(
    () =>
      products.find(
        (item) => item.slug === productSlug || item.id === productSlug
      ) ?? null,
    [products, productSlug]
  );

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

  const [activeImageIdx, setActiveImageIdx] = useState(0);

  useEffect(() => {
    setActiveImageIdx(0);
  }, [product?.id]);

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
            <PackageX
              size={38}
              className="mx-auto text-ornate-darkgold mb-3"
              aria-hidden="true"
            />
            <h1 className="font-serif text-2xl text-ornate-charcoal mb-2">
              Unable to Load Product
            </h1>
            <p className="text-sm text-ornate-charcoal/75 mb-6">
              We couldn&apos;t retrieve this furniture item right now. Please try again.
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="ornate-btn-primary inline-flex items-center gap-2"
            >
              <RefreshCw size={15} aria-hidden="true" />
              Retry Loading
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
          description="The requested furniture piece could not be found in our collection."
          path={`/shop/${productSlug ?? ""}`}
          noIndex
        />
        <div className="ornate-container">
          <div className="max-w-lg mx-auto bg-white border border-ornate-gold/20 rounded-sm p-10 text-center shadow-sm">
            <PackageX
              size={38}
              className="mx-auto text-ornate-darkgold mb-3"
              aria-hidden="true"
            />
            <h1 className="font-serif text-3xl text-ornate-charcoal mb-2">
              Product Not Found
            </h1>
            <p className="text-sm text-ornate-charcoal/75 mb-6 leading-relaxed">
              This furniture piece may have been archived or its catalog link may have changed.
            </p>
            <Link
              to="/shop"
              className="ornate-btn-primary inline-flex items-center gap-2"
            >
              <ArrowLeft size={15} aria-hidden="true" />
              Back to Furniture Shop
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

  return (
    <div className="bg-ornate-offwhite min-h-screen">
      <Seo
        title={product.name}
        description={
          product.shortDescription ||
          `${product.name} by ${product.brand} — available through Ornate Interior Decor in Bengaluru.`
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
        {/* Top Breadcrumb Bar */}
        <section className="pt-24 pb-5 bg-ornate-cream/65 border-b border-ornate-gold/20">
          <div className="ornate-container flex items-center justify-between gap-4">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 text-[11px] font-display uppercase tracking-[0.16em] text-ornate-charcoal/65">
                <li>
                  <Link to="/" className="hover:text-ornate-darkgold transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <ChevronRight size={13} className="text-ornate-darkgold" aria-hidden="true" />
                </li>
                <li>
                  <Link to="/shop" className="hover:text-ornate-darkgold transition-colors">
                    Shop
                  </Link>
                </li>
                <li>
                  <ChevronRight size={13} className="text-ornate-darkgold" aria-hidden="true" />
                </li>
                <li>
                  <Link
                    to={`/shop?category=${product.subcategorySlug}`}
                    className="hover:text-ornate-darkgold transition-colors"
                  >
                    {product.subcategoryName}
                  </Link>
                </li>
                <li>
                  <ChevronRight size={13} className="text-ornate-darkgold" aria-hidden="true" />
                </li>
                <li aria-current="page" className="text-ornate-charcoal font-medium truncate max-w-[260px]">
                  {product.name}
                </li>
              </ol>
            </nav>

            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 font-display text-xs uppercase tracking-[0.14em] text-ornate-darkgold hover:text-ornate-charcoal transition-colors shrink-0"
            >
              <ArrowLeft size={14} aria-hidden="true" />
              All Furniture
            </Link>
          </div>
        </section>

        {/* Main 2-Column Product Showcase */}
        <section className="py-12 lg:py-14">
          <div className="ornate-container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              {/* Left: Gallery */}
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
                        aria-label={`View image ${idx + 1} of ${product.name}`}
                        className={`aspect-square overflow-hidden rounded-sm border bg-white transition-all ${
                          idx === activeImageIdx
                            ? "border-ornate-charcoal ring-1 ring-ornate-charcoal"
                            : "border-ornate-gold/25 opacity-75 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={img.alt || `${product.name} view ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Details & Specs */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-display uppercase tracking-[0.16em] text-ornate-darkgold mb-2">
                    <span>{product.subcategoryName}</span>
                    <span aria-hidden="true">·</span>
                    <span>{product.brand}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-ornate-charcoal/60">{product.sku}</span>
                  </div>

                  <h1 className="font-serif text-3xl lg:text-4xl text-ornate-charcoal leading-[1.15] tracking-tight mb-3">
                    {product.name}
                  </h1>

                  {product.shortDescription && (
                    <p className="text-sm text-ornate-charcoal/75 leading-relaxed">
                      {product.shortDescription}
                    </p>
                  )}
                </div>

                {/* Price Panel */}
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
                        <Tag size={12} aria-hidden="true" />
                        {product.savingsPercent}% off
                        {savingsAmount > 0 ? ` (Save ${formatINR(savingsAmount)})` : ""}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3 pt-1">
                    <Link
                      to={enquiryHref}
                      className="ornate-btn-primary flex-1 min-w-[200px] gap-2"
                    >
                      Enquire at Studio
                      <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                    <a
                      href={STUDIO_INFO.phoneHref}
                      className="ornate-btn-outline gap-2"
                    >
                      <Phone size={15} aria-hidden="true" />
                      Call Studio
                    </a>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-ornate-gold/15 text-xs text-ornate-charcoal/75">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={15} className="text-ornate-darkgold shrink-0" aria-hidden="true" />
                      <span>Vijayanagar Studio Consultation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck size={15} className="text-ornate-darkgold shrink-0" aria-hidden="true" />
                      <span>Bengaluru Delivery &amp; Setup</span>
                    </div>
                  </div>
                </div>

                {/* Full Description */}
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

                {/* Specifications Table */}
                <div className="bg-white border border-ornate-gold/25 rounded-sm overflow-hidden">
                  <div className="px-5 py-3.5 bg-ornate-cream/55 border-b border-ornate-gold/15 flex items-center gap-2">
                    <Sparkles size={14} className="text-ornate-darkgold" aria-hidden="true" />
                    <h2 className="font-display text-xs uppercase tracking-[0.16em] text-ornate-charcoal">
                      Specifications &amp; Details
                    </h2>
                  </div>

                  <dl className="divide-y divide-ornate-gold/15 text-sm">
                    <div className="px-5 py-3 flex items-center justify-between gap-4">
                      <dt className="text-ornate-charcoal/65">Brand</dt>
                      <dd className="font-medium text-ornate-charcoal text-right">
                        {product.brand}
                      </dd>
                    </div>
                    <div className="px-5 py-3 flex items-center justify-between gap-4">
                      <dt className="text-ornate-charcoal/65">Collection</dt>
                      <dd className="font-medium text-ornate-charcoal text-right">
                        {product.subcategoryName}
                      </dd>
                    </div>
                    <div className="px-5 py-3 flex items-center justify-between gap-4">
                      <dt className="text-ornate-charcoal/65">SKU</dt>
                      <dd className="font-medium text-ornate-charcoal text-right">
                        {product.sku}
                      </dd>
                    </div>
                    {product.attributes.map((attr) => (
                      <div
                        key={attr.key}
                        className="px-5 py-3 flex items-start justify-between gap-4"
                      >
                        <dt className="text-ornate-charcoal/65 shrink-0">
                          {formatAttributeKey(attr.key)}
                        </dt>
                        <dd className="font-medium text-ornate-charcoal text-right">
                          {attr.value}
                        </dd>
                      </div>
                    ))}
                    <div className="px-5 py-3 flex items-center justify-between gap-4">
                      <dt className="text-ornate-charcoal/65 inline-flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-ornate-darkgold" aria-hidden="true" />
                        Availability
                      </dt>
                      <dd className="font-medium text-ornate-charcoal text-right">
                        {product.inStock
                          ? `In Stock (${product.stockCount} available)`
                          : "Out of Stock"}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="py-14 bg-white border-t border-ornate-gold/15">
            <div className="ornate-container">
              <div className="flex items-end justify-between gap-4 mb-8">
                <div>
                  <p className="ornate-subtitle mb-1.5">Continue Browsing</p>
                  <h2 className="font-serif text-2xl md:text-3xl text-ornate-charcoal">
                    Related Furniture Pieces
                  </h2>
                </div>
                <Link
                  to={`/shop?category=${product.subcategorySlug}`}
                  className="inline-flex items-center gap-1.5 font-display text-xs uppercase tracking-[0.14em] text-ornate-darkgold hover:text-ornate-charcoal transition-colors"
                >
                  View Collection
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProducts.map((item) => (
                  <Link
                    key={item.id}
                    to={`/shop/${item.slug}`}
                    className="group bg-ornate-offwhite border border-ornate-gold/20 hover:border-ornate-darkgold/50 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
                  >
                    <div className="relative aspect-[4/3] bg-ornate-cream overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.images[0]?.alt || item.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="font-display text-[11px] uppercase tracking-wider text-ornate-darkgold mb-1">
                          {item.subcategoryName}
                        </p>
                        <h3 className="font-serif text-lg text-ornate-charcoal leading-snug mb-2">
                          {item.name}
                        </h3>
                      </div>
                      <div className="flex items-baseline gap-2 pt-2 border-t border-ornate-gold/15">
                        <span className="font-serif text-base font-semibold text-ornate-charcoal">
                          {formatINR(item.price)}
                        </span>
                        {item.mrp && (
                          <span className="text-xs text-ornate-charcoal/45 line-through">
                            {formatINR(item.mrp)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Mobile Native Product Page View */}
      <div className="md:hidden pb-20">
        {/* Image Stage */}
        <div className="bg-white border-b border-ornate-gold/15">
          <div className="relative aspect-[4/3] bg-ornate-cream overflow-hidden">
            <img
              src={activeImage.url}
              alt={activeImage.alt || product.name}
              className="w-full h-full object-cover"
            />
            {(product.dealActive || product.isFeatured) && (
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-sm bg-ornate-softblack/90 text-ornate-gold text-[10px] font-display uppercase tracking-wider">
                {product.dealActive
                  ? `Deal · ${product.savingsPercent}% Off`
                  : "Featured"}
              </span>
            )}
            <span
              className={`absolute top-3 right-3 px-2.5 py-1 rounded-sm text-[11px] font-medium ${
                product.inStock
                  ? "bg-white/95 text-emerald-800"
                  : "bg-white/95 text-rose-700"
              }`}
            >
              {product.inStock ? `${product.stockCount} in stock` : "Out of Stock"}
            </span>
          </div>

          {galleryImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-2.5">
              {galleryImages.map((img, idx) => (
                <button
                  key={img.id || img.url}
                  type="button"
                  onClick={() => setActiveImageIdx(idx)}
                  aria-label={`View image ${idx + 1}`}
                  className={`w-14 h-14 shrink-0 rounded-md overflow-hidden border ${
                    idx === activeImageIdx
                      ? "border-ornate-charcoal ring-1 ring-ornate-charcoal"
                      : "border-ornate-gold/25 opacity-75"
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

        <div className="px-4 pt-4 space-y-4">
          {/* Summary Card */}
          <div className="bg-white rounded-xl border border-ornate-gold/20 p-4 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between gap-2 text-[11px] font-display uppercase tracking-wider text-ornate-darkgold">
              <span className="truncate">{product.subcategoryName}</span>
              <span className="text-ornate-charcoal/55 shrink-0">{product.sku}</span>
            </div>

            <h1 className="font-serif text-2xl text-ornate-charcoal leading-snug">
              {product.name}
            </h1>
            <p className="text-xs font-medium text-ornate-charcoal/65">
              By {product.brand}
            </p>

            <div className="flex flex-wrap items-baseline gap-2.5 pt-1">
              <span className="font-serif text-2xl font-semibold text-ornate-charcoal">
                {formatINR(product.price)}
              </span>
              {product.mrp && (
                <span className="text-sm text-ornate-charcoal/45 line-through">
                  {formatINR(product.mrp)}
                </span>
              )}
              {product.savingsPercent > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-emerald-50 text-xs font-semibold text-emerald-800">
                  <Tag size={11} aria-hidden="true" />
                  {product.savingsPercent}% off
                </span>
              )}
            </div>

            {product.longDescription && (
              <p className="text-xs text-ornate-charcoal/80 leading-relaxed pt-2 border-t border-ornate-gold/10">
                {product.longDescription}
              </p>
            )}
          </div>

          {/* Specifications Card */}
          <div className="bg-white rounded-xl border border-ornate-gold/20 overflow-hidden shadow-sm">
            <div className="px-4 py-3 bg-ornate-cream/55 border-b border-ornate-gold/15 flex items-center gap-2">
              <Sparkles size={13} className="text-ornate-darkgold" aria-hidden="true" />
              <h2 className="font-display text-[11px] uppercase tracking-[0.15em] text-ornate-charcoal">
                Specifications
              </h2>
            </div>

            <dl className="divide-y divide-ornate-gold/10 text-xs">
              <div className="px-4 py-2.5 flex items-center justify-between gap-3">
                <dt className="text-ornate-charcoal/65">Brand</dt>
                <dd className="font-medium text-ornate-charcoal text-right">{product.brand}</dd>
              </div>
              <div className="px-4 py-2.5 flex items-center justify-between gap-3">
                <dt className="text-ornate-charcoal/65">Category</dt>
                <dd className="font-medium text-ornate-charcoal text-right">{product.subcategoryName}</dd>
              </div>
              {product.attributes.map((attr) => (
                <div
                  key={attr.key}
                  className="px-4 py-2.5 flex items-start justify-between gap-3"
                >
                  <dt className="text-ornate-charcoal/65 shrink-0">
                    {formatAttributeKey(attr.key)}
                  </dt>
                  <dd className="font-medium text-ornate-charcoal text-right">
                    {attr.value}
                  </dd>
                </div>
              ))}
              <div className="px-4 py-2.5 flex items-center justify-between gap-3">
                <dt className="text-ornate-charcoal/65">Availability</dt>
                <dd className="font-medium text-ornate-charcoal text-right">
                  {product.inStock
                    ? `In Stock (${product.stockCount} available)`
                    : "Out of Stock"}
                </dd>
              </div>
            </dl>
          </div>

          {/* Related Products Carousel */}
          {relatedProducts.length > 0 && (
            <section className="pt-2">
              <div className="flex items-center justify-between mb-2.5">
                <h2 className="font-serif text-lg text-ornate-charcoal">
                  Related Pieces
                </h2>
                <Link
                  to="/shop"
                  className="text-xs font-medium text-ornate-darkgold inline-flex items-center gap-1"
                >
                  Shop All <ArrowRight size={12} />
                </Link>
              </div>

              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 snap-x snap-mandatory">
                {relatedProducts.map((item) => (
                  <Link
                    key={item.id}
                    to={`/shop/${item.slug}`}
                    className="w-40 shrink-0 snap-start bg-white rounded-xl border border-ornate-gold/20 overflow-hidden shadow-sm"
                  >
                    <div className="h-28 bg-ornate-cream">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-2.5">
                      <p className="text-[10px] text-ornate-darkgold truncate">
                        {item.brand}
                      </p>
                      <h3 className="font-serif text-xs text-ornate-charcoal line-clamp-1 mt-0.5">
                        {item.name}
                      </h3>
                      <p className="text-xs font-semibold text-ornate-charcoal mt-1">
                        {formatINR(item.price)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sticky Mobile Enquiry Bar above MobileBottomNav */}
        <div className="fixed bottom-16 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-ornate-gold/20 px-4 py-2.5 flex items-center gap-2.5 shadow-[0_-4px_16px_rgba(26,24,22,0.06)]">
          <a
            href={STUDIO_INFO.phoneHref}
            aria-label="Call Ornate Studio"
            className="h-11 px-4 rounded-xl border border-ornate-gold/30 bg-ornate-offwhite text-ornate-charcoal text-xs font-medium inline-flex items-center justify-center gap-1.5 shrink-0"
          >
            <Phone size={15} className="text-ornate-darkgold" aria-hidden="true" />
            Call
          </a>
          <Link
            to={enquiryHref}
            className="flex-1 h-11 rounded-xl bg-ornate-charcoal text-white font-display text-xs uppercase tracking-[0.14em] inline-flex items-center justify-center gap-2"
          >
            Enquire at Studio
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
