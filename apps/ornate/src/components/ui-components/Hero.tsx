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
    variant === "full" ? "min-h-[86vh]" : "min-h-[54vh] md:min-h-[60vh]";

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight * 0.85,
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
          className="absolute inset-0 bg-gradient-to-b from-ornate-softblack/80 via-ornate-softblack/55 to-ornate-softblack/85"
          aria-hidden="true"
        />
      )}

      <div className="ornate-container relative z-10 pt-32 pb-20">
        <div
          className={`flex flex-col max-w-3xl mx-auto ${alignmentClasses[alignment]}`}
        >
          {subtitle && (
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wider uppercase text-ornate-gold mb-5">
              {subtitle}
            </span>
          )}

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.08] tracking-tight mb-5">
            {title}
          </h1>

          <p className="text-white/85 text-base md:text-lg max-w-2xl mb-8 leading-relaxed">
            {description}
          </p>

          {(buttonText || secondaryButtonText) && (
            <div className="flex flex-wrap items-center justify-center gap-3.5">
              {buttonText && (
                <Link
                  to={buttonLink}
                  className="ornate-btn-accent inline-flex items-center group"
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
                  className="ornate-btn border border-white/40 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-ornate-softblack inline-flex items-center group"
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
          className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center cursor-pointer text-white/75 hover:text-white transition-colors"
          aria-label="Scroll to main content"
        >
          <span className="text-xs font-medium tracking-wider uppercase mb-2">
            Explore
          </span>
          <span className="w-5 h-8 rounded-full border border-white/50 flex justify-center">
            <span className="w-1 h-2 rounded-full bg-ornate-gold mt-1.5 animate-bounce" />
          </span>
        </button>
      )}
    </section>
  );
};

export default Hero;
