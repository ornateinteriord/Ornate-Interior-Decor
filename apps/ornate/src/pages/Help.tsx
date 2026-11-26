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

      <section className="py-16 bg-white">
        <div className="ornate-container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="ornate-pill-label mb-3">Quick Navigation</span>
            <h2 className="ornate-title mb-4">How Can We Help?</h2>
            <p className="text-ornate-muted leading-relaxed">
              Jump directly to service details, consultation guidelines, or legal terms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource) => (
              <article
                key={resource.title}
                className="ornate-card p-7 hover:border-ornate-moss/45 flex flex-col justify-between"
              >
                <div>
                  <div className="w-11 h-11 rounded-xl bg-ornate-sage flex items-center justify-center text-ornate-moss mb-5" aria-hidden="true">
                    {resource.icon}
                  </div>
                  <h3 className="font-serif text-xl mb-2.5 text-ornate-charcoal">
                    {resource.title}
                  </h3>
                  <p className="text-ornate-muted text-sm mb-6 leading-relaxed">
                    {resource.description}
                  </p>
                </div>
                <Link
                  to={resource.to}
                  className="inline-flex items-center text-ornate-moss hover:text-ornate-darkgold text-sm font-semibold transition-colors group"
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

      <section className="py-20 bg-ornate-cream border-t border-ornate-border">
        <div className="ornate-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <span className="ornate-pill-label mb-3">Direct Channels</span>
              <h2 className="ornate-title mb-5">Speak With Our Team</h2>

              <p className="text-ornate-muted mb-7 leading-relaxed">
                For active project updates, site visit scheduling, or new inquiries, reach our Vijayanagar office by phone or email during working hours.
              </p>

              <div className="ornate-card p-7 space-y-5 mb-5">
                <div className="flex items-center gap-4">
                  <span className="w-11 h-11 rounded-xl bg-ornate-sage flex items-center justify-center text-ornate-moss shrink-0">
                    <Mail size={20} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-serif text-lg text-ornate-charcoal">Email Studio</h3>
                    <p className="text-sm text-ornate-muted">{STUDIO_INFO.email}</p>
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

              <div className="ornate-card p-7 space-y-5">
                <div className="flex items-center gap-4">
                  <span className="w-11 h-11 rounded-xl bg-ornate-sage flex items-center justify-center text-ornate-moss shrink-0">
                    <Phone size={20} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-serif text-lg text-ornate-charcoal">Phone Consultation</h3>
                    <p className="text-sm text-ornate-muted">
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

            <div className="ornate-card p-8">
              <h2 className="font-serif text-2xl mb-6 text-ornate-charcoal">
                Consultation Checklist
              </h2>

              <div className="space-y-6">
                {quickChecks.map((item) => (
                  <div key={item.question} className="border-b border-ornate-border pb-6 last:border-b-0 last:pb-0">
                    <h3 className="font-serif text-lg mb-2 text-ornate-charcoal">
                      {item.question}
                    </h3>
                    <p className="text-ornate-muted text-sm leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-ornate-border text-center">
                <Link
                  to="/faq"
                  className="inline-flex items-center text-ornate-moss hover:text-ornate-darkgold text-sm font-semibold group"
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
