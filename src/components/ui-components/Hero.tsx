
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroProps {
  title: string;
  subtitle?: string;
  description: string;
  backgroundImage: string;
  buttonText?: string;
  buttonLink?: string;
  hasScrollIndicator?: boolean;
  alignment?: 'left' | 'center' | 'right';
  overlay?: boolean;
  className?: string;
}

const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  description,
  backgroundImage,
  buttonText,
  buttonLink = '/',
  hasScrollIndicator = false,
  alignment = 'center',
  overlay = true,
  className = '',
}) => {
  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  return (
    <section
      className={`relative min-h-screen flex items-center justify-center ${className}`}
      style={{ 
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {overlay && (
        <div className="absolute inset-0 bg-ornate-charcoal/40  "></div>
      )}
      
      <div className="ornate-container relative z-10 py-20">
        <div className={`flex flex-col max-w-3xl mx-auto ${alignmentClasses[alignment]}`}>
          {subtitle && (
            <span className="text-lg text-white mb-4 animate-fade-in">
              {subtitle}
            </span>
          )}
          
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6 animate-fade-in">
            {title}
          </h1>
          
          <p className="text-white/90 text-lg max-w-2xl mb-8 animate-fade-in">
            {description}
          </p>
          
          {buttonText && (
            <Link to={buttonLink} className="ornate-btn-primary center animate-fade-in flex items-center group">
              {buttonText}
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </div>
      
      {hasScrollIndicator && (
        <button
          onClick={scrollToContent}
          className="absolute bottom-12 xs:bottom-6 sm:bottom-8left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center animate-float cursor-pointer"
          aria-label="Scroll down"
        >
          <span className="text-white/80 font-display text-xs uppercase tracking-widest mb-2">Scroll</span>
          <span className="w-5 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <span className="w-1 h-2 bg-white rounded-full mt-2 animate-bounce"></span>
          </span>
        </button>
      )}
    </section>
  );
};

export default Hero;
