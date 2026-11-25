import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const AboutSection: React.FC = () => {
  return (
    <section className="py-20 bg-ornate-cream">
      <div className="ornate-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative">
            <div className="relative z-10 overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200&auto=format&fit=crop"
                alt="Warm living room interior featuring timber accents, tailored seating, and natural daylight"
                loading="lazy"
                className="w-full h-auto rounded-sm transition-transform duration-500 ease-in-out group-hover:scale-105"
              />
            </div>
            <div
              className="hidden sm:block absolute -bottom-6 -right-6 w-56 h-56 border-8 border-white z-0"
              aria-hidden="true"
            />
          </div>

          <div>
            <p className="ornate-subtitle mb-3">Our Studio</p>
            <h2 className="ornate-title mb-6">
              Proportion, Materiality, and Function
            </h2>

            <p className="text-ornate-charcoal/80 mb-5 leading-relaxed">
              Based in Vijayanagar, Bengaluru, Ornate Interior Decor handles residential apartments, independent homes, and commercial workspaces from initial layout planning through final site handover.
            </p>

            <p className="text-ornate-charcoal/80 mb-8 leading-relaxed">
              Rather than relying on transient trends, our studio focuses on clear circulation, reliable joinery details, balanced lighting, and tactile finishes suited to how each room is actually used.
            </p>

            <Link to="/about" className="ornate-btn-outline inline-flex items-center group">
              About the Studio
              <ArrowRight
                size={16}
                className="ml-2 inline-block group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
