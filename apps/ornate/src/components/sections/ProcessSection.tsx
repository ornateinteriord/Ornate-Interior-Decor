import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const processSteps = [
  {
    step: "01",
    title: "Site Measure & Brief",
    description:
      "We visit your property in Bengaluru or review floor plans remotely to document dimensions, structural constraints, and budget priorities.",
  },
  {
    step: "02",
    title: "Layout & Material Board",
    description:
      "You receive 2D furniture layouts, circulation plans, and finish selections covering wood, stone, laminates, and lighting.",
  },
  {
    step: "03",
    title: "Working Drawings",
    description:
      "Detailed electrical, plumbing, ceiling, and joinery elevations are prepared before fabrication begins so every trade works accurately.",
  },
  {
    step: "04",
    title: "Execution & Handover",
    description:
      "Our team supervises carpentry installation, painting, hardware fitting, and final styling checks through project completion.",
  },
];

const ProcessSection: React.FC = () => {
  return (
    <section className="py-20 bg-ornate-offwhite border-t border-ornate-border">
      <div className="ornate-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="ornate-pill-label mb-3">How We Work</span>
            <h2 className="ornate-title">A Clear Four-Stage Process</h2>
          </div>
          <Link
            to="/faq"
            className="inline-flex items-center text-sm font-semibold text-ornate-moss hover:text-ornate-darkgold transition-colors"
          >
            Read Common Questions
            <ArrowRight size={15} className="ml-2" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {processSteps.map((item) => (
            <article
              key={item.step}
              className="ornate-card p-7 flex flex-col justify-between hover:border-ornate-moss/40"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-serif text-3xl font-medium text-ornate-darkgold/75 price-nums">
                    {item.step}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-ornate-cream text-xs font-medium text-ornate-muted">
                    Stage {Number(item.step)}
                  </span>
                </div>
                <h3 className="font-serif text-xl text-ornate-charcoal mb-2.5">
                  {item.title}
                </h3>
                <p className="text-ornate-muted text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
