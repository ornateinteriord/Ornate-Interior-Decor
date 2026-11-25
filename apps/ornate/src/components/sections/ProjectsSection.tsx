import React from "react";
import ProjectCard from "../ui-components/ProjectCard";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const projects = [
  {
    title: "Urban Apartment Living & Dining",
    category: "Residential",
    description:
      "Open-plan living and dining layout using warm oak veneer, concealed storage walls, and layered ambient lighting.",
    image:
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=1200&auto=format&fit=crop",
    alt: "Open-plan apartment living room with neutral sofa, timber shelving, and soft daylight",
    link: "/projects#residential",
  },
  {
    title: "Villa Lounge & Terrace Suite",
    category: "Residential",
    description:
      "Double-height family lounge finished in natural stone, linen drapery, and custom low-profile seating.",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
    alt: "Spacious contemporary villa lounge opening onto an outdoor terrace",
    link: "/projects#residential",
  },
  {
    title: "Hospitality Reception & Lobby",
    category: "Hospitality",
    description:
      "Welcoming reception hall anchored by fluted wall paneling, brass hardware, and bespoke lounge armchairs.",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop",
    alt: "Hospitality lounge reception area with warm wall textures and tailored seating",
    link: "/projects#hospitality",
  },
  {
    title: "Cafe & Tasting Counter",
    category: "Commercial",
    description:
      "Compact hospitality interior pairing textured plaster walls with durable solid-wood counter joinery.",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200&auto=format&fit=crop",
    alt: "Warm cafe dining interior with timber tables and pendant lighting",
    link: "/projects#commercial",
  },
  {
    title: "Executive Studio & Meeting Room",
    category: "Commercial",
    description:
      "Focused office interior balancing acoustic privacy, daylight access, and integrated cable management.",
    image:
      "https://images.unsplash.com/photo-1594732832278-abd644401426?q=80&w=1200&auto=format&fit=crop",
    alt: "Clean contemporary office interior with large windows and structured workspace",
    link: "/projects#commercial",
  },
];

const ProjectsSection: React.FC = () => {
  return (
    <section id="projects" className="py-20 bg-white">
      <div className="ornate-container">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="ornate-subtitle mb-3">Selected Portfolio</p>
          <h2 className="ornate-title mb-5">Residential &amp; Commercial Spaces</h2>
          <p className="text-ornate-charcoal/80 leading-relaxed">
            Browse typologies across apartments, independent homes, offices, and hospitality interiors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 mb-12">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.title}
              title={project.title}
              category={project.category}
              description={project.description}
              image={project.image}
              alt={project.alt}
              link={project.link}
              variant="overlay"
              className={
                index < 2
                  ? "lg:col-span-6"
                  : index === 4
                  ? "md:col-span-2 lg:col-span-4"
                  : "lg:col-span-4"
              }
            />
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/projects"
            className="ornate-btn-primary inline-flex items-center group"
          >
            View All Projects
            <ArrowRight
              size={16}
              className="ml-2 group-hover:translate-x-1 transition-transform"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
