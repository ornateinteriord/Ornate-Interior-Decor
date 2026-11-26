import React from "react";
import ServiceCard from "../ui-components/ServiceCard";
import { Palette, Building2, LayoutDashboard, Home, Ruler, Sofa } from "lucide-react";

const services = [
  {
    id: "residential-design",
    title: "Residential Design",
    description:
      "Full-home and apartment interiors covering living spaces, kitchens, wardrobes, lighting layouts, and finish schedules.",
    icon: <Home size={24} />,
    link: "/services#residential-design",
  },
  {
    id: "commercial-design",
    title: "Commercial Design",
    description:
      "Workplaces, studios, and hospitality interiors planned for acoustic comfort, brand consistency, and daily durability.",
    icon: <Building2 size={24} />,
    link: "/services#commercial-design",
  },
  {
    id: "space-planning",
    title: "Space Planning",
    description:
      "Measured 2D furniture layouts, electrical mapping, and circulation studies that make compact or complex footprints work harder.",
    icon: <LayoutDashboard size={24} />,
    link: "/services#space-planning",
  },
  {
    id: "custom-furniture",
    title: "Custom Furniture & Millwork",
    description:
      "Made-to-measure cabinetry, modular kitchens, vanities, and loose furniture detailed to fit your room dimensions.",
    icon: <Sofa size={24} />,
    link: "/services#custom-furniture",
  },
  {
    id: "color-consultation",
    title: "Material & Color Curation",
    description:
      "Coordinated palettes across veneers, laminates, stone, upholstery, and wall finishes tested under your site lighting.",
    icon: <Palette size={24} />,
    link: "/services#color-consultation",
  },
  {
    id: "project-management",
    title: "Turnkey Execution",
    description:
      "On-site coordination with civil, electrical, carpentry, and painting trades with milestone tracking through completion.",
    icon: <Ruler size={24} />,
    link: "/services#project-management",
  },
];

interface ServicesSectionProps {
  tone?: "light" | "dark";
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ tone = "dark" }) => {
  const isDark = tone === "dark";

  return (
    <section
      id="services"
      className={`py-20 ${
        isDark ? "bg-ornate-moss text-white" : "bg-ornate-offwhite text-ornate-charcoal"
      }`}
    >
      <div className="ornate-container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
              isDark
                ? "bg-white/10 text-ornate-gold border border-white/15"
                : "ornate-pill-label"
            }`}
          >
            Scope of Work
          </span>
          <h2
            className={`font-serif text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.12] font-medium mb-4 ${
              isDark ? "text-white" : "text-ornate-charcoal"
            }`}
          >
            Design &amp; Build Services
          </h2>
          <p
            className={`leading-relaxed ${
              isDark ? "text-white/75" : "text-ornate-muted"
            }`}
          >
            Commission a complete turnkey fit-out or engage our studio for individual design, space planning, and custom cabinetry stages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              description={service.description}
              icon={service.icon}
              link={service.link}
              index={index}
              tone={tone}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
