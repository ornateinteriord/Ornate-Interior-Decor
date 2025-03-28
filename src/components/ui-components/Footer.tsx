
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ornate-charcoal text-white pt-16 pb-8">
      <div className="ornate-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Company Info */}
          <div className="space-y-6">
            <h3 className="font-serif text-2xl text-white">
              <span className="text-ornate-gold">Ornate</span> Interior Decor
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Crafting beautiful spaces that inspire, elevate, and transform the way you live.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-ornate-gold transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-ornate-gold transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-ornate-gold transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="font-display text-sm uppercase tracking-wider text-ornate-gold">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-white transition-colors">Our Services</Link></li>
              <li><Link to="/projects" className="text-gray-300 hover:text-white transition-colors">Projects</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          {/* Support */}
          <div className="space-y-6">
            <h4 className="font-display text-sm uppercase tracking-wider text-ornate-gold">Support</h4>
            <ul className="space-y-3">
              <li><Link to="/faq" className="text-gray-300 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/help" className="text-gray-300 hover:text-white transition-colors">Help & Support</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-300 hover:text-white transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="font-display text-sm uppercase tracking-wider text-ornate-gold">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={20} className="text-ornate-gold mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-300">123 Design Street, Creative City, Country</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="text-ornate-gold mr-3 flex-shrink-0" />
                <a href="mailto:info@ornateinterior.com" className="text-gray-300 hover:text-white transition-colors">
                  info@ornateinterior.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="text-ornate-gold mr-3 flex-shrink-0" />
                <a href="tel:+1234567890" className="text-gray-300 hover:text-white transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-gray-400 text-sm flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {currentYear} Ornate Interior Decor. All rights reserved.</p>
          <p className="mt-4 md:mt-0">Designed with elegance for sophisticated spaces.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
