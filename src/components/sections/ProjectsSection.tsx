
import React from 'react';
import ProjectCard from '../ui-components/ProjectCard';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const projects = [
  {
    title: 'Modern Minimalist Apartment',
    category: 'Residential',
    description: 'A sleek, contemporary design with clean lines and a neutral palette, bringing light and space to urban living.',
    image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=1200&auto=format&fit=crop',
    link: '#'
  },
  {
    title: 'Luxury Coastal Villa',
    category: 'Residential',
    description: 'Elegant seaside retreat combining modern luxury with coastal elements for relaxed, sophisticated living.',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop',
    link: '#'
  },
  {
    title: 'Boutique Hotel Lobby',
    category: 'Commercial',
    description: 'A striking entrance space that creates memorable first impressions through texture, color, and bespoke furnishings.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop',
    link: '#'
  },
  {
    title: 'Artisanal Coffee Shop',
    category: 'Commercial',
    description: 'Warm, inviting space blending industrial elements with natural materials for an authentic cafe experience.',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200&auto=format&fit=crop',
    link: '#'
  },
  {
    title: 'Executive Office Suite',
    category: 'Commercial',
    description: 'Sophisticated workspace designed for productivity, comfort and impressive client interactions.',
    image: 'https://images.unsplash.com/photo-1594732832278-abd644401426?q=80&w=1200&auto=format&fit=crop',
    link: '#'
  }
];

const ProjectsSection: React.FC = () => {
  return (
    <section id="projects" className="py-20 bg-white">
      <div className="ornate-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="ornate-subtitle mb-4 animate-fade-in">Our Portfolio</h2>
          <h3 className="ornate-title mb-6 animate-fade-in">Spaces That Inspire</h3>
          <p className="text-ornate-charcoal/80 leading-relaxed animate-fade-in">
            Explore our collection of thoughtfully designed spaces that reflect our commitment to beauty, functionality, and attention to detail.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {projects.map((project, index) => (
            <ProjectCard 
              key={index}
              title={project.title}
              category={project.category}
              description={project.description}
              image={project.image}
              link={project.link}
              index={index}
            />
          ))}
        </div>
        
        <div className="text-center">
          <Link to="/projects" className="ornate-btn-primary inline-flex items-center group">
            View All Projects <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
