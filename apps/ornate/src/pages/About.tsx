import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Clock, PenTool, Users } from "lucide-react";
import PageHeader from "../components/ui-components/PageHeader";
import Seo from "../components/seo/Seo";
import { MobileAboutView } from "../components/mobile/MobileInfoViews";

const About = () => {
  const values = [
    {
      icon: <PenTool size={22} />,
      title: "Measured Design",
      description:
        "Every layout starts from accurate site measurements, natural daylight paths, and realistic furniture clearances.",
    },
    {
      icon: <Award size={22} />,
      title: "Material Honesty",
      description:
        "We specify durable veneers, hardware, stone, and upholstery finishes that age gracefully under everyday use.",
    },
    {
      icon: <Users size={22} />,
      title: "Clear Collaboration",
      description:
        "Clients review 2D drawings, finish boards, and itemized scopes before fabrication starts, with zero hidden surprises.",
    },
    {
      icon: <Clock size={22} />,
      title: "Site Accountability",
      description:
        "Disciplined site supervision keeps carpentry, electrical, plumbing, and finishing trades aligned on schedule.",
    },
  ];

  const disciplines = [
    {
      title: "Spatial Architecture",
      detail:
        "Reconfiguring partition walls, storage alcoves, and kitchen work triangles to eliminate wasted corridors.",
    },
    {
      title: "Joinery & Millwork",
      detail:
        "Custom wardrobes, TV consoles, study desks, and modular kitchen cabinetry built to exact millimeter tolerances.",
    },
    {
      title: "Lighting & Electrical",
      detail:
        "Layered task, ambient, and accent circuits coordinated with ceiling profiles and natural window light.",
    },
    {
      title: "Procurement & Finishing",
      detail:
        "Sourcing hardware, sanitary fittings, stones, fabrics, and final decorative hardware under one coordinated schedule.",
    },
  ];

  return (
    <div>
      <Seo
        title="About Us"
        description="Learn about Ornate Interior Decor, an interior design and turnkey execution studio in Vijayanagar, Bengaluru focused on spatial planning and custom millwork."
        path="/about"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]}
      />

      <div className="md:hidden">
        <MobileAboutView />
      </div>

      <div className="hidden md:block">
        <PageHeader
          title="Our Studio &amp; Approach"
          subtitle="About Ornate Interior Decor"
          description="A Bengaluru-based interior design practice grounded in proportion, practical detailing, and dependable site execution."
          breadcrumbs={[
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]}
        />

        <section className="py-20 bg-white">
          <div className="ornate-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
              <div>
                <span className="ornate-pill-label mb-3">Studio Practice</span>
                <h2 className="ornate-title mb-6">Built Around How You Live and Work</h2>

                <p className="text-ornate-charcoal/85 mb-4 leading-relaxed">
                  Operating out of Vijayanagar, Bengaluru, Ornate Interior Decor works with homeowners, business owners, and architects to deliver complete residential and commercial interiors.
                </p>

                <p className="text-ornate-muted mb-4 leading-relaxed">
                  Good interiors rely on fundamentals: clean sightlines, sensible storage capacity, well-placed power points, and joinery that operates smoothly years after installation.
                </p>

                <p className="text-ornate-muted mb-8 leading-relaxed">
                  Whether managing a full turnkey home fit-out or refining a commercial studio, our team stays involved from initial measured drawings through final handover.
                </p>

                <div className="flex flex-wrap gap-3.5">
                  <Link to="/services" className="ornate-btn-primary inline-flex items-center group">
                    Explore Services
                    <ArrowRight
                      size={16}
                      className="ml-2 group-hover:translate-x-1 transition-transform"
                      aria-hidden="true"
                    />
                  </Link>
                  <Link to="/projects" className="ornate-btn-outline inline-flex items-center">
                    View Portfolio
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="overflow-hidden aspect-[4/3] rounded-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1616137303871-05ce745f9cdb?q=80&w=800&auto=format&fit=crop"
                    alt="Minimal dining nook with oak table and soft upholstered seating"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="overflow-hidden sm:row-span-2 aspect-[3/4] sm:aspect-auto rounded-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop"
                    alt="Accent armchair and timber side table in a sunlit reading corner"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="overflow-hidden aspect-[4/3] rounded-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=800&auto=format&fit=crop"
                    alt="Tailored kitchen island with matte cabinetry and pendant lights"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-ornate-moss text-white">
          <div className="ornate-container">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-ornate-gold text-xs font-semibold mb-3">
                Core Principles
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] text-white mb-4">
                What Guides Every Project
              </h2>
              <p className="text-white/75 leading-relaxed">
                Practical design decisions and disciplined execution standards form the foundation of our studio work.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <article
                  key={value.title}
                  className="p-6 rounded-2xl bg-white/[0.06] border border-white/15"
                >
                  <div
                    className="w-11 h-11 rounded-xl bg-ornate-gold/15 text-ornate-gold border border-ornate-gold/25 flex items-center justify-center mb-4"
                    aria-hidden="true"
                  >
                    {value.icon}
                  </div>
                  <h3 className="font-serif text-xl mb-2.5 text-white">
                    {value.title}
                  </h3>
                  <p className="text-white/75 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-ornate-offwhite">
          <div className="ornate-container">
            <div className="max-w-3xl mb-10">
              <span className="ornate-pill-label mb-3">Capabilities</span>
              <h2 className="ornate-title mb-4">In-House Design &amp; Site Disciplines</h2>
              <p className="text-ornate-muted leading-relaxed">
                Each stage of design and execution is documented in clear drawings and material schedules.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {disciplines.map((item) => (
                <div
                  key={item.title}
                  className="ornate-card p-7"
                >
                  <h3 className="font-serif text-xl text-ornate-charcoal mb-2.5">
                    {item.title}
                  </h3>
                  <p className="text-ornate-muted text-sm leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
