import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { STUDIO_INFO } from "@/lib/seo";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ornate-softblack text-white border-t border-white/10">
      {/* Studio Consultation Strip */}
      <div className="bg-ornate-moss border-b border-white/10">
        <div className="ornate-container py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ornate-gold mb-1">
              Visit Our Bengaluru Studio
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl text-white">
              Ready to furnish or redesign your space?
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/shop"
              className="ornate-btn-accent gap-2"
            >
              Browse Store <ArrowRight size={15} />
            </Link>
            <Link
              to="/contact"
              className="ornate-btn border border-white/30 text-white hover:bg-white hover:text-ornate-softblack"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      </div>

      <div className="ornate-container pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-5">
            <Link to="/" className="inline-block" aria-label="Ornate Interior Decor home">
              <img
                src="/Ornate%20Interior%20Decor%20Logo.png"
                alt="Ornate Interior Decor"
                className="h-12 md:h-14 w-auto object-contain brightness-0 invert opacity-95"
              />
            </Link>
            <p className="text-white/75 leading-relaxed text-sm">
              Residential and commercial interior architecture, custom millwork, and curated furniture delivered from Vijayanagar, Bengaluru.
            </p>
            <div className="flex space-x-2.5">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ornate Interior Decor on Instagram"
                className="w-10 h-10 rounded-full border border-white/20 text-white/80 hover:border-ornate-gold hover:text-ornate-gold flex items-center justify-center transition-colors"
              >
                <Instagram size={17} aria-hidden="true" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ornate Interior Decor on Facebook"
                className="w-10 h-10 rounded-full border border-white/20 text-white/80 hover:border-ornate-gold hover:text-ornate-gold flex items-center justify-center transition-colors"
              >
                <Facebook size={17} aria-hidden="true" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ornate Interior Decor on X (Twitter)"
                className="w-10 h-10 rounded-full border border-white/20 text-white/80 hover:border-ornate-gold hover:text-ornate-gold flex items-center justify-center transition-colors"
              >
                <Twitter size={17} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-sans text-xs font-semibold uppercase tracking-wider text-ornate-gold">
              Explore
            </h2>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/shop" className="text-white hover:text-ornate-gold transition-colors font-medium">
                  Furniture Store
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-white/75 hover:text-white transition-colors">
                  Design Services
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-white/75 hover:text-white transition-colors">
                  Portfolio Projects
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white/75 hover:text-white transition-colors">
                  About Studio
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/75 hover:text-white transition-colors">
                  Contact &amp; Visit
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="font-sans text-xs font-semibold uppercase tracking-wider text-ornate-gold">
              Customer Care
            </h2>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/account" className="text-white/75 hover:text-white transition-colors">
                  My Orders &amp; Account
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="text-white/75 hover:text-white transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-white/75 hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-white/75 hover:text-white transition-colors">
                  Help &amp; Preparation Guide
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-white/75 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="text-white/75 hover:text-white transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="font-sans text-xs font-semibold uppercase tracking-wider text-ornate-gold">
              Bengaluru Studio
            </h2>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start">
                <MapPin size={17} className="text-ornate-gold mr-3 mt-1 flex-shrink-0" aria-hidden="true" />
                <address className="text-white/75 not-italic leading-relaxed">
                  148/E, 17th Main Rd, SBI Staff Colony,
                  <br />
                  Hosahalli Extension, Stage 1, Vijayanagar,
                  <br />
                  Bengaluru, Karnataka 560040
                </address>
              </li>
              <li className="flex items-center">
                <Mail size={17} className="text-ornate-gold mr-3 flex-shrink-0" aria-hidden="true" />
                <a
                  href={`mailto:${STUDIO_INFO.email}`}
                  className="text-white/75 hover:text-white transition-colors"
                >
                  {STUDIO_INFO.email}
                </a>
              </li>
              <li className="flex items-center">
                <Phone size={17} className="text-ornate-gold mr-3 flex-shrink-0" aria-hidden="true" />
                <a
                  href={STUDIO_INFO.phoneHref}
                  className="text-white/75 hover:text-white transition-colors"
                >
                  {STUDIO_INFO.phoneDisplay}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-7 text-white/55 text-xs flex flex-col md:flex-row justify-between items-center gap-3">
          <p>&copy; {currentYear} {STUDIO_INFO.name}. All rights reserved.</p>
          <p>Mon–Fri 9 AM – 6 PM · Sat 10 AM – 4 PM · Vijayanagar, Bengaluru</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
