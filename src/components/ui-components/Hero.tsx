import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface HeroProps {
  title: string;
  subtitle?: string;
  description: string;
  backgroundImage: string;
  buttonText?: string;
  buttonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  hasScrollIndicator?: boolean;
  alignment?: "left" | "center" | "right";
  overlay?: boolean;
  variant?: "full" | "compact";
  className?: string;
}

const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  description,
  backgroundImage,
  buttonText,
  buttonLink = "/",
  secondaryButtonText,
  secondaryButtonLink,
  hasScrollIndicator = false,
  alignment = "center",
  overlay = true,
  variant = "compact",
  className = "",
}) => {
  const alignmentClasses = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  const heightClasses =
    variant === "full" ? "min-h-screen" : "min-h-[58vh] md:min-h-[64vh]";

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <section
      className={`relative ${heightClasses} flex items-center justify-center ${className}`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {overlay && (
        <div
          className="absolute inset-0 bg-gradient-to-b from-ornate-softblack/75 via-ornate-softblack/45 to-ornate-softblack/80"
          aria-hidden="true"
        />
      )}

      <div className="ornate-container relative z-10 pt-32 pb-20">
        <div
          className={`flex flex-col max-w-3xl mx-auto ${alignmentClasses[alignment]}`}
        >
          {subtitle && (
            <span className="inline-flex items-center gap-3 font-display text-xs md:text-sm uppercase tracking-[0.22em] text-ornate-gold mb-4">
              <span className="hidden sm:inline-block w-6 h-px bg-ornate-gold/80" aria-hidden="true" />
              {subtitle}
              <span className="hidden sm:inline-block w-6 h-px bg-ornate-gold/80" aria-hidden="true" />
            </span>
          )}

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.1] tracking-tight mb-6 drop-shadow-sm">
            {title}
          </h1>

          <p className="text-white/90 text-base md:text-lg max-w-2xl mb-9 leading-relaxed">
            {description}
          </p>

          {(buttonText || secondaryButtonText) && (
            <div className="flex flex-wrap items-center justify-center gap-4">
              {buttonText && (
                <Link
                  to={buttonLink}
                  className="ornate-btn bg-ornate-gold text-ornate-softblack hover:bg-white inline-flex items-center group font-medium"
                >
                  {buttonText}
                  <ArrowRight
                    size={16}
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                    aria-hidden="true"
                  />
                </Link>
              )}
              {secondaryButtonText && secondaryButtonLink && (
                <Link
                  to={secondaryButtonLink}
                  className="ornate-btn border border-white/80 text-white hover:bg-white hover:text-ornate-softblack inline-flex items-center group font-medium"
                >
                  {secondaryButtonText}
                  <ArrowRight
                    size={16}
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                    aria-hidden="true"
                  />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {hasScrollIndicator && (
        <button
          type="button"
          onClick={scrollToContent}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center cursor-pointer text-white/80 hover:text-white transition-colors"
          aria-label="Scroll to main content"
        >
          <span className="font-display text-xs uppercase tracking-widest mb-2">
            Scroll
          </span>
          <span className="w-5 h-9 border border-white/60 flex justify-center">
            <span className="w-1 h-2 bg-white mt-2 animate-bounce" />
          </span>
        </button>
      )}
    </section>
  );
};

export default Hero;
