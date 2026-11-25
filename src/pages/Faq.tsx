import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageHeader from "../components/ui-components/PageHeader";
import FaqAccordion from "../components/ui-components/FaqAccordion";
import Seo from "../components/seo/Seo";
import { MobileFaqView } from "../components/mobile/MobileInfoViews";

const generalFaqs = [
  {
    question: "What services does Ornate Interior Decor provide?",
    answer:
      "We handle residential and commercial interior design, 2D space planning, modular kitchens, custom wardrobes and furniture, color and material selection, and turnkey site execution.",
  },
  {
    question: "How are project costs structured?",
    answer:
      "Fees depend on property area, material specifications, custom millwork volume, and whether you choose design-only consultancy or full turnkey execution. After reviewing your floor plan and site, we issue an itemized estimate.",
  },
  {
    question: "How long does a typical residential project take?",
    answer:
      "Single-room updates usually take 3 to 5 weeks, while full apartment or villa interiors typically span 8 to 16 weeks depending on civil modifications and custom fabrication timelines.",
  },
  {
    question: "Do you take projects outside Vijayanagar or Bengaluru?",
    answer:
      "Our primary site execution team covers Bengaluru and surrounding Karnataka regions. Design consultancy and drawing packages can also be arranged remotely based on project scope.",
  },
];

const processFaqs = [
  {
    question: "What happens during the initial consultation?",
    answer:
      "We review your floor plan or inspect the site, discuss room priorities, storage needs, preferred materials, and realistic budget ranges, and outline how the four project stages work.",
  },
  {
    question: "How involved will I be during material selection?",
    answer:
      "You review and sign off on all space layouts, finish boards, laminates, veneers, stone samples, and lighting fixtures before fabrication begins.",
  },
  {
    question: "What if we want adjustments to the initial layout?",
    answer:
      "Layout revisions are built into the planning stage before working drawings are finalized, ensuring circulation and furniture sizes match your preferences.",
  },
  {
    question: "Do you handle sourcing and on-site coordination?",
    answer:
      "Yes. For turnkey engagements, we coordinate material procurement, carpentry, electrical, plumbing, ceiling, and painting work through final handover.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [...generalFaqs, ...processFaqs].map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

const Faq = () => {
  return (
    <div>
      <Seo
        title="Frequently Asked Questions"
        description="Answers to common questions about interior design pricing, timelines, turnkey execution, and consultations at Ornate Interior Decor in Bengaluru."
        path="/faq"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
        ]}
        schema={faqSchema}
      />

      <div className="md:hidden">
        <MobileFaqView generalFaqs={generalFaqs} processFaqs={processFaqs} />
      </div>

      <div className="hidden md:block">
        <PageHeader
          title="Frequently Asked Questions"
          subtitle="Client Guide"
          description="Clear answers on scope, project timelines, material approvals, and working with our Bengaluru design studio."
          breadcrumbs={[
            { name: "Home", path: "/" },
            { name: "FAQ", path: "/faq" },
          ]}
        />

      <section className="py-20 bg-white">
        <div className="ornate-container">
          <div className="max-w-4xl mx-auto">
            <div className="mb-16">
              <p className="ornate-subtitle mb-3">General Questions</p>
              <h2 className="ornate-title mb-8">Scope, Pricing &amp; Coverage</h2>
              <FaqAccordion faqs={generalFaqs} />
            </div>

            <div className="mb-16">
              <p className="ornate-subtitle mb-3">Process Questions</p>
              <h2 className="ornate-title mb-8">From Brief to Handover</h2>
              <FaqAccordion faqs={processFaqs} />
            </div>

            <div className="text-center p-8 md:p-10 bg-ornate-cream border border-ornate-gold/20">
              <h2 className="font-serif text-2xl mb-3 text-ornate-charcoal">
                Still Have Questions?
              </h2>
              <p className="text-ornate-charcoal/80 mb-6 leading-relaxed">
                Contact our studio directly or read our consultation preparation checklist.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/contact"
                  className="ornate-btn-primary inline-flex items-center group"
                >
                  Contact Us
                  <ArrowRight
                    size={16}
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                    aria-hidden="true"
                  />
                </Link>
                <Link to="/help" className="ornate-btn-outline">
                  Help &amp; Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
};

export default Faq;
