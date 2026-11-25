import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageHeader from "@/components/ui-components/PageHeader";
import ServicesSection from "@/components/sections/ServicesSection";
import Seo from "@/components/seo/Seo";
import MobileServicesView from "@/components/mobile/MobileServicesView";

const roomCategories = [
  {
    id: "residential-design",
    url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200&auto=format&fit=crop",
    title: "Living & Dining Rooms",
    alt: "Living room interior with custom sofa seating, warm wood paneling, and natural light",
    description:
      "Balanced seating layouts, media consoles, acoustic wall treatments, and ambient lighting for daily gatherings.",
  },
  {
    id: "custom-furniture",
    url: "https://images.unsplash.com/photo-1616137466211-f939a420be84?q=80&w=1200&auto=format&fit=crop",
    title: "Kitchens & Storage Cabinetry",
    alt: "Modern kitchen interior with tailored cabinetry, quartz countertops, and task lighting",
    description:
      "Ergonomic modular and custom kitchens built with moisture-resistant boards, stone counters, and soft-close hardware.",
  },
  {
    id: "color-consultation",
    url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200&auto=format&fit=crop",
    title: "Bedrooms & Wardrobes",
    alt: "Calm bedroom suite with upholstered headboard, neutral textiles, and built-in storage",
    description:
      "Restful sleeping quarters with full-height wardrobes, dressing counters, and warm layered bedside lighting.",
  },
  {
    id: "commercial-design",
    url: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=1200&auto=format&fit=crop",
    title: "Offices & Commercial Suites",
    alt: "Structured office interior with timber desk, clean lighting, and organized storage",
    description:
      "Productive client-facing offices, studios, and reception spaces designed for acoustic clarity and durable wear.",
  },
];

const Service = () => {
  return (
    <div className="bg-ornate-offwhite">
      <Seo
        title="Interior Design Services"
        description="Residential design, commercial interiors, space planning, custom furniture, material curation, and turnkey execution in Bengaluru."
        path="/services"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ]}
      />

      <div className="md:hidden">
        <MobileServicesView />
      </div>

      <div className="hidden md:block">
        <PageHeader
          title="Interior Design Services"
          subtitle="What We Deliver"
          description="Comprehensive planning, custom millwork, material curation, and turnkey site execution for homes and commercial spaces."
          breadcrumbs={[
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]}
        />

      <section className="py-20 bg-white">
        <div className="ornate-container">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p className="ornate-subtitle mb-3">Specialties</p>
            <h2 className="ornate-title mb-5">Spaces We Design</h2>
            <p className="text-ornate-charcoal/80 leading-relaxed">
              From single-room transformations to full-property turnkey fit-outs, each space is detailed for everyday comfort and lasting build quality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {roomCategories.map((item) => (
              <article
                id={item.id}
                key={item.id}
                className="relative overflow-hidden rounded-sm shadow-sm group bg-ornate-charcoal"
              >
                <img
                  src={item.url}
                  alt={item.alt}
                  loading="lazy"
                  className="w-full h-[320px] object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"
                  aria-hidden="true"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <h3 className="text-2xl font-serif mb-2 text-white">
                    {item.title}
                  </h3>
                  <p className="text-white/85 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div id="space-planning" />
      <div id="project-management" />
      <ServicesSection />

      <section className="py-16 bg-ornate-charcoal text-white">
        <div className="ornate-container flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <p className="font-display text-xs uppercase tracking-widest text-ornate-gold mb-2">
              Start With a Floor Plan
            </p>
            <h2 className="font-serif text-3xl text-white">
              Need an estimate for your apartment or commercial unit?
            </h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/contact"
              className="ornate-btn bg-ornate-gold text-ornate-softblack hover:bg-white inline-flex items-center font-medium"
            >
              Request Consultation
              <ArrowRight size={16} className="ml-2" aria-hidden="true" />
            </Link>
            <Link
              to="/projects"
              className="ornate-btn border border-white/40 text-white hover:bg-white hover:text-ornate-charcoal"
            >
              Browse Portfolio
            </Link>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
};

export default Service;