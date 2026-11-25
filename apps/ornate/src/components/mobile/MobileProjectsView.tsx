import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface MobileProjectItem {
  title: string;
  category: "Residential" | "Commercial" | "Hospitality";
  scope: string;
  description: string;
  image: string;
}

const PROJECTS_DATA: MobileProjectItem[] = [
  {
    title: "Penthouse Living & Terrace Suite",
    category: "Residential",
    scope: "Full Interior & Custom Joinery",
    description:
      "Open-plan residence featuring custom walnut cabinetry, limewash walls, and continuous terrace flooring.",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=900&auto=format&fit=crop",
  },
  {
    title: "Urban Loft Conversion",
    category: "Residential",
    scope: "Space Planning & Finishes",
    description:
      "Reworked structural partitions to introduce daylight across kitchen, dining, and study zones.",
    image:
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?q=80&w=900&auto=format&fit=crop",
  },
  {
    title: "Neutral Apartment Sanctuary",
    category: "Residential",
    scope: "Modular Kitchen & Wardrobes",
    description:
      "Custom laminate and veneer storage designed for a three-bedroom apartment with concealed utility.",
    image:
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=900&auto=format&fit=crop",
  },
  {
    title: "Minimalist Gallery & Studio",
    category: "Commercial",
    scope: "Spatial Layout & Lighting",
    description:
      "Calibrated architectural track lighting and matte mineral surfaces designed without visual glare.",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=900&auto=format&fit=crop",
  },
  {
    title: "Executive Office & Boardroom",
    category: "Commercial",
    scope: "Turnkey Commercial Fit-Out",
    description:
      "Glazed meeting suite with acoustic wall panels, integrated power tables, and ergonomic bays.",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=900&auto=format&fit=crop",
  },
  {
    title: "Dining & Lounge Hospitality Fit-Out",
    category: "Hospitality",
    scope: "Turnkey Execution & Millwork",
    description:
      "Intimate dining room combining solid timber tables, upholstered banquette seating, and acoustic baffles.",
    image:
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=900&auto=format&fit=crop",
  },
  {
    title: "Boutique Guest Suite",
    category: "Hospitality",
    scope: "Bespoke Bedroom & Bath Styling",
    description:
      "Warm hospitality suite balancing custom headboard millwork, stone vanity counters, and accent lighting.",
    image:
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=900&auto=format&fit=crop",
  },
];

type CategoryFilter = "All" | "Residential" | "Commercial" | "Hospitality";

const CATEGORIES: CategoryFilter[] = [
  "All",
  "Residential",
  "Commercial",
  "Hospitality",
];

const MobileProjectsView: React.FC = () => {
  const [selected, setSelected] = useState<CategoryFilter>("All");

  const visibleProjects =
    selected === "All"
      ? PROJECTS_DATA
      : PROJECTS_DATA.filter((p) => p.category === selected);

  return (
    <div className="px-4 pt-3 pb-6 space-y-4">
      <div className="bg-white rounded-xl border border-ornate-gold/20 p-4 shadow-sm">
        <p className="text-[10px] font-display uppercase tracking-[0.18em] text-ornate-darkgold">
          Portfolio
        </p>
        <h2 className="font-serif text-xl text-ornate-charcoal mt-0.5">
          Completed &amp; Featured Spaces
        </h2>
        <p className="text-xs text-ornate-charcoal/70 mt-1 leading-relaxed">
          Residential apartments, villas, offices, and hospitality interiors in Bengaluru.
        </p>

        <div className="flex gap-2 overflow-x-auto no-scrollbar mt-3 py-1 px-0.5 -mx-0.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelected(cat)}
              className={`shrink-0 px-3.5 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                selected === cat
                  ? "bg-ornate-charcoal text-white border-ornate-charcoal"
                  : "bg-ornate-offwhite text-ornate-charcoal border-ornate-gold/25 hover:border-ornate-darkgold"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3.5">
        {visibleProjects.map((project) => (
          <article
            key={project.title}
            className="bg-white rounded-xl border border-ornate-gold/20 overflow-hidden shadow-sm"
          >
            <div className="relative aspect-[16/10] bg-ornate-cream">
              <img
                src={project.image}
                alt={project.title}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-sm bg-ornate-softblack/85 backdrop-blur-sm text-ornate-gold text-[10px] font-display uppercase tracking-wider">
                {project.category}
              </span>
            </div>
            <div className="p-4">
              <p className="text-[11px] text-ornate-darkgold font-medium">
                {project.scope}
              </p>
              <h3 className="font-serif text-lg text-ornate-charcoal mt-0.5">
                {project.title}
              </h3>
              <p className="text-xs text-ornate-charcoal/75 leading-relaxed mt-1.5">
                {project.description}
              </p>
              <Link
                to="/contact"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-ornate-charcoal"
              >
                Plan a Similar Space
                <ArrowRight size={13} className="text-ornate-darkgold" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default MobileProjectsView;
