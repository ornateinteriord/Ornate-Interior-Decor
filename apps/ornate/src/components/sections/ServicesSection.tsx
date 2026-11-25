import React from "react";
import ServiceCard from "../ui-components/ServiceCard";
import { Palette, Building2, LayoutDashboard, Home, Ruler, Sofa } from "lucide-react";

const services = [
  {
    id: "residential-design",
    title: "Residential Design",
    description:
      "Full-home and apartment interiors covering living spaces, kitchens, wardrobes, lighting layouts, and finish schedules.",
    icon: <Home size={40} />,
    link: "/services#residential-design",
  },
  {
    id: "commercial-design",
    title: "Commercial Design",
    description:
      "Workplaces, studios, and hospitality interiors planned for acoustic comfort, brand consistency, and daily durability.",
    icon: <Building2 size={40} />,
    link: "/services#commercial-design",
  },
  {
    id: "space-planning",
    title: "Space Planning",
    description:
      "Measured 2D furniture layouts, electrical mapping, and circulation studies that make compact or complex footprints work harder.",
    icon: <LayoutDashboard size={40} />,
    link: "/services#space-planning",
  },
  {
    id: "custom-furniture",
    title: "Custom Furniture & Millwork",
    description:
      "Made-to-measure cabinetry, modular kitchens, vanities, and loose furniture detailed to fit your room dimensions.",
    icon: <Sofa size={40} />,
    link: "/services#custom-furniture",
  },
  {
    id: "color-consultation",
    title: "Material & Color Curation",
    description:
      "Coordinated palettes across veneers, laminates, stone, upholstery, and wall finishes tested under your site lighting.",
    icon: <Palette size={40} />,
    link: "/services#color-consultation",
  },
  {
    id: "project-management",
    title: "Turnkey Execution",
    description:
      "On-site coordination with civil, electrical, carpentry, and painting trades with milestone tracking through completion.",
    icon: <Ruler size={40} />,
    link: "/services#project-management",
  },
];

const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="py-20 bg-ornate-offwhite">
      <div className="ornate-container">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="ornate-subtitle mb-3">Scope of Work</p>
          <h2 className="ornate-title mb-5">Design &amp; Build Services</h2>
          <p className="text-ornate-charcoal/80 leading-relaxed">
            Every engagement can be commissioned as a turnkey package or tailored to specific stages of your renovation or new build.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              description={service.description}
              icon={service.icon}
              link={service.link}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
