import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ProjectCardProps {
  title: string;
  category: string;
  scope?: string;
  description: string;
  image: string;
  alt?: string;
  link: string;
  variant?: "overlay" | "editorial";
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  category,
  scope,
  description,
  image,
  alt,
  link,
  variant = "editorial",
  className = "",
}) => {
  if (variant === "overlay") {
    return (
      <article
        className={`group relative overflow-hidden rounded-sm bg-ornate-softblack border border-ornate-gold/20 shadow-sm ${className}`}
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <img
            src={image}
            alt={alt || `${title} - ${category.toLowerCase()} interior design`}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 opacity-95 transition-opacity duration-300"
            aria-hidden="true"
          />

          <div className="absolute top-4 left-4">
            <span className="inline-block px-3 py-1 bg-ornate-softblack/80 backdrop-blur-sm border border-ornate-gold/30 font-display uppercase tracking-[0.14em] text-[10px] text-ornate-gold">
              {category}
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-7">
            {scope && (
              <p className="font-display uppercase tracking-[0.14em] text-[11px] text-ornate-gold/90 mb-1.5">
                {scope}
              </p>
            )}
            <h3 className="font-serif text-xl md:text-2xl text-white mb-2 leading-snug">
              {title}
            </h3>
            <p className="text-white/80 text-sm max-w-lg mb-4 line-clamp-2 leading-relaxed">
              {description}
            </p>
            <Link
              to={link}
              className="inline-flex items-center text-ornate-gold hover:text-white font-display text-xs uppercase tracking-[0.14em] transition-colors"
            >
              View Details
              <ArrowRight
                size={14}
                className="ml-2 transform transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`group bg-white border border-ornate-gold/20 hover:border-ornate-darkgold/50 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col ${className}`}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-ornate-cream">
        <img
          src={image}
          alt={alt || `${title} - ${category.toLowerCase()} interior design`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <span className="absolute top-3.5 left-3.5 px-2.5 py-1 bg-ornate-softblack/85 backdrop-blur-sm text-ornate-gold font-display uppercase tracking-[0.14em] text-[10px]">
          {category}
        </span>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {scope && (
            <p className="font-display uppercase tracking-[0.14em] text-[11px] text-ornate-darkgold mb-1.5">
              {scope}
            </p>
          )}
          <h3 className="font-serif text-xl text-ornate-charcoal mb-2 leading-snug">
            {title}
          </h3>
          <p className="text-ornate-charcoal/75 text-sm leading-relaxed line-clamp-2 mb-5">
            {description}
          </p>
        </div>

        <div className="pt-4 border-t border-ornate-gold/15">
          <Link
            to={link}
            className="inline-flex items-center text-ornate-darkgold hover:text-ornate-charcoal font-display text-xs uppercase tracking-[0.14em] transition-colors"
          >
            Inquire About Space
            <ArrowRight
              size={14}
              className="ml-2 transform transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
