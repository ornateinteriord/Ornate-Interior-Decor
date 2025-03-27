
import HomeHero from '../components/sections/HomeHero';
import AboutSection from '../components/sections/AboutSection';
import ServicesSection from '../components/sections/ServicesSection';
import ProjectsSection from '../components/sections/ProjectsSection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import { MapPin, Mail, Phone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="pt-0">
      <HomeHero />
      
      <AboutSection />
      
      <ServicesSection />
      
      <ProjectsSection />
      
      <TestimonialsSection />
      
      {/* Contact Preview Section */}
      <section className="py-20 bg-white">
        <div className="ornate-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="ornate-subtitle mb-4">Get In Touch</h2>
              <h3 className="ornate-title mb-6">Let's Create Something Beautiful Together</h3>
              
              <p className="text-ornate-charcoal/80 mb-8 leading-relaxed">
                Whether you're looking to renovate your home, design a commercial space, or simply have questions about our services, we're here to help. Reach out to us to schedule a consultation or learn more about how we can transform your space.
              </p>
              
              <ul className="space-y-6 mb-8">
                <li className="flex items-start">
                  <MapPin size={20} className="text-ornate-gold mr-3 mt-1 flex-shrink-0" />
                  <span className="text-ornate-charcoal/80">123 Design Street, Creative City, Country</span>
                </li>
                <li className="flex items-center">
                  <Mail size={20} className="text-ornate-gold mr-3 flex-shrink-0" />
                  <a href="mailto:info@ornateinterior.com" className="text-ornate-charcoal/80 hover:text-ornate-gold transition-colors">
                    info@ornateinterior.com
                  </a>
                </li>
                <li className="flex items-center">
                  <Phone size={20} className="text-ornate-gold mr-3 flex-shrink-0" />
                  <a href="tel:+1234567890" className="text-ornate-charcoal/80 hover:text-ornate-gold transition-colors">
                    +1 (234) 567-890
                  </a>
                </li>
              </ul>
              
              <Link to="/contact" className="ornate-btn-primary inline-flex items-center group">
                Contact Us <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="relative">
              <div className="relative z-10 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop" 
                  alt="Interior design consultation" 
                  className="w-full h-auto rounded-sm animate-fade-in"
                />
              </div>
              <div className="absolute -top-8 -left-8 w-64 h-64 border-8 border-ornate-gold/10 z-0"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
