import React from "react";
import { Link } from "react-router-dom";
import {
  Archive,
  Armchair,
  ArrowRight,
  BedDouble,
  Briefcase,
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
  Sofa,
  Sparkles,
  Sun,
  UtensilsCrossed,
} from "lucide-react";
import { useFurnitureCatalog } from "@/hooks/useFurnitureCatalog";
import { formatINR } from "@/lib/furnitureFilters";
import { STUDIO_INFO } from "@/lib/seo";

const SUBCATEGORY_ICONS: Record<
  string,
  React.FC<{ size?: number; className?: string }>
> = {
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
    title: "Custom Furniture",
    caption: "Made-to-measure cabinetry & pieces",
  },
  {
    title: "Space Planning",
    caption: "Measured 2D layouts & lighting",
  },
  {
    title: "Turnkey Execution",
    caption: "End-to-end site supervision",
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
  const subcategories = data?.subcategories ?? [];
  const featuredProducts = (data?.products ?? []).slice(0, 6);

  return (
    <div className="space-y-6 pb-6">
      {/* Native Welcome Banner Card */}
      <section className="px-4 pt-3">
        <div className="relative rounded-3xl overflow-hidden h-64 shadow-md bg-ornate-charcoal">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop"
            alt="Ornate Interior Decor living room showcase"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20"
            aria-hidden="true"
          />
          <div className="absolute inset-0 p-5 flex flex-col justify-between">
            <span className="self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-ornate-gold text-[10px] font-display uppercase tracking-widest">
              <Sparkles size={11} aria-hidden="true" />
              Furnitures &amp; Interiors
            </span>

            <div>
              <h2 className="font-serif text-2xl text-white leading-tight mb-1.5">
                Architectural Interiors &amp; Curated Furniture
              </h2>
              <p className="text-white/80 text-xs leading-relaxed mb-4 line-clamp-2">
                Shop crafted furniture collections or commission bespoke Bengaluru interiors.
              </p>

              <div className="flex items-center gap-2.5">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-ornate-gold text-ornate-softblack text-xs font-semibold shadow-sm active:scale-95 transition-transform"
                >
                  <ShoppingBag size={14} aria-hidden="true" />
                  Shop Now
                </Link>
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium active:scale-95 transition-transform"
                >
                  Projects
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
              <p className="text-[10px] font-display uppercase tracking-widest text-ornate-darkgold">
                Category · Furnitures
              </p>
              <h2 className="font-serif text-xl text-ornate-charcoal">
                Shop Collections
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-xs font-medium text-ornate-darkgold inline-flex items-center gap-1"
            >
              All <ArrowRight size={13} />
            </Link>
          </div>

          {isLoading ? (
            <div className="h-20 rounded-2xl bg-white border border-ornate-gold/15 animate-pulse" />
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
                    className={`bg-white rounded-2xl border border-ornate-gold/15 p-3.5 shadow-sm active:scale-[0.98] transition-transform ${
                      subcategories.length === 1
                        ? "flex items-center justify-between"
                        : "flex flex-col items-center text-center gap-2"
                    }`}
                  >
                    <div
                      className={
                        subcategories.length === 1
                          ? "flex items-center gap-3"
                          : "flex flex-col items-center gap-2"
                      }
                    >
                      <span className="w-10 h-10 rounded-xl bg-ornate-cream flex items-center justify-center text-ornate-darkgold shrink-0">
                        <Icon size={20} />
                      </span>
                      <span className="text-sm font-medium text-ornate-charcoal leading-tight">
                        {sub.name}
                      </span>
                    </div>
                    {subcategories.length === 1 && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-ornate-darkgold">
                        Explore <ArrowRight size={14} />
                      </span>
                    )}
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
            <p className="text-[10px] font-display uppercase tracking-widest text-ornate-darkgold">
              Store Catalog
            </p>
            <h2 className="font-serif text-xl text-ornate-charcoal">
              Signature Furniture
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-medium text-ornate-darkgold inline-flex items-center gap-1"
          >
            Shop All <ArrowRight size={13} />
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 snap-x snap-mandatory">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="w-44 shrink-0 snap-start bg-white rounded-2xl border border-ornate-gold/15 overflow-hidden animate-pulse"
                >
                  <div className="h-36 bg-ornate-cream" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 w-20 bg-ornate-cream rounded" />
                    <div className="h-4 w-full bg-ornate-cream rounded" />
                  </div>
                </div>
              ))
            : featuredProducts.map((item) => (
                <Link
                  key={item.id}
                  to={`/shop/${item.slug}`}
                  className="w-44 shrink-0 snap-start bg-white rounded-xl border border-ornate-gold/20 overflow-hidden shadow-sm active:scale-[0.98] transition-transform"
                >
                  <div className="h-36 bg-ornate-cream overflow-hidden relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    {item.dealActive && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-sm bg-ornate-softblack/90 text-ornate-gold text-[9px] font-display uppercase tracking-wider">
                        {item.savingsPercent}% OFF
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] text-ornate-darkgold truncate">
                      {item.brand}
                    </p>
                    <h3 className="font-serif text-sm text-ornate-charcoal line-clamp-1 mt-0.5">
                      {item.name}
                    </h3>
                    <div className="flex items-baseline gap-1.5 mt-1.5">
                      <span className="text-xs font-semibold text-ornate-charcoal">
                        {formatINR(item.price)}
                      </span>
                      {item.mrp && (
                        <span className="text-[10px] text-ornate-charcoal/45 line-through">
                          {formatINR(item.mrp)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </section>

      {/* Services Quick Strip */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[10px] font-display uppercase tracking-widest text-ornate-darkgold">
              Turnkey Studio
            </p>
            <h2 className="font-serif text-xl text-ornate-charcoal">
              Design Services
            </h2>
          </div>
          <Link
            to="/services"
            className="text-xs font-medium text-ornate-darkgold inline-flex items-center gap-1"
          >
            Details <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {QUICK_SERVICES.map((svc) => (
            <Link
              key={svc.title}
              to="/services"
              className="bg-white rounded-2xl border border-ornate-gold/15 p-3.5 shadow-sm active:scale-[0.98] transition-transform"
            >
              <h3 className="font-serif text-sm text-ornate-charcoal mb-1">
                {svc.title}
              </h3>
              <p className="text-[11px] text-ornate-charcoal/65 leading-snug">
                {svc.caption}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Spaces Carousel */}
      <section>
        <div className="px-4 flex items-center justify-between mb-3">
          <div>
            <p className="text-[10px] font-display uppercase tracking-widest text-ornate-darkgold">
              Portfolio
            </p>
            <h2 className="font-serif text-xl text-ornate-charcoal">
              Featured Spaces
            </h2>
          </div>
          <Link
            to="/projects"
            className="text-xs font-medium text-ornate-darkgold inline-flex items-center gap-1"
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <span className="text-[10px] font-display uppercase tracking-wider text-ornate-gold">
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

      {/* Studio Visit & Consultation Card */}
      <section className="px-4">
        <div className="bg-ornate-charcoal text-white rounded-3xl p-5 space-y-4">
          <div>
            <p className="text-[10px] font-display uppercase tracking-widest text-ornate-gold">
              Visit Vijayanagar Studio
            </p>
            <h2 className="font-serif text-xl mt-1">
              Discuss Your Upcoming Space
            </h2>
            <p className="text-xs text-white/75 mt-1.5 flex items-start gap-1.5 leading-relaxed">
              <MapPin size={14} className="text-ornate-gold shrink-0 mt-0.5" />
              148/E, 17th Main Rd, SBI Staff Colony, Vijayanagar, Bengaluru 560040
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <a
              href={STUDIO_INFO.phoneHref}
              className="h-11 rounded-2xl bg-ornate-gold text-ornate-softblack text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <Phone size={14} />
              Call Studio
            </a>
            <Link
              to="/contact"
              className="h-11 rounded-2xl bg-white/15 text-white text-xs font-medium flex items-center justify-center gap-1.5"
            >
              <Mail size={14} />
              Book Visit
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MobileHomeView;
