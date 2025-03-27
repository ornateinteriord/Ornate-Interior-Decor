
import React from 'react';
import ServiceCard from '../ui-components/ServiceCard';
import { Palette, Building2, LayoutDashboard, Home, Ruler, Sofa } from 'lucide-react';

const services = [
  {
    title: 'Residential Design',
    description: 'Transform your home into a personalized sanctuary that reflects your style, needs, and aspirations with our comprehensive residential design services.',
    icon: <Home size={48} />,
    link: '#'
  },
  {
    title: 'Commercial Design',
    description: 'Create impactful commercial spaces that enhance brand experience, boost productivity, and leave lasting impressions on clients and employees alike.',
    icon: <Building2 size={48} />,
    link: '#'
  },
  {
    title: 'Space Planning',
    description: 'Maximize functionality and flow with thoughtful space planning that optimizes your floor plan and creates harmonious, purposeful environments.',
    icon: <LayoutDashboard size={48} />,
    link: '#'
  },
  {
    title: 'Custom Furniture',
    description: 'Commission bespoke furniture pieces crafted specifically for your space, ensuring perfect fit, function, and unique design expression.',
    icon: <Sofa size={48} />,
    link: '#'
  },
  {
    title: 'Color Consultation',
    description: 'Transform any space with expert color strategy that creates atmosphere, defines areas, and complements your overall design concept.',
    icon: <Palette size={48} />,
    link: '#'
  },
  {
    title: 'Project Management',
    description: 'Experience stress-free renovations with our comprehensive project management services, coordinating all aspects from concept to completion.',
    icon: <Ruler size={48} />,
    link: '#'
  }
];

const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="py-20 bg-ornate-offwhite">
      <div className="ornate-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="ornate-subtitle mb-4 animate-fade-in">Our Services</h2>
          <h3 className="ornate-title mb-6 animate-fade-in">What We Offer</h3>
          <p className="text-ornate-charcoal/80 leading-relaxed animate-fade-in">
            We provide a full range of interior design services tailored to meet your unique needs, from concept development to final styling.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
              icon={service.icon}
              link={service.link}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
