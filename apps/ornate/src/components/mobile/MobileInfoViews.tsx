import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Clock,
  Mail,
  MapPin,
  PenTool,
  Phone,
  Users,
} from "lucide-react";
import ContactForm from "@/components/ui-components/ContactForm";
import FaqAccordion from "@/components/ui-components/FaqAccordion";
import { STUDIO_INFO } from "@/lib/seo";

export const MobileAboutView: React.FC = () => {
  const values = [
    {
      icon: PenTool,
      title: "Measured Design",
      description:
        "Every layout starts from accurate site measurements, daylight paths, and realistic furniture clearances.",
    },
    {
      icon: Award,
      title: "Material Honesty",
      description:
        "Durable veneers, hardware, stone, and upholstery finishes that age gracefully under daily use.",
    },
    {
      icon: Users,
      title: "Clear Collaboration",
      description:
        "Clients review 2D drawings, finish boards, and itemized scopes before fabrication begins.",
    },
    {
      icon: Clock,
      title: "Site Accountability",
      description:
        "Disciplined site supervision keeps carpentry, electrical, plumbing, and finishing trades on schedule.",
    },
  ];

  return (
    <div className="px-4 pt-3 pb-6 space-y-5 bg-ornate-offwhite">
      <div className="ornate-card overflow-hidden">
        <div className="h-44 bg-ornate-cream">
          <img
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1000&auto=format&fit=crop"
            alt="Ornate Interior Decor Studio"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-5">
          <p className="text-xs font-semibold text-ornate-darkgold">
            Studio Practice
          </p>
          <h2 className="font-serif text-xl text-ornate-charcoal mt-1">
            Built Around How You Live &amp; Work
          </h2>
          <p className="text-xs text-ornate-muted leading-relaxed mt-2">
            Operating out of Vijayanagar, Bengaluru, Ornate Interior Decor delivers residential and commercial interiors from initial measured drawings through final handover.
          </p>
          <div className="mt-4 flex gap-2.5">
            <Link
              to="/shop"
              className="px-4 py-2 rounded-full bg-ornate-moss text-white text-xs font-semibold"
            >
              Shop Furniture
            </Link>
            <Link
              to="/services"
              className="px-4 py-2 rounded-full border border-ornate-border text-ornate-charcoal text-xs font-semibold"
            >
              Our Services
            </Link>
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        <h3 className="font-serif text-lg text-ornate-charcoal px-1">
          Core Principles
        </h3>
        <div className="ornate-card divide-y divide-ornate-border overflow-hidden">
          {values.map((val) => {
            const Icon = val.icon;
            return (
              <div key={val.title} className="p-4 flex items-start gap-3">
                <span className="w-9 h-9 rounded-xl bg-ornate-sage flex items-center justify-center text-ornate-moss shrink-0">
                  <Icon size={18} />
                </span>
                <div>
                  <h4 className="font-serif text-base text-ornate-charcoal">
                    {val.title}
                  </h4>
                  <p className="text-xs text-ornate-muted mt-0.5 leading-relaxed">
                    {val.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const MobileContactView: React.FC = () => {
  return (
    <div className="px-4 pt-3 pb-6 space-y-5 bg-ornate-offwhite">
      <div className="bg-ornate-moss text-white rounded-3xl p-5 space-y-3">
        <p className="text-xs font-semibold text-ornate-gold">
          Vijayanagar Studio
        </p>
        <h2 className="font-serif text-xl">Speak With Our Design Team</h2>
        <p className="text-xs text-white/80 flex items-start gap-2 leading-relaxed">
          <MapPin size={14} className="text-ornate-gold shrink-0 mt-0.5" />
          148/E, 17th Main Rd, SBI Staff Colony, Hosahalli Extension, Stage 1,
          Vijayanagar, Bengaluru 560040
        </p>
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <a
            href={STUDIO_INFO.phoneHref}
            className="h-11 rounded-full bg-ornate-gold text-ornate-softblack text-xs font-semibold flex items-center justify-center gap-1.5"
          >
            <Phone size={14} />
            Call Now
          </a>
          <a
            href={`mailto:${STUDIO_INFO.email}`}
            className="h-11 rounded-full bg-white/15 text-white text-xs font-semibold flex items-center justify-center gap-1.5"
          >
            <Mail size={14} />
            Email Us
          </a>
        </div>
      </div>

      <div className="ornate-card p-5">
        <h3 className="font-serif text-lg text-ornate-charcoal mb-1">
          Send Project Details
        </h3>
        <p className="text-xs text-ornate-muted mb-4">
          Share your space requirements or furniture inquiry below.
        </p>
        <ContactForm />
      </div>
    </div>
  );
};

interface FaqItem {
  question: string;
  answer: string;
}

export const MobileFaqView: React.FC<{
  generalFaqs: FaqItem[];
  processFaqs: FaqItem[];
}> = ({ generalFaqs, processFaqs }) => (
  <div className="px-4 pt-3 pb-6 space-y-5 bg-ornate-offwhite">
    <div className="ornate-card p-4">
      <p className="text-xs font-semibold text-ornate-darkgold mb-1">
        General Questions
      </p>
      <h2 className="font-serif text-lg text-ornate-charcoal mb-3">
        Scope, Pricing &amp; Coverage
      </h2>
      <FaqAccordion faqs={generalFaqs} />
    </div>

    <div className="ornate-card p-4">
      <p className="text-xs font-semibold text-ornate-darkgold mb-1">
        Process Questions
      </p>
      <h2 className="font-serif text-lg text-ornate-charcoal mb-3">
        From Brief to Handover
      </h2>
      <FaqAccordion faqs={processFaqs} />
    </div>

    <Link
      to="/contact"
      className="h-12 rounded-full bg-ornate-moss text-white text-xs font-semibold flex items-center justify-center gap-2"
    >
      Still Have Questions? Contact Us
      <ArrowRight size={14} />
    </Link>
  </div>
);

export const MobileHelpView: React.FC = () => (
  <div className="px-4 pt-3 pb-6 space-y-4 bg-ornate-offwhite">
    <div className="ornate-card p-5 space-y-3">
      <p className="text-xs font-semibold text-ornate-darkgold">
        Client Support
      </p>
      <h2 className="font-serif text-xl text-ornate-charcoal">
        How Can We Help?
      </h2>
      <p className="text-xs text-ornate-muted leading-relaxed">
        Reach our Vijayanagar studio Monday to Saturday for consultations, floor plan reviews, or furniture orders.
      </p>
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        <a
          href={STUDIO_INFO.phoneHref}
          className="h-11 rounded-full bg-ornate-moss text-white text-xs font-semibold flex items-center justify-center gap-1.5"
        >
          <Phone size={14} />
          Call Team
        </a>
        <a
          href={`mailto:${STUDIO_INFO.email}`}
          className="h-11 rounded-full border border-ornate-border text-ornate-charcoal text-xs font-semibold flex items-center justify-center gap-1.5"
        >
          <Mail size={14} className="text-ornate-moss" />
          Email
        </a>
      </div>
    </div>

    <div className="ornate-card divide-y divide-ornate-border overflow-hidden">
      <Link to="/shop" className="p-4 flex items-center justify-between">
        <div>
          <p className="font-serif text-base text-ornate-charcoal">
            Furniture Store
          </p>
          <p className="text-xs text-ornate-muted">
            Browse curated collections
          </p>
        </div>
        <ArrowRight size={16} className="text-ornate-moss" />
      </Link>
      <Link to="/faq" className="p-4 flex items-center justify-between">
        <div>
          <p className="font-serif text-base text-ornate-charcoal">
            Common Questions
          </p>
          <p className="text-xs text-ornate-muted">
            Pricing, timelines &amp; approvals
          </p>
        </div>
        <ArrowRight size={16} className="text-ornate-moss" />
      </Link>
      <Link to="/contact" className="p-4 flex items-center justify-between">
        <div>
          <p className="font-serif text-base text-ornate-charcoal">
            Send Floor Plans
          </p>
          <p className="text-xs text-ornate-muted">
            Submit project details online
          </p>
        </div>
        <ArrowRight size={16} className="text-ornate-moss" />
      </Link>
    </div>
  </div>
);

export const MobileNotFoundView: React.FC<{ pathname: string }> = ({
  pathname,
}) => (
  <div className="px-4 pt-12 pb-6 bg-ornate-offwhite">
    <div className="ornate-card p-6 text-center space-y-4">
      <p className="text-xs font-semibold text-ornate-darkgold">
        Error 404
      </p>
      <h2 className="font-serif text-2xl text-ornate-charcoal">
        Page Not Found
      </h2>
      <p className="text-xs text-ornate-muted leading-relaxed">
        The route <code className="px-1.5 py-0.5 rounded bg-ornate-cream font-mono">{pathname}</code>{" "}
        could not be found.
      </p>
      <div className="flex flex-col gap-2.5 pt-2">
        <Link
          to="/"
          className="h-11 rounded-full bg-ornate-moss text-white text-xs font-semibold flex items-center justify-center gap-1.5"
        >
          <ArrowLeft size={14} />
          Return Home
        </Link>
        <Link
          to="/shop"
          className="h-11 rounded-full bg-ornate-gold text-ornate-softblack text-xs font-semibold flex items-center justify-center gap-1.5"
        >
          Browse Furniture Store
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  </div>
);
