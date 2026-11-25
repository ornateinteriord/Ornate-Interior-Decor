import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  Home,
  LayoutDashboard,
  Palette,
  Ruler,
  Sofa,
} from "lucide-react";

const SPACE_TYPES = [
  {
    title: "Living & Dining Rooms",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800&auto=format&fit=crop",
    description:
      "Balanced seating layouts, media consoles, acoustic wall treatments, and ambient lighting.",
  },
  {
    title: "Kitchens & Storage",
    image:
      "https://images.unsplash.com/photo-1616137466211-f939a420be84?q=80&w=800&auto=format&fit=crop",
    description:
      "Ergonomic modular and custom kitchens built with moisture-resistant boards and stone counters.",
  },
  {
    title: "Bedrooms & Wardrobes",
    image:
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=800&auto=format&fit=crop",
    description:
      "Restful sleeping quarters with full-height wardrobes, dressing counters, and warm lighting.",
  },
  {
    title: "Offices & Commercial",
    image:
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=800&auto=format&fit=crop",
    description:
      "Productive client-facing offices and studios designed for acoustic clarity and durable wear.",
  },
];

const SERVICE_LIST = [
  {
    title: "Residential Design",
    description:
      "Full-home and apartment interiors covering living spaces, kitchens, wardrobes, and finishes.",
    icon: Home,
  },
  {
    title: "Commercial Design",
    description:
      "Workplaces, studios, and hospitality interiors planned for acoustic comfort and durability.",
    icon: Building2,
  },
  {
    title: "Space Planning",
    description:
      "Measured 2D furniture layouts, electrical mapping, and circulation optimization.",
    icon: LayoutDashboard,
  },
  {
    title: "Custom Furniture & Millwork",
    description:
      "Made-to-measure cabinetry, modular kitchens, and loose furniture detailed to your room.",
    icon: Sofa,
  },
  {
    title: "Material & Color Curation",
    description:
      "Coordinated palettes across veneers, laminates, stone, upholstery, and wall finishes.",
    icon: Palette,
  },
  {
    title: "Turnkey Execution",
    description:
      "On-site coordination with civil, electrical, carpentry, and painting trades through completion.",
    icon: Ruler,
  },
];

const MobileServicesView: React.FC = () => {
  return (
    <div className="pt-3 pb-6 space-y-6">
      <div className="px-4">
        <div className="bg-ornate-charcoal text-white rounded-xl p-5">
          <p className="text-[10px] font-display uppercase tracking-widest text-ornate-gold">
            Design &amp; Build
          </p>
          <h2 className="font-serif text-xl mt-1">
            Comprehensive Interior Services
          </h2>
          <p className="text-xs text-white/75 mt-1.5 leading-relaxed">
            Commission a complete turnkey fit-out or tailored space planning and custom furniture.
          </p>
          <div className="mt-4 flex gap-2.5">
            <Link
              to="/contact"
              className="px-4 py-2 rounded-lg bg-ornate-gold text-ornate-softblack text-xs font-semibold inline-flex items-center gap-1.5"
            >
              Book Consultation
              <ArrowRight size={13} />
            </Link>
            <Link
              to="/shop"
              className="px-4 py-2 rounded-lg bg-white/15 text-white text-xs font-medium"
            >
              Shop Furniture
            </Link>
          </div>
        </div>
      </div>

      {/* Horizontal Space Specialties */}
      <section>
        <div className="px-4 mb-3">
          <p className="text-[10px] font-display uppercase tracking-widest text-ornate-darkgold">
            Specialties
          </p>
          <h2 className="font-serif text-xl text-ornate-charcoal">
            Spaces We Design
          </h2>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 snap-x snap-mandatory">
          {SPACE_TYPES.map((item) => (
            <article
              key={item.title}
              className="w-64 shrink-0 snap-start bg-white rounded-2xl border border-ornate-gold/15 overflow-hidden shadow-sm"
            >
              <div className="h-36 bg-ornate-cream">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3.5">
                <h3 className="font-serif text-base text-ornate-charcoal">
                  {item.title}
                </h3>
                <p className="text-xs text-ornate-charcoal/70 mt-1 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Grouped Service List Cards */}
      <section className="px-4 space-y-3">
        <div>
          <p className="text-[10px] font-display uppercase tracking-widest text-ornate-darkgold">
            Scope of Work
          </p>
          <h2 className="font-serif text-xl text-ornate-charcoal">
            Core Capabilities
          </h2>
        </div>

        <div className="bg-white rounded-xl border border-ornate-gold/20 divide-y divide-ornate-gold/10 overflow-hidden shadow-sm">
          {SERVICE_LIST.map((service) => {
            const Icon = service.icon;
            return (
              <div key={service.title} className="p-4 flex items-start gap-3.5">
                <span className="w-10 h-10 rounded-lg bg-ornate-cream flex items-center justify-center text-ornate-darkgold shrink-0">
                  <Icon size={20} />
                </span>
                <div>
                  <h3 className="font-serif text-base text-ornate-charcoal">
                    {service.title}
                  </h3>
                  <p className="text-xs text-ornate-charcoal/70 mt-1 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default MobileServicesView;
