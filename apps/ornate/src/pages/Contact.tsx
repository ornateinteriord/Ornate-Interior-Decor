import React from "react";
import PageHeader from "../components/ui-components/PageHeader";
import ContactForm from "../components/ui-components/ContactForm";
import Seo from "../components/seo/Seo";
import { MobileContactView } from "../components/mobile/MobileInfoViews";
import { STUDIO_INFO } from "@/lib/seo";
import { MapPin, Mail, Phone, Clock, Instagram, Facebook, Twitter } from "lucide-react";

const Contact = () => {
  return (
    <div>
      <Seo
        title="Contact Us"
        description="Contact Ornate Interior Decor in Vijayanagar, Bengaluru. Visit our studio, call +91 98450 44424, or send your interior project details."
        path="/contact"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
      />

      <div className="md:hidden">
        <MobileContactView />
      </div>

      <div className="hidden md:block">
        <PageHeader
          title="Contact Our Studio"
          subtitle="Get In Touch"
          description="Reach out to discuss residential or commercial interior design, request a site visit in Bengaluru, or clarify project timelines."
          breadcrumbs={[
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]}
        />

      <section className="py-16 bg-white">
        <div className="ornate-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <span className="ornate-pill-label mb-3">Studio Details</span>
              <h2 className="ornate-title mb-5">Visit Us in Vijayanagar</h2>

              <p className="text-ornate-muted mb-8 leading-relaxed">
                Whether you are furnishing a new apartment, renovating a family home, or planning an office interior, our team welcomes scheduled studio visits and phone consultations.
              </p>

              <div className="space-y-6 mb-10">
                <div className="flex items-start gap-4">
                  <span className="w-10 h-10 rounded-xl bg-ornate-sage flex items-center justify-center text-ornate-moss shrink-0">
                    <MapPin size={19} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-sans font-semibold text-base mb-1 text-ornate-charcoal">
                      Studio Address
                    </h3>
                    <address className="text-ornate-muted text-sm not-italic leading-relaxed">
                      148/E, 17th Main Rd, SBI Staff Colony,
                      <br />
                      Hosahalli Extension, Stage 1, Vijayanagar,
                      <br />
                      Bengaluru, Karnataka 560040
                    </address>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="w-10 h-10 rounded-xl bg-ornate-sage flex items-center justify-center text-ornate-moss shrink-0">
                    <Mail size={19} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-sans font-semibold text-base mb-1 text-ornate-charcoal">
                      Email
                    </h3>
                    <a
                      href={`mailto:${STUDIO_INFO.email}`}
                      className="text-sm text-ornate-charcoal font-medium hover:text-ornate-darkgold transition-colors"
                    >
                      {STUDIO_INFO.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="w-10 h-10 rounded-xl bg-ornate-sage flex items-center justify-center text-ornate-moss shrink-0">
                    <Phone size={19} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-sans font-semibold text-base mb-1 text-ornate-charcoal">
                      Phone
                    </h3>
                    <a
                      href={STUDIO_INFO.phoneHref}
                      className="text-sm text-ornate-charcoal font-medium hover:text-ornate-darkgold transition-colors"
                    >
                      {STUDIO_INFO.phoneDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="w-10 h-10 rounded-xl bg-ornate-sage flex items-center justify-center text-ornate-moss shrink-0">
                    <Clock size={19} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-sans font-semibold text-base mb-1 text-ornate-charcoal">
                      Office Hours
                    </h3>
                    <p className="text-sm text-ornate-muted leading-relaxed">
                      Monday - Friday: 9:00 AM - 6:00 PM
                      <br />
                      Saturday: 10:00 AM - 4:00 PM
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-sans font-semibold text-sm text-ornate-charcoal mb-3">
                  Social Channels
                </h3>
                <div className="flex space-x-2.5">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Ornate Interior Decor on Instagram"
                    className="w-10 h-10 rounded-full border border-ornate-border text-ornate-moss hover:bg-ornate-moss hover:text-white hover:border-ornate-moss flex items-center justify-center transition-colors"
                  >
                    <Instagram size={18} aria-hidden="true" />
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Ornate Interior Decor on Facebook"
                    className="w-10 h-10 rounded-full border border-ornate-border text-ornate-moss hover:bg-ornate-moss hover:text-white hover:border-ornate-moss flex items-center justify-center transition-colors"
                  >
                    <Facebook size={18} aria-hidden="true" />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Ornate Interior Decor on X (Twitter)"
                    className="w-10 h-10 rounded-full border border-ornate-border text-ornate-moss hover:bg-ornate-moss hover:text-white hover:border-ornate-moss flex items-center justify-center transition-colors"
                  >
                    <Twitter size={18} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-ornate-offwhite p-8 md:p-10 rounded-3xl border border-ornate-border">
              <h2 className="font-serif text-2xl mb-2 text-ornate-charcoal">
                Send Project Details
              </h2>
              <p className="text-sm text-ornate-muted mb-6">
                Fill in your inquiry below to prepare a structured brief for our design team.
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <section className="h-[460px] w-full border-t border-ornate-gold/20">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.041401723144!2d77.53727429999999!3d12.9692026!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3dde6dcd1763%3A0xfd2c0043be1b3327!2sOrnate%20Interior%20Decor%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1743154910866!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Map showing Ornate Interior Decor in Vijayanagar, Bengaluru"
        />
      </section>
      </div>
    </div>
  );
};

export default Contact;
