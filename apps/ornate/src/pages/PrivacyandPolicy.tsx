import React from "react";
import { Link } from "react-router-dom";
import { Shield, Lock, Eye, UserCheck, Server, Bell, ArrowRight } from "lucide-react";
import PageHeader from "@/components/ui-components/PageHeader";
import Seo from "@/components/seo/Seo";
import { STUDIO_INFO } from "@/lib/seo";

const privacyPoints = [
  {
    icon: <Eye className="w-7 h-7" />,
    title: "Minimal Collection",
    description:
      "We only ask for contact and project details you choose to share when requesting a consultation or quote.",
  },
  {
    icon: <Shield className="w-7 h-7" />,
    title: "Purpose-Bound Use",
    description:
      "Your name, phone number, email address, and floor plans are used solely to respond to your inquiry and deliver design services.",
  },
  {
    icon: <Lock className="w-7 h-7" />,
    title: "No Data Resale",
    description:
      "We never sell, rent, or trade client contact information or project documents with third-party marketers.",
  },
  {
    icon: <Server className="w-7 h-7" />,
    title: "Controlled Access",
    description:
      "Project drawings and contact records are restricted to staff and trades directly involved in executing your work.",
  },
  {
    icon: <UserCheck className="w-7 h-7" />,
    title: "Access & Deletion Rights",
    description:
      "You may request a copy, correction, or deletion of your inquiry details at any time by writing to our studio.",
  },
  {
    icon: <Bell className="w-7 h-7" />,
    title: "Communication Control",
    description:
      "You only receive follow-ups related to your active inquiry or project unless you explicitly ask for updates.",
  },
];

const PrivacyAndPolicy = () => {
  return (
    <div className="bg-ornate-offwhite min-h-screen">
      <Seo
        title="Privacy Policy"
        description="Read the Ornate Interior Decor privacy policy explaining how client contact information and project plans are handled."
        path="/privacy-policy"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy-policy" },
        ]}
      />

      <div className="hidden md:block">
        <PageHeader
          title="Privacy Policy"
          subtitle="Data Practices"
          description="How Ornate Interior Decor collects, uses, and protects your contact details and project documents."
          breadcrumbs={[
            { name: "Home", path: "/" },
            { name: "Privacy Policy", path: "/privacy-policy" },
          ]}
        />
      </div>

      <section className="py-6 md:py-20">
        <div className="ornate-container">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p className="ornate-subtitle mb-3">Overview</p>
            <h2 className="ornate-title mb-5">Key Privacy Commitments</h2>
            <p className="text-ornate-charcoal/80 leading-relaxed">
              Clear practices regarding any information shared with our Bengaluru design studio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {privacyPoints.map((point) => (
              <article
                key={point.title}
                className="ornate-card p-7"
              >
                <div className="w-11 h-11 rounded-xl bg-ornate-sage flex items-center justify-center text-ornate-moss mb-5" aria-hidden="true">
                  {point.icon}
                </div>
                <h3 className="font-serif text-xl mb-2.5 text-ornate-charcoal">
                  {point.title}
                </h3>
                <p className="text-ornate-muted text-sm leading-relaxed">
                  {point.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="ornate-container">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="font-serif text-3xl text-ornate-charcoal">
              Detailed Policy
            </h2>

            <div>
              <h3 className="font-serif text-2xl text-ornate-charcoal mb-3">
                1. Information You Provide
              </h3>
              <p className="text-ornate-charcoal/80 leading-relaxed">
                When you contact {STUDIO_INFO.name} via email, phone, or our contact page, we receive the details you submit, such as your name, email address, phone number, property location, and floor plans.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-2xl text-ornate-charcoal mb-3">
                2. How We Use Information
              </h3>
              <p className="text-ornate-charcoal/80 leading-relaxed">
                Submitted details are used to schedule consultations, prepare design proposals and estimates, coordinate site visits, and manage contracted interior work.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-2xl text-ornate-charcoal mb-3">
                3. Third-Party Services
              </h3>
              <p className="text-ornate-charcoal/80 leading-relaxed">
                Our Contact page embeds Google Maps to show our Vijayanagar studio location. Embedded map services may process standard technical request headers according to Google's privacy policy. We do not embed third-party advertising trackers.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-2xl text-ornate-charcoal mb-3">
                4. Your Rights &amp; Contact
              </h3>
              <p className="text-ornate-charcoal/80 leading-relaxed">
                You can ask us to update or delete your contact records at any time by emailing{" "}
                <a
                  href={`mailto:${STUDIO_INFO.email}`}
                  className="text-ornate-darkgold underline hover:text-ornate-charcoal"
                >
                  {STUDIO_INFO.email}
                </a>{" "}
                or calling {STUDIO_INFO.phoneDisplay}.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-ornate-moss text-white">
        <div className="ornate-container">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-ornate-gold text-xs font-semibold mb-3">
              Privacy Inquiries
            </span>
            <h2 className="text-3xl md:text-5xl font-serif mb-5">
              Questions About Your Data?
            </h2>
            <p className="text-white/80 leading-relaxed mb-8">
              Write directly to our studio or review our terms of service.
            </p>
            <div className="flex flex-wrap justify-center gap-3.5">
              <Link
                to="/contact"
                className="ornate-btn-accent inline-flex items-center"
              >
                Contact Studio
                <ArrowRight size={16} className="ml-2" aria-hidden="true" />
              </Link>
              <Link
                to="/terms-and-conditions"
                className="ornate-btn border border-white/35 text-white hover:bg-white hover:text-ornate-softblack"
              >
                Terms &amp; Conditions
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyAndPolicy;