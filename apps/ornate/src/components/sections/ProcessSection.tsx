import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const processSteps = [
  {
    step: "01",
    title: "Site Measure & Brief",
    description:
      "We visit your property in Bengaluru or review architectural floor plans remotely to document dimensions, structural constraints, and budget priorities.",
  },
  {
    step: "02",
    title: "Layout & Material Board",
    description:
      "You receive 2D furniture layouts, circulation plans, and physical or digital finish selections covering wood, stone, laminates, and lighting.",
  },
  {
    step: "03",
    title: "Working Drawings",
    description:
      "Detailed electrical, plumbing, ceiling, and joinery elevations are prepared before site fabrication begins so trade teams work from exact specifications.",
  },
  {
    step: "04",
    title: "Execution & Handover",
    description:
      "Our team coordinates site supervision, carpentry installation, painting, and final styling checks through project completion.",
  },
];

const ProcessSection: React.FC = () => {
  return (
    <section className="py-20 bg-ornate-cream">
      <div className="ornate-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <p className="ornate-subtitle mb-3">How We Work</p>
            <h2 className="ornate-title">A Clear Four-Stage Process</h2>
          </div>
          <Link
            to="/faq"
            className="inline-flex items-center text-ornate-darkgold hover:text-ornate-charcoal font-display text-xs uppercase tracking-wider transition-colors"
          >
            Read Common Questions
            <ArrowRight size={15} className="ml-2" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {processSteps.map((item) => (
            <article
              key={item.step}
              className="bg-white p-8 border border-ornate-gold/20 flex flex-col justify-between"
            >
              <div>
                <span className="font-display text-xs tracking-widest text-ornate-darkgold block mb-4">
                  STAGE {item.step}
                </span>
                <h3 className="font-serif text-xl text-ornate-charcoal mb-3">
                  {item.title}
                </h3>
                <p className="text-ornate-charcoal/75 text-sm leading-relaxed">
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

