import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ClipboardList, Compass, FileText, Mail, Phone } from "lucide-react";
import PageHeader from "../components/ui-components/PageHeader";
import Seo from "../components/seo/Seo";
import { MobileHelpView } from "../components/mobile/MobileInfoViews";
import { STUDIO_INFO } from "@/lib/seo";

const Help = () => {
  const resources = [
    {
      icon: <Compass size={28} className="text-ornate-darkgold" />,
      title: "Explore Services",
      description:
        "Review residential, commercial, space planning, and custom cabinetry scopes before booking a visit.",
      to: "/services",
      cta: "View Services",
    },
    {
      icon: <ClipboardList size={28} className="text-ornate-darkgold" />,
      title: "Common Questions",
      description:
        "Read straightforward answers on project timelines, fee structure, and material approval stages.",
      to: "/faq",
      cta: "Open FAQ",
    },
    {
      icon: <FileText size={28} className="text-ornate-darkgold" />,
      title: "Project Terms",
      description:
        "Review payment milestones, revision rounds, and intellectual property terms in plain language.",
      to: "/terms-and-conditions",
      cta: "Read Terms",
    },
    {
      icon: <Mail size={28} className="text-ornate-darkgold" />,
      title: "Send Floor Plans",
      description:
        "Share your builder floor plan or site measurements directly with our Vijayanagar design team.",
      to: "/contact",
      cta: "Contact Studio",
    },
  ];

  const quickChecks = [
    {
      question: "How do I schedule a consultation?",
      answer: `Use our Contact page form, call ${STUDIO_INFO.phoneDisplay}, or email ${STUDIO_INFO.email} with your property location and approximate handover date.`,
    },
    {
      question: "What should I bring to the first meeting?",
      answer:
        "A copy of your builder floor plan (PDF or photo), rough room priorities, any reference images you like, and a target budget range help us give accurate initial feedback.",
    },
    {
      question: "Where is your studio located?",
      answer:
        "148/E, 17th Main Rd, SBI Staff Colony, Hosahalli Extension, Stage 1, Vijayanagar, Bengaluru, Karnataka 560040. Open Monday to Saturday.",
    },
  ];

  return (
    <div>
      <Seo
        title="Help & Support"
        description="Get direct support from Ornate Interior Decor in Bengaluru. Prepare for your design consultation, check studio hours, or email our team."
        path="/help"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Help & Support", path: "/help" },
        ]}
      />

      <div className="md:hidden">
        <MobileHelpView />
      </div>

      <div className="hidden md:block">
        <PageHeader
          title="Help &amp; Support"
          subtitle="Client Resources"
          description="Guidance for preparing your floor plans, scheduling a site visit, and reaching our Bengaluru design studio."
          breadcrumbs={[
            { name: "Home", path: "/" },
            { name: "Help & Support", path: "/help" },
          ]}
        />

      <section className="py-20 bg-white">
        <div className="ornate-container">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p className="ornate-subtitle mb-3">Quick Navigation</p>
            <h2 className="ornate-title mb-5">How Can We Help?</h2>
            <p className="text-ornate-charcoal/80 leading-relaxed">
              Jump directly to service details, consultation guidelines, or legal terms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {resources.map((resource) => (
              <article
                key={resource.title}
                className="p-8 border border-ornate-gold/20 hover:border-ornate-gold/60 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="mb-5" aria-hidden="true">
                    {resource.icon}
                  </div>
                  <h3 className="font-serif text-xl mb-3 text-ornate-charcoal">
                    {resource.title}
                  </h3>
                  <p className="text-ornate-charcoal/75 text-sm mb-6 leading-relaxed">
                    {resource.description}
                  </p>
                </div>
                <Link
                  to={resource.to}
                  className="inline-flex items-center text-ornate-darkgold hover:text-ornate-charcoal font-display text-xs uppercase tracking-wider transition-colors group"
                >
                  {resource.cta}
                  <ArrowRight
                    size={15}
                    className="ml-2 transform transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-ornate-cream">
        <div className="ornate-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            <div>
              <p className="ornate-subtitle mb-3">Direct Channels</p>
              <h2 className="ornate-title mb-6">Speak With Our Team</h2>

              <p className="text-ornate-charcoal/80 mb-8 leading-relaxed">
                For active project updates, site visit scheduling, or new inquiries, reach our Vijayanagar office by phone or email during working hours.
              </p>

              <div className="bg-white p-8 border border-ornate-gold/20 space-y-6 mb-6">
                <div className="flex items-center">
                  <Mail size={22} className="text-ornate-darkgold mr-4 flex-shrink-0" aria-hidden="true" />
                  <div>
                    <h3 className="font-serif text-lg text-ornate-charcoal">Email Studio</h3>
                    <p className="text-sm text-ornate-charcoal/75">{STUDIO_INFO.email}</p>
                  </div>
                </div>
                <a
                  href={`mailto:${STUDIO_INFO.email}`}
                  className="ornate-btn-primary w-full flex justify-center items-center group"
                >
                  Send an Email
                  <ArrowRight
                    size={16}
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                    aria-hidden="true"
                  />
                </a>
              </div>

              <div className="bg-white p-8 border border-ornate-gold/20 space-y-6">
                <div className="flex items-center">
                  <Phone size={22} className="text-ornate-darkgold mr-4 flex-shrink-0" aria-hidden="true" />
                  <div>
                    <h3 className="font-serif text-lg text-ornate-charcoal">Phone Consultation</h3>
                    <p className="text-sm text-ornate-charcoal/75">
                      {STUDIO_INFO.phoneDisplay} (Mon - Sat)
                    </p>
                  </div>
                </div>
                <Link
                  to="/contact"
                  className="ornate-btn-outline w-full flex justify-center items-center group"
                >
                  Open Contact Form
                  <ArrowRight
                    size={16}
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>

            <div className="bg-white p-8 border border-ornate-gold/20 shadow-sm">
              <h2 className="font-serif text-2xl mb-6 text-ornate-charcoal">
                Consultation Checklist
              </h2>

              <div className="space-y-6">
                {quickChecks.map((item) => (
                  <div key={item.question} className="border-b border-ornate-gold/15 pb-6 last:border-b-0 last:pb-0">
                    <h3 className="font-serif text-lg mb-2 text-ornate-charcoal">
                      {item.question}
                    </h3>
                    <p className="text-ornate-charcoal/75 text-sm leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-ornate-gold/15 text-center">
                <Link
                  to="/faq"
                  className="inline-flex items-center text-ornate-darkgold hover:text-ornate-charcoal font-display text-xs uppercase tracking-wider group"
                >
                  View All FAQs
                  <ArrowRight
                    size={15}
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                    aria-hidden="true"
                  />
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

export default Help;
