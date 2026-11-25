import React, { useId, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  Scroll,
  Shield,
  Scale,
  Clock,
  Paintbrush,
  Pencil,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import PageHeader from "@/components/ui-components/PageHeader";
import Seo from "@/components/seo/Seo";
import { STUDIO_INFO } from "@/lib/seo";

interface TermSection {
  id: number;
  icon: React.ReactNode;
  title: string;
  content: string;
}

const termSections: TermSection[] = [
  {
    id: 1,
    icon: <Scroll className="w-5 h-5" />,
    title: "Acceptance of Terms",
    content: `By accessing this website or engaging ${STUDIO_INFO.name} for interior design or turnkey services, you agree to these Terms and Conditions alongside any written project agreement executed between you and ${STUDIO_INFO.name}.`,
  },
  {
    id: 2,
    icon: <Paintbrush className="w-5 h-5" />,
    title: "Scope of Design Services",
    content:
      "Services may include spatial planning, 2D drawings, material specification, custom furniture detailing, and turnkey site execution. Exact deliverables, room counts, and exclusions are documented in your signed project proposal.",
  },
  {
    id: 3,
    icon: <DollarSign className="w-5 h-5" />,
    title: "Fees & Payment Schedule",
    content:
      "Design and execution fees follow the milestone schedule in your signed agreement, typically starting with an initial mobilization deposit before site measurements, working drawings, or material procurement begin.",
  },
  {
    id: 4,
    icon: <Clock className="w-5 h-5" />,
    title: "Project Timelines",
    content:
      "Estimated completion windows depend on timely client sign-offs, building association permissions, vendor material lead times, and civil site readiness. Any external delays are communicated promptly with revised schedules.",
  },
  {
    id: 5,
    icon: <Pencil className="w-5 h-5" />,
    title: "Revisions & Scope Changes",
    content:
      "Each proposal specifies included design revision rounds during the layout phase. Changes requested after working drawings are approved or fabrication has started are quoted separately before execution.",
  },
  {
    id: 6,
    icon: <Shield className="w-5 h-5" />,
    title: "Drawings & Intellectual Property",
    content: `Concept layouts, working drawings, joinery details, and finish schedules prepared by ${STUDIO_INFO.name} remain the studio's intellectual property until settled in full and are licensed solely for the contracted property.`,
  },
  {
    id: 7,
    icon: <Scale className="w-5 h-5" />,
    title: "Warranties & Third-Party Products",
    content:
      "Manufactured appliances, lighting fixtures, hardware, and sanitary ware carry warranties provided by their respective manufacturers. Workmanship guarantees for studio-executed carpentry and finishes are detailed in your handover document.",
  },
];

const Terms = () => {
  const [openSection, setOpenSection] = useState<number | null>(1);
  const groupId = useId();

  const toggleSection = (id: number) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  const leftTerms = termSections.slice(0, 4);
  const rightTerms = termSections.slice(4);

  const renderTermItem = (section: TermSection) => {
    const isOpen = openSection === section.id;
    const btnId = `${groupId}-term-btn-${section.id}`;
    const panelId = `${groupId}-term-panel-${section.id}`;

    return (
      <div
        key={section.id}
        className="bg-white border border-ornate-gold/20 shadow-sm"
      >
        <h3>
          <button
            type="button"
            id={btnId}
            aria-expanded={isOpen}
            aria-controls={panelId}
            onClick={() => toggleSection(section.id)}
            className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors duration-200 hover:bg-ornate-cream/50 gap-4"
          >
            <div className="flex items-center space-x-4">
              <div className="text-ornate-darkgold flex-shrink-0" aria-hidden="true">
                {section.icon}
              </div>
              <span className="font-serif text-lg md:text-xl text-ornate-charcoal">
                {section.title}
              </span>
            </div>
            <ChevronDown
              aria-hidden="true"
              className={`w-5 h-5 text-ornate-darkgold flex-shrink-0 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </h3>
        <div
          id={panelId}
          role="region"
          aria-labelledby={btnId}
          hidden={!isOpen}
          className="px-6 pb-5 text-ornate-charcoal/80 text-sm leading-relaxed border-t border-ornate-gold/10 pt-4"
        >
          {section.content}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-ornate-offwhite min-h-screen">
      <Seo
        title="Terms & Conditions"
        description="Review the Terms and Conditions for interior design consultations, payment milestones, revisions, and drawings with Ornate Interior Decor."
        path="/terms-and-conditions"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Terms & Conditions", path: "/terms-and-conditions" },
        ]}
      />

      <div className="hidden md:block">
        <PageHeader
          title="Terms &amp; Conditions"
          subtitle="Client Agreement"
          description="Standard terms governing consultations, design documentation, payment milestones, and site execution."
          breadcrumbs={[
            { name: "Home", path: "/" },
            { name: "Terms & Conditions", path: "/terms-and-conditions" },
          ]}
        />
      </div>

      <section className="py-6 md:py-20">
        <div className="ornate-container">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p className="ornate-subtitle mb-3">Legal Framework</p>
            <h2 className="ornate-title mb-5">Understanding Our Terms</h2>
            <p className="text-ornate-charcoal/80 leading-relaxed">
              Expand each section below to review how scope, revisions, timelines, and documentation are managed.
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-4">{leftTerms.map(renderTermItem)}</div>
            <div className="space-y-4">{rightTerms.map(renderTermItem)}</div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-ornate-charcoal text-white">
        <div className="ornate-container">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-ornate-gold text-xs uppercase tracking-widest font-display mb-3">
              Clarifications
            </p>
            <h2 className="text-3xl md:text-5xl font-serif mb-6">
              Need Clarification on Project Terms?
            </h2>
            <p className="text-white/80 leading-relaxed mb-8">
              Contact our Bengaluru office before commissioning your project or review our Privacy Policy.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                className="ornate-btn bg-ornate-gold text-ornate-softblack hover:bg-white inline-flex items-center font-medium"
              >
                Contact Us
                <ArrowRight size={16} className="ml-2" aria-hidden="true" />
              </Link>
              <Link
                to="/privacy-policy"
                className="ornate-btn border border-white/40 text-white hover:bg-white hover:text-ornate-charcoal"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Terms;