import React from "react";
import { Link } from "react-router-dom";
import {
  Archive,
  Armchair,
  ArrowRight,
  BedDouble,
  Briefcase,
  type LucideIcon,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  ShoppingBag,
  Sofa,
  Sparkles,
  Sun,
  UtensilsCrossed,
} from "lucide-react";
import { useFurnitureCatalog } from "@/hooks/useFurnitureCatalog";
import { formatINR } from "@/lib/furnitureFilters";
import { STUDIO_INFO } from "@/lib/seo";
import { useGlobalSearch } from "@/context/SearchContext";
import { useCart } from "@/context/CartContext";

const SUBCATEGORY_ICONS: Record<string, LucideIcon> = {
  "bedroom-furniture": BedDouble,
  "dining-room-furniture": UtensilsCrossed,
  "living-room-furniture": Armchair,
  "office-furniture": Briefcase,
  "outdoor-furniture": Sun,
  "storage-furniture": Archive,
};

const QUICK_SERVICES = [
  {
    title: "Residential Design",
    caption: "Full-home & apartment interiors",
  },
  {
    title: "Custom Millwork",
    caption: "Made-to-measure cabinetry",
  },
  {
    title: "Space Planning",
    caption: "Measured 2D layouts & light",
  },
  {
    title: "Turnkey Execution",
    caption: "End-to-end site handover",
  },
];

const FEATURED_SPACES = [
  {
    title: "Penthouse Living & Terrace",
    tag: "Residential",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Neutral Apartment Sanctuary",
    tag: "Residential",
    image:
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Executive Office Suite",
    tag: "Commercial",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
  },
];

const MobileHomeView: React.FC = () => {
  const { data, isLoading } = useFurnitureCatalog();
  const { openSearch } = useGlobalSearch();
  const { addToCart } = useCart();

  const subcategories = data?.subcategories ?? [];
  const featuredProducts = (data?.products ?? []).slice(0, 6);

  return (
    <div className="space-y-6 pb-8 bg-ornate-offwhite">
      {/* Instant Search Bar Trigger */}
      <div className="px-4 pt-3">
        <button
          type="button"
          onClick={openSearch}
          className="w-full h-11 px-3.5 rounded-2xl bg-white border border-ornate-border shadow-xs flex items-center gap-2.5 text-left"
        >
          <Search size={17} className="text-ornate-moss shrink-0" />
          <span className="text-sm text-ornate-muted truncate">
            Search furniture, rooms, or studio services...
          </span>
        </button>
      </div>

      {/* Hero Showcase Card */}
      <section className="px-4">
        <div className="relative rounded-3xl overflow-hidden min-h-[260px] shadow-md bg-ornate-softblack">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop"
            alt="Ornate Interior Decor living room showcase"
            className="absolute inset-0 w-full h-full object-cover opacity-70"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-ornate-softblack via-ornate-softblack/55 to-ornate-moss/40"
            aria-hidden="true"
          />
          <div className="relative z-10 p-5 flex flex-col justify-between min-h-[260px]">
            <span className="self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-ornate-gold text-xs font-semibold">
              <Sparkles size={12} aria-hidden="true" />
              Bengaluru Studio &amp; Store
            </span>

            <div>
              <h2 className="font-serif text-2xl text-white leading-tight mb-1.5">
                Architectural Interiors &amp;{" "}
                <span className="italic text-ornate-gold font-normal">
                  Crafted Furniture
                </span>
              </h2>
              <p className="text-white/80 text-xs leading-relaxed mb-4 line-clamp-2">
                Shop solid-wood furniture online or book a turnkey interior consultation.
              </p>

              <div className="flex items-center gap-2.5">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-ornate-gold text-ornate-softblack text-xs font-semibold shadow-sm active:scale-95 transition-transform"
                >
                  <ShoppingBag size={14} aria-hidden="true" />
                  Shop Store
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/15 border border-white/25 backdrop-blur-md text-white text-xs font-semibold active:scale-95 transition-transform"
                >
                  Services
                  <ArrowRight size={13} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Subcategories from API */}
      {(isLoading || subcategories.length > 0) && (
        <section className="px-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-semibold text-ornate-darkgold">
                Browse by Room
              </p>
              <h2 className="font-serif text-xl text-ornate-charcoal">
                Furniture Collections
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-xs font-semibold text-ornate-moss inline-flex items-center gap-1"
            >
              See all <ArrowRight size={13} />
            </Link>
          </div>

          {isLoading ? (
            <div className="h-20 rounded-2xl bg-white border border-ornate-border animate-pulse" />
          ) : (
            <div
              className={
                subcategories.length === 1
                  ? "grid grid-cols-1 gap-2.5"
                  : subcategories.length === 2
                  ? "grid grid-cols-2 gap-2.5"
                  : "grid grid-cols-3 gap-2.5"
              }
            >
              {subcategories.map((sub) => {
                const Icon = SUBCATEGORY_ICONS[sub.slug] ?? Sofa;
                return (
                  <Link
                    key={sub.slug}
                    to={`/shop?category=${sub.slug}`}
                    className={`bg-white rounded-2xl border border-ornate-border p-3.5 shadow-xs active:scale-[0.98] transition-transform ${
                      subcategories.length === 1
                        ? "flex items-center justify-between"
                        : "flex flex-col items-center text-center gap-2"
                    }`}
                  >
                    <span className="w-10 h-10 rounded-xl bg-ornate-sage flex items-center justify-center text-ornate-moss shrink-0">
                      <Icon size={19} />
                    </span>
                    <span className="text-xs font-semibold text-ornate-charcoal leading-tight">
                      {sub.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Curated Furniture Horizontal Carousel */}
      <section>
        <div className="px-4 flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-semibold text-ornate-darkgold">
              Store Catalog
            </p>
            <h2 className="font-serif text-xl text-ornate-charcoal">
              Signature Furniture
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-semibold text-ornate-moss inline-flex items-center gap-1"
          >
            Shop All <ArrowRight size={13} />
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 snap-x snap-mandatory">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="w-48 shrink-0 snap-start bg-white rounded-2xl border border-ornate-border overflow-hidden animate-pulse"
                >
                  <div className="h-36 bg-ornate-cream" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 w-20 bg-ornate-cream rounded" />
                    <div className="h-4 w-full bg-ornate-cream rounded" />
                  </div>
                </div>
              ))
            : featuredProducts.map((item) => (
                <div
                  key={item.id}
                  className="w-48 shrink-0 snap-start bg-white rounded-2xl border border-ornate-border overflow-hidden shadow-xs flex flex-col justify-between"
                >
                  <Link to={`/shop/${item.slug}`} className="block">
                    <div className="h-36 bg-ornate-cream overflow-hidden relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                      {item.dealActive && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-ornate-moss text-white text-[10px] font-semibold">
                          {item.savingsPercent}% OFF
                        </span>
                      )}
                    </div>
                    <div className="p-3 pb-1.5">
                      <p className="text-[11px] font-medium text-ornate-darkgold truncate">
                        {item.brand}
                      </p>
                      <h3 className="font-sans text-sm font-semibold text-ornate-charcoal line-clamp-1 mt-0.5">
                        {item.name}
                      </h3>
                    </div>
                  </Link>
                  <div className="px-3 pb-3 pt-1 flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-ornate-charcoal price-nums">
                      {formatINR(item.price)}
                    </span>
                    <button
                      type="button"
                      disabled={!item.inStock}
                      onClick={() => void addToCart(item, 1, true)}
                      aria-label={`Add ${item.name} to cart`}
                      className="h-8 px-2.5 rounded-full bg-ornate-moss text-white text-xs font-semibold inline-flex items-center gap-1 disabled:opacity-45"
                    >
                      <Plus size={12} /> Add
                    </button>
                  </div>
                </div>
              ))}
        </div>
      </section>

      {/* Services Deep Moss Contrast Block */}
      <section className="px-4">
        <div className="bg-ornate-moss text-white rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-ornate-gold">
                Turnkey Studio
              </p>
              <h2 className="font-serif text-xl text-white">
                Interior Design Services
              </h2>
            </div>
            <Link
              to="/services"
              className="text-xs font-semibold text-ornate-gold inline-flex items-center gap-1"
            >
              Details <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {QUICK_SERVICES.map((svc) => (
              <Link
                key={svc.title}
                to="/services"
                className="rounded-2xl bg-white/10 border border-white/15 p-3.5 active:scale-[0.98] transition-transform"
              >
                <h3 className="font-serif text-sm text-white mb-0.5">
                  {svc.title}
                </h3>
                <p className="text-xs text-white/75 leading-snug">
                  {svc.caption}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Spaces Carousel */}
      <section>
        <div className="px-4 flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-semibold text-ornate-darkgold">
              Portfolio
            </p>
            <h2 className="font-serif text-xl text-ornate-charcoal">
              Featured Spaces
            </h2>
          </div>
          <Link
            to="/projects"
            className="text-xs font-semibold text-ornate-moss inline-flex items-center gap-1"
          >
            All Projects <ArrowRight size={13} />
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 snap-x snap-mandatory">
          {FEATURED_SPACES.map((space) => (
            <Link
              key={space.title}
              to="/projects"
              className="w-64 shrink-0 snap-start rounded-2xl overflow-hidden relative h-40 shadow-sm"
            >
              <img
                src={space.image}
                alt={space.title}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-3 left-3.5 right-3.5">
                <span className="inline-block px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-sm text-[11px] font-semibold text-ornate-gold mb-1">
                  {space.tag}
                </span>
                <h3 className="font-serif text-base text-white leading-snug">
                  {space.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Studio Visit Card */}
      <section className="px-4">
        <div className="bg-ornate-cream border border-ornate-border rounded-3xl p-5 space-y-4">
          <div>
            <p className="text-xs font-semibold text-ornate-darkgold">
              Visit Vijayanagar Studio
            </p>
            <h2 className="font-serif text-xl text-ornate-charcoal mt-0.5">
              Discuss Your Upcoming Space
            </h2>
            <p className="text-xs text-ornate-muted mt-1.5 flex items-start gap-1.5 leading-relaxed">
              <MapPin size={14} className="text-ornate-moss shrink-0 mt-0.5" />
              148/E, 17th Main Rd, SBI Staff Colony, Vijayanagar, Bengaluru 560040
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <a
              href={STUDIO_INFO.phoneHref}
              className="h-11 rounded-full bg-ornate-moss text-white text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <Phone size={14} />
              Call Studio
            </a>
            <Link
              to="/contact"
              className="h-11 rounded-full bg-white border border-ornate-border text-ornate-charcoal text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <Mail size={14} className="text-ornate-darkgold" />
              Book Visit
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MobileHomeView;
