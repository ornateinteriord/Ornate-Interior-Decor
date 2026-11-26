import React from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const HIGHLIGHTS = [
  "Measured 2D furniture & lighting layouts",
  "Durable veneers, natural stone & solid wood",
  "Transparent itemized estimates before work begins",
];

const AboutSection: React.FC = () => {
  return (
    <section className="py-20 bg-ornate-cream border-y border-ornate-border">
      <div className="ornate-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative">
            <div className="relative z-10 overflow-hidden rounded-3xl shadow-lg group">
              <img
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200&auto=format&fit=crop"
                alt="Warm living room interior featuring timber accents, tailored seating, and natural daylight"
                loading="lazy"
                className="w-full h-auto transition-transform duration-500 ease-in-out group-hover:scale-105"
              />
            </div>
            <div className="hidden sm:flex items-center gap-3 absolute -bottom-5 right-6 z-20 px-5 py-3.5 rounded-2xl bg-white border border-ornate-border shadow-lg">
              <div className="w-2.5 h-2.5 rounded-full bg-ornate-moss" />
              <div>
                <p className="text-xs font-semibold text-ornate-charcoal">
                  Vijayanagar Studio
                </p>
                <p className="text-[11px] text-ornate-muted">
                  Design + Turnkey Handover
                </p>
              </div>
            </div>
          </div>

          <div>
            <span className="ornate-pill-label mb-3">Our Studio</span>
            <h2 className="ornate-title mb-5">
              Proportion, Materiality, and Practical Living
            </h2>

            <p className="text-ornate-charcoal/80 mb-4 leading-relaxed">
              Based in Vijayanagar, Bengaluru, Ornate Interior Decor designs and delivers residential apartments, independent homes, and commercial workspaces from initial layout planning through final site handover.
            </p>

            <p className="text-ornate-muted mb-6 leading-relaxed">
              Rather than chasing fleeting trends, we focus on clear circulation, reliable joinery details, balanced lighting, and tactile finishes tailored to how every room is lived in.
            </p>

            <ul className="space-y-2.5 mb-8">
              {HIGHLIGHTS.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 text-sm font-medium text-ornate-charcoal"
                >
                  <CheckCircle2
                    size={17}
                    className="text-ornate-moss shrink-0"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Link to="/about" className="ornate-btn-primary inline-flex items-center group">
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
