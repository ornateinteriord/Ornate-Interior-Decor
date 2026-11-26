import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Compass,
  FolderKanban,
  Search,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { useGlobalSearch } from "@/context/SearchContext";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2400&auto=format&fit=crop";

const QUICK_PATH_CARDS = [
  {
    badge: "E-Commerce Store",
    title: "Shop Ready & Crafted Furniture",
    caption: "Filter by room, brand, and budget with online Razorpay checkout.",
    to: "/shop",
    icon: ShoppingBag,
  },
  {
    badge: "Interior Architecture",
    title: "Commission Turnkey Interiors",
    caption: "Residential & commercial planning, millwork, and site handover.",
    to: "/services",
    icon: Sparkles,
  },
  {
    badge: "Portfolio",
    title: "Browse Completed Bengaluru Spaces",
    caption: "Apartments, villas, offices, and hospitality interiors.",
    to: "/projects",
    icon: FolderKanban,
  },
];

const HomeHero: React.FC = () => {
  const { openSearch } = useGlobalSearch();

  return (
    <section className="relative min-h-[88vh] flex items-center bg-ornate-softblack overflow-hidden pt-28 pb-16">
      <img
        src={HERO_IMAGE}
        alt="Warm architectural living space designed by Ornate Interior Decor"
        className="absolute inset-0 w-full h-full object-cover opacity-55"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-ornate-softblack/95 via-ornate-softblack/80 to-ornate-moss/70"
        aria-hidden="true"
      />

      <div className="ornate-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Editorial Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-ornate-gold">
              <Compass size={14} aria-hidden="true" />
              <span>Vijayanagar, Bengaluru · Interior Studio &amp; Furniture Store</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl xl:text-[3.5rem] text-white leading-[1.08] tracking-tight">
              Thoughtful Spaces &amp;{" "}
              <span className="italic text-ornate-gold font-normal">
                Crafted Furniture
              </span>{" "}
              Built for Daily Living
            </h1>

            <p className="text-white/80 text-base md:text-lg max-w-2xl leading-relaxed">
              Shop curated architectural furniture online or partner with our Bengaluru studio for measured floor plans, custom millwork, and turnkey interior execution.
            </p>

            {/* Instant Search Bar Trigger */}
            <div className="max-w-xl">
              <button
                type="button"
                onClick={openSearch}
                className="w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl bg-white/95 hover:bg-white text-left shadow-xl transition-all group"
              >
                <span className="flex items-center gap-3 text-sm text-ornate-muted group-hover:text-ornate-charcoal">
                  <Search size={18} className="text-ornate-moss shrink-0" />
                  <span>
                    Search sofas, dining tables, office desks, or studio services...
                  </span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-lg bg-ornate-offwhite border border-ornate-border text-xs font-mono text-ornate-muted shrink-0">
                  ⌘K
                </span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <Link to="/shop" className="ornate-btn-accent gap-2 group">
                <ShoppingBag size={16} aria-hidden="true" />
                <span>Shop Furniture</span>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                />
              </Link>
              <Link
                to="/contact"
                className="ornate-btn border border-white/35 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-ornate-softblack"
              >
                Book Free Consultation
              </Link>
            </div>
          </div>

          {/* Right Quick-Start Navigator Cards */}
          <div className="lg:col-span-5 space-y-3.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/70 pl-1">
              How can we help you today?
            </p>
            {QUICK_PATH_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.to}
                  to={card.to}
                  className="block p-5 rounded-2xl bg-white/10 hover:bg-white/18 backdrop-blur-md border border-white/15 hover:border-ornate-gold/60 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <span className="w-11 h-11 rounded-xl bg-ornate-gold/20 border border-ornate-gold/30 flex items-center justify-center text-ornate-gold shrink-0">
                      <Icon size={20} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-ornate-gold">
                        {card.badge}
                      </span>
                      <h2 className="font-serif text-lg text-white mt-0.5 flex items-center justify-between gap-2">
                        <span>{card.title}</span>
                        <ArrowRight
                          size={16}
                          className="text-ornate-gold shrink-0 group-hover:translate-x-1 transition-transform"
                        />
                      </h2>
                      <p className="text-xs text-white/75 mt-1 leading-relaxed">
                        {card.caption}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
