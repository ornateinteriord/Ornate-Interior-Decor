
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutSection: React.FC = () => {
  return (
    <section className="py-20 bg-ornate-cream">
      <div className="ornate-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          <div className="relative">
            <div className="relative z-10 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200&auto=format&fit=crop" 
                alt="Interior designer working" 
                className="w-full h-auto rounded-sm animate-fade-in-right"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 w-64 h-64 border-8 border-white z-0"></div>
          </div>
          
          <div className="animate-fade-in-left">
            <h2 className="ornate-subtitle mb-4">About Us</h2>
            <h3 className="ornate-title mb-6">Creating Beautiful Spaces Since 2010</h3>
            
            <p className="text-ornate-charcoal/80 mb-6 leading-relaxed">
              Ornate Interior Decor is a premier interior design firm dedicated to creating exceptional spaces that inspire and elevate everyday living. With over a decade of experience, our team of skilled designers combines creativity, functionality, and aesthetic sensibility to transform your vision into reality.
            </p>
            
            <p className="text-ornate-charcoal/80 mb-8 leading-relaxed">
              We believe that great design should not only be beautiful but also reflect the personality and lifestyle of those who inhabit the space. Our approach is collaborative, thoughtful, and detail-oriented, ensuring that every project is unique and tailored to our clients' needs.
            </p>
            
            <Link to="/about" className="ornate-btn-outline group">
              Learn More About Us <ArrowRight size={16} className="ml-2 inline-block group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
