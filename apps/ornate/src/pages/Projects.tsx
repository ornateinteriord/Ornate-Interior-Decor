import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageHeader from "@/components/ui-components/PageHeader";
import ProjectCard from "@/components/ui-components/ProjectCard";
import Seo from "@/components/seo/Seo";
import MobileProjectsView from "@/components/mobile/MobileProjectsView";

interface ShowcaseProject {
  title: string;
  category: "Residential" | "Commercial" | "Hospitality";
  scope: string;
  description: string;
  image: string;
  alt: string;
  link: string;
}

const featuredProjects: ShowcaseProject[] = [
  {
    title: "Penthouse Living & Terrace Suite",
    category: "Residential",
    scope: "Full Interior & Custom Joinery",
    description:
      "Open-plan residence featuring custom walnut cabinetry, limewash walls, and continuous flooring linking the lounge to the terrace.",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
    alt: "Open penthouse living space with large glazing and bespoke seating",
    link: "/contact",
  },
  {
    title: "Minimalist Gallery & Studio",
    category: "Commercial",
    scope: "Spatial Layout & Lighting",
    description:
      "Calibrated architectural track lighting and matte mineral surfaces designed to display objects without visual glare.",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200&auto=format&fit=crop",
    alt: "Gallery-inspired commercial room with clean architectural surfaces and warm pendant lamps",
    link: "/contact",
  },
  {
    title: "Dining & Lounge Hospitality Fit-Out",
    category: "Hospitality",
    scope: "Turnkey Execution & Millwork",
    description:
      "Intimate dining room combining solid timber tables, upholstered banquette seating, and acoustic ceiling baffles.",
    image:
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=1200&auto=format&fit=crop",
    alt: "Warm dining room interior with wood island, upholstered seating, and ambient lighting",
    link: "/contact",
  },
];

const allProjects: ShowcaseProject[] = [
  {
    title: "Urban Loft Conversion",
    category: "Residential",
    scope: "Space Planning & Finishes",
    description:
      "Reworked structural partitions to introduce daylight across the kitchen, dining, and study zones.",
    image:
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?q=80&w=1200&auto=format&fit=crop",
    alt: "Contemporary loft living area with wide windows and uncluttered geometry",
    link: "/contact",
  },
  {
    title: "Neutral Apartment Sanctuary",
    category: "Residential",
    scope: "Modular Kitchen & Wardrobes",
    description:
      "Custom laminate and veneer storage designed for a three-bedroom apartment with concealed utility zoning.",
    image:
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=1200&auto=format&fit=crop",
    alt: "Bright apartment living room with light timber cabinetry and soft upholstery",
    link: "/contact",
  },
  {
    title: "Quiet Study & Reading Suite",
    category: "Residential",
    scope: "Custom Furniture & Lighting",
    description:
      "Tailored floor-to-ceiling shelving paired with warm task lighting and natural linen window treatments.",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop",
    alt: "Sunlit reading corner with upholstered lounge chair and side table",
    link: "/contact",
  },
  {
    title: "Executive Office & Boardroom",
    category: "Commercial",
    scope: "Turnkey Commercial Fit-Out",
    description:
      "Glazed meeting suite with acoustic wall panels, integrated power tables, and ergonomic workstation bays.",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
    alt: "Contemporary office boardroom with glass partitions and natural light",
    link: "/contact",
  },
  {
    title: "Private Workspace Suite",
    category: "Commercial",
    scope: "Space Planning & Furniture",
    description:
      "Compact studio layout organizing reception, client presentation table, and material library storage.",
    image:
      "https://images.unsplash.com/photo-1594732832278-abd644401426?q=80&w=1200&auto=format&fit=crop",
    alt: "Focused workspace interior with large windows and clean architectural lines",
    link: "/contact",
  },
  {
    title: "Boutique Guest Suite",
    category: "Hospitality",
    scope: "Bespoke Bedroom & Bath Styling",
    description:
      "Warm hospitality suite balancing custom headboard millwork, stone vanity counters, and dimmed accent lighting.",
    image:
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200&auto=format&fit=crop",
    alt: "Hospitality bedroom suite with warm lighting and custom headboard joinery",
    link: "/contact",
  },
];

type FilterCategory = "All" | "Residential" | "Commercial" | "Hospitality";

const HASH_TO_CATEGORY: Record<string, FilterCategory> = {
  "#residential": "Residential",
  "#commercial": "Commercial",
  "#hospitality": "Hospitality",
};

const Projects = () => {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState<FilterCategory>(
    () => HASH_TO_CATEGORY[location.hash.toLowerCase()] ?? "All"
  );

  useEffect(() => {
    const matched = HASH_TO_CATEGORY[location.hash.toLowerCase()];
    if (matched) {
      setActiveCategory(matched);
    }
  }, [location.hash]);

  const categories: FilterCategory[] = [
    "All",
    "Residential",
    "Commercial",
    "Hospitality",
  ];

  const categoryCounts: Record<FilterCategory, number> = {
    All: allProjects.length,
    Residential: allProjects.filter((p) => p.category === "Residential").length,
    Commercial: allProjects.filter((p) => p.category === "Commercial").length,
    Hospitality: allProjects.filter((p) => p.category === "Hospitality").length,
  };

  const filteredProjects =
    activeCategory === "All"
      ? allProjects
      : allProjects.filter((project) => project.category === activeCategory);

  const leadProject = featuredProjects[0];
  const secondaryFeatured = featuredProjects.slice(1);

  return (
    <div className="bg-ornate-offwhite min-h-screen">
      <Seo
        title="Projects & Portfolio"
        description="Explore residential, commercial, and hospitality interior design projects by Ornate Interior Decor in Bengaluru."
        path="/projects"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" },
        ]}
      />

      <div className="md:hidden">
        <MobileProjectsView />
      </div>

      <div className="hidden md:block">
        <PageHeader
          subtitle="Our Portfolio"
          title="Selected Spaces &amp; Interiors"
          description="A curated showcase of residential apartments, independent homes, workspaces, and hospitality interiors delivered in Bengaluru."
          breadcrumbs={[
            { name: "Home", path: "/" },
            { name: "Projects", path: "/projects" },
          ]}
          aside={
            <div className="flex items-center gap-6 px-5 py-3.5 bg-white border border-ornate-border rounded-2xl shadow-xs">
              <div>
                <p className="font-serif text-2xl text-ornate-charcoal leading-none price-nums">
                  {featuredProjects.length + allProjects.length}
                </p>
                <p className="text-xs font-semibold text-ornate-darkgold mt-1">
                  Curated Works
                </p>
              </div>
              <div className="h-8 w-px bg-ornate-border" aria-hidden="true" />
              <div>
                <p className="font-serif text-2xl text-ornate-charcoal leading-none price-nums">
                  3
                </p>
                <p className="text-xs font-semibold text-ornate-darkgold mt-1">
                  Typologies
                </p>
              </div>
            </div>
          }
        />

        <section id="featured" className="py-16 md:py-20 bg-white">
          <div className="ornate-container">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <span className="ornate-pill-label mb-2">Featured Work</span>
                <h2 className="ornate-title">Signature Spaces</h2>
              </div>
              <p className="text-ornate-muted text-sm md:text-base max-w-md leading-relaxed">
                Projects built around measured floor plans, custom millwork, and coordinated architectural lighting.
              </p>
            </div>

            {/* Lead Spotlight Card */}
            <article className="grid grid-cols-1 lg:grid-cols-12 bg-ornate-offwhite border border-ornate-border rounded-2xl overflow-hidden shadow-sm mb-8 group">
              <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto lg:min-h-[380px] overflow-hidden bg-ornate-cream">
                <img
                  src={leadProject.image}
                  alt={leadProject.alt}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-ornate-softblack/85 backdrop-blur-sm text-ornate-gold text-xs font-semibold">
                  Featured · {leadProject.category}
                </span>
              </div>
              <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-ornate-darkgold mb-3">
                    {leadProject.scope}
                  </p>
                  <h3 className="font-serif text-2xl lg:text-3xl text-ornate-charcoal mb-4 leading-snug">
                    {leadProject.title}
                  </h3>
                  <p className="text-ornate-muted leading-relaxed mb-6">
                    {leadProject.description}
                  </p>
                </div>
                <div>
                  <Link
                    to={leadProject.link}
                    className="ornate-btn-primary inline-flex items-center group/btn"
                  >
                    Discuss a Similar Residence
                    <ArrowRight
                      size={15}
                      className="ml-2 transition-transform group-hover/btn:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </div>
            </article>

            {/* Two Balanced Featured Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {secondaryFeatured.map((project) => (
                <ProjectCard
                  key={project.title}
                  title={project.title}
                  category={project.category}
                  scope={project.scope}
                  description={project.description}
                  image={project.image}
                  alt={project.alt}
                  link={project.link}
                  variant="overlay"
                />
              ))}
            </div>
          </div>
        </section>

        <section id="residential" className="py-16 md:py-20 bg-ornate-offwhite border-t border-ornate-border">
          <div id="commercial" />
          <div id="hospitality" />
          <div className="ornate-container">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
              <div>
                <span className="ornate-pill-label mb-2">Complete Index</span>
                <h2 className="ornate-title mb-2">Browse by Space Type</h2>
                <p className="text-ornate-muted leading-relaxed">
                  Filter completed projects across residential, commercial, and hospitality typologies.
                </p>
              </div>

              <div
                className="flex flex-wrap gap-2"
                role="tablist"
                aria-label="Filter projects by category"
              >
                {categories.map((category) => {
                  const isSelected = activeCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => setActiveCategory(category)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                        isSelected
                          ? "bg-ornate-moss text-white border-ornate-moss shadow-xs"
                          : "bg-white text-ornate-charcoal border-ornate-border hover:border-ornate-moss"
                      }`}
                    >
                      {category} ({categoryCounts[category]})
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              role="tabpanel"
            >
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.title}
                  title={project.title}
                  category={project.category}
                  scope={project.scope}
                  description={project.description}
                  image={project.image}
                  alt={project.alt}
                  link={project.link}
                  variant="editorial"
                />
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-ornate-moss text-white">
          <div className="ornate-container">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-ornate-gold text-xs font-semibold mb-3">
                Start Your Project
              </span>
              <h2 className="text-3xl md:text-5xl font-serif mb-5">
                Planning a Renovation or New Interior?
              </h2>
              <p className="text-white/80 leading-relaxed mb-8">
                Share your property dimensions, timeline, and goals with our Vijayanagar studio team.
              </p>
              <Link
                to="/contact"
                className="ornate-btn-accent inline-flex items-center"
              >
                Schedule a Consultation
                <ArrowRight size={16} className="ml-2" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Projects;
