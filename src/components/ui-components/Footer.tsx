import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from "lucide-react";
import { STUDIO_INFO } from "@/lib/seo";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ornate-softblack text-white pt-16 pb-8 border-t border-ornate-gold/20">
      <div className="ornate-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-6">
            <Link to="/" className="inline-block" aria-label="Ornate Interior Decor home">
              <img
                src="/Ornate%20Interior%20Decor%20Logo.png"
                alt="Ornate Interior Decor"
                className="h-14 md:h-16 w-auto object-contain brightness-0 invert opacity-95"
              />
            </Link>
            <p className="text-gray-300 leading-relaxed text-sm">
              Residential and commercial interior design, spatial planning, and turnkey execution in Bengaluru.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ornate Interior Decor on Instagram"
                className="p-2.5 border border-gray-600 text-gray-300 hover:border-ornate-gold hover:text-ornate-gold transition-colors"
              >
                <Instagram size={18} aria-hidden="true" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ornate Interior Decor on Facebook"
                className="p-2.5 border border-gray-600 text-gray-300 hover:border-ornate-gold hover:text-ornate-gold transition-colors"
              >
                <Facebook size={18} aria-hidden="true" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ornate Interior Decor on X (Twitter)"
                className="p-2.5 border border-gray-600 text-gray-300 hover:border-ornate-gold hover:text-ornate-gold transition-colors"
              >
                <Twitter size={18} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="font-display text-sm uppercase tracking-wider text-ornate-gold">
              Quick Links
            </h2>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-ornate-gold hover:text-white transition-colors font-medium">
                  Shop Furnitures
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-white transition-colors">
                  Our Services
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-gray-300 hover:text-white transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h2 className="font-display text-sm uppercase tracking-wider text-ornate-gold">
              Support &amp; Legal
            </h2>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-300 hover:text-white transition-colors">
                  Help &amp; Support
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="text-gray-300 hover:text-white transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h2 className="font-display text-sm uppercase tracking-wider text-ornate-gold">
              Contact Us
            </h2>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start">
                <MapPin size={18} className="text-ornate-gold mr-3 mt-1 flex-shrink-0" aria-hidden="true" />
                <address className="text-gray-300 not-italic leading-relaxed">
                  148/E, 17th Main Rd, SBI Staff Colony,
                  <br />
                  Hosahalli Extension, Stage 1, Vijayanagar,
                  <br />
                  Bengaluru, Karnataka 560040
                </address>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-ornate-gold mr-3 flex-shrink-0" aria-hidden="true" />
                <a
                  href={`mailto:${STUDIO_INFO.email}`}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {STUDIO_INFO.email}
                </a>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-ornate-gold mr-3 flex-shrink-0" aria-hidden="true" />
                <a
                  href={STUDIO_INFO.phoneHref}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {STUDIO_INFO.phoneDisplay}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-gray-400 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {currentYear} {STUDIO_INFO.name}. All rights reserved.</p>
          <p>Vijayanagar, Bengaluru, Karnataka</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
