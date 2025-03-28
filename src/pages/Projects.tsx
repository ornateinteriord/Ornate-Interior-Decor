import React, { useState } from 'react';
import Hero from "@/components/ui-components/Hero";
import ProjectCard from "@/components/ui-components/ProjectCard";
import { ArrowRight, CheckCircle, Clock } from 'lucide-react';

const featuredProjects = [
  {
    title: 'Luxury Penthouse Suite',
    category: 'Residential',
    description: 'A stunning penthouse featuring panoramic views and bespoke furniture pieces that blend modern luxury with comfort.',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
    link: '#',
  },
  {
    title: 'Contemporary Art Gallery',
    category: 'Commercial',
    description: 'Minimalist space designed to showcase art pieces while maintaining a perfect balance of light and shadow.',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d',
    link: '#',
  },
  {
    title: 'Bohemian Restaurant',
    category: 'Hospitality',
    description: 'An eclectic dining space that combines vintage elements with modern comfort for an unforgettable experience.',
    image: 'https://ansainteriors.com/wp-content/uploads/2019/01/luxury-dining-room-interior-design-in-delhi-attached-with-drawing-room.jpg',
    link: '#',
  }
];

const portfolioProjects = [
  {
    title: 'Urban Loft Conversion',
    category: 'Residential',
    description: 'Industrial elements meet modern comfort in this transformed warehouse space.',
    image: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154',
    link: '#',
  },
  {
    title: 'Coastal Retreat',
    category: 'Residential',
    description: 'Serene beachfront villa with panoramic ocean views and natural materials.',
    image: 'https://w0.peakpx.com/wallpaper/954/760/HD-wallpaper-luxurious-bathroom-design-stylish-interior-brown-blue-bathroom-modern-interior-design.jpg',
    link: '#',
  },
  {
    title: 'Mountain Lodge',
    category: 'Hospitality',
    description: 'Rustic luxury meets contemporary design in this mountain getaway.',
    image: 'https://thumbs.dreamstime.com/b/cozy-mountain-cabin-interior-fireplace-window-view-344739712.jpg',
    link: '#',
  },
  {
    title: 'Tech Startup Office',
    category: 'Commercial',
    description: 'Dynamic workspace promoting creativity and collaboration.',
    image: 'https://blogs.airbrickinfra.com/wp-content/uploads/2024/03/Office-Interior-Design.jpg',
    link: '#',
  },
  {
    title: 'Wellness Spa',
    category: 'Commercial',
    description: 'Tranquil environment designed for relaxation and rejuvenation.',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
    link: '#',
  }
];

const completedProjects = [
  {
    title: 'Modern Villa Renovation',
    category: 'Residential',
    description: 'Complete transformation of a traditional villa into a modern masterpiece.',
    image: 'https://cdn.pixabay.com/photo/2022/09/21/01/46/house-7469172_640.jpg',
    link: '#',
  },
  {
    title: 'Boutique Hotel Suites',
    category: 'Hospitality',
    description: 'Luxurious suite designs for an exclusive boutique hotel.',
    image: 'https://media.istockphoto.com/id/1311423416/photo/home-interior-background-with-green-sofa-table-and-decor-in-living-room.jpg?b=1&s=612x612&w=0&k=20&c=wqx-QZ0SZcjj4Vb7-qwNgaKf2azNntdH0sAERoBM03s=',
    link: '#',
  },
  {
    title: 'Corporate Headquarters',
    category: 'Commercial',
    description: 'Modern office design promoting collaboration and innovation.',
    image: 'https://www.spectruminteriors.co.in/wp-content/uploads/2020/12/Office-Interior-12.jpeg',
    link: '#',
  }
];

const ongoingProjects = [
  {
    title: 'Eco-Friendly Apartments',
    category: 'Residential',
    description: 'Sustainable living spaces with modern amenities.',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
    progress: 75,
    link: '#',
  },
  {
    title: 'Heritage Restaurant',
    category: 'Hospitality',
    description: 'Restoration and modernization of a historic restaurant.',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d',
    progress: 60,
    link: '#',
  }
];

const Projects = () => {
  const [showAllCompleted, setShowAllCompleted] = useState(false);
  const [showAllOngoing, setShowAllOngoing] = useState(false);
  const [activeTab, setActiveTab] = useState('completed');

  return (
    <div className="bg-ornate-offwhite min-h-screen">
      <Hero
        title="Spaces That Inspire"
        subtitle="Our Portfolio"
        description="Explore our collection of thoughtfully designed spaces that reflect our commitment to beauty, functionality, and attention to detail."
        backgroundImage="https://www.duroply.in/blog/wp-content/uploads/2024/03/Duroply-Feature-Images-for-blogs-1.jpg"
        overlay={true}
      />

      {/* Featured Projects Section */}
      <section className="mt-12">
        <div className="ornate-container">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
            <h2 className="ornate-subtitle mb-4">Featured Work</h2>
            <h3 className="ornate-title mb-6">Signature Projects</h3>
            <p className="text-ornate-charcoal/80 leading-relaxed">
              Discover our most innovative and inspiring interior design projects that showcase our expertise and creativity.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-2">
            {featuredProjects.map((project, index) => (
              <ProjectCard
                key={index}
                {...project}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Combined Projects Section with Tabs */}
      <section className="mt-20 bg-white ">
        <div className="ornate-container">
          <div className="text-center max-w-3xl mx-auto mb-10 animate-fade-in">
            <h2 className="ornate-subtitle mb-4">Our Projects</h2>
            <h3 className="ornate-title mb-6">Project Showcase</h3>
            <p className="text-ornate-charcoal/80 leading-relaxed mb-6">
              Explore our completed masterpieces and witness our ongoing transformations.
            </p>

            {/* Tabs */}
            <div className="flex justify-center gap-8 mb-6">
              <button
                onClick={() => setActiveTab('completed')}
                className={`flex items-center gap-2 pb-2 border-b-2 transition-all duration-300 ${
                  activeTab === 'completed'
                    ? 'border-ornate-gold text-ornate-gold'
                    : 'border-transparent text-ornate-charcoal/60 hover:text-ornate-charcoal'
                }`}
              >
                <CheckCircle className="w-5 h-5" />
                Completed Projects
              </button>
              <button
                onClick={() => setActiveTab('ongoing')}
                className={`flex items-center gap-2 pb-2 border-b-2 transition-all duration-300 ${
                  activeTab === 'ongoing'
                    ? 'border-ornate-gold text-ornate-gold'
                    : 'border-transparent text-ornate-charcoal/60 hover:text-ornate-charcoal'
                }`}
              >
                <Clock className="w-5 h-5" />
                Ongoing Projects
              </button>
            </div>
          </div>

          {/* Completed Projects Content */}
          <div className={`transition-all duration-500 ${activeTab === 'completed' ? 'opacity-100' : 'opacity-0 hidden'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {completedProjects.slice(0, showAllCompleted ? undefined : 3).map((project, index) => (
                <div 
                  key={index}
                  className="group relative overflow-hidden rounded-lg shadow-lg transform transition-all duration-500 hover:-translate-y-2 animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="relative aspect-[4/3]">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="ornate-subtitle mb-2">{project.category}</div>
                    <h4 className="text-xl font-serif mb-2">{project.title}</h4>
                    <p className="text-white/80 text-sm mb-4">{project.description}</p>
                    <a href={project.link} className="inline-flex items-center text-ornate-gold hover:text-white transition-colors duration-300">
                      View Details <ArrowRight className="ml-2 w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
            
            {completedProjects.length > 3 && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setShowAllCompleted(!showAllCompleted)}
                  className="ornate-btn-primary"
                >
                  {showAllCompleted ? 'Show Less' : 'View More'} 
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Ongoing Projects Content */}
          <div className={`transition-all duration-500 ${activeTab === 'ongoing' ? 'opacity-100' : 'opacity-0 hidden'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {ongoingProjects.slice(0, showAllOngoing ? undefined : 2).map((project, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-lg overflow-hidden shadow-lg transform transition-all duration-500 hover:-translate-y-2 animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="relative aspect-video">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <div className="text-center text-white">
                        <p className="text-3xl font-serif mb-2">{project.progress}%</p>
                        <p className="text-sm uppercase tracking-wider">Completed</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="ornate-subtitle text-sm mb-2">{project.category}</div>
                    <h4 className="text-xl font-serif text-ornate-charcoal mb-2">{project.title}</h4>
                    <p className="text-ornate-charcoal/70 mb-4">{project.description}</p>
                    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="absolute inset-y-0 left-0 bg-ornate-gold transition-all duration-1000 ease-out"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {ongoingProjects.length > 2 && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setShowAllOngoing(!showAllOngoing)}
                  className="ornate-btn-primary"
                >
                  {showAllOngoing ? 'Show Less' : 'View More'} 
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Portfolio Grid Section */}
      <section className="py-20 bg-ornate-offwhite">
        <div className="ornate-container">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
            <h2 className="ornate-subtitle mb-4">Complete Portfolio</h2>
            <h3 className="ornate-title mb-6">All Projects</h3>
            <p className="text-ornate-charcoal/80 leading-relaxed">
              Browse through our diverse collection of projects spanning residential, commercial, and hospitality sectors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioProjects.map((project, index) => (
              <ProjectCard
                key={index}
                {...project}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-20 bg-ornate-charcoal text-white">
        <div className="ornate-container">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <h2 className="text-ornate-gold text-sm uppercase tracking-wider font-display mb-4">Start Your Project</h2>
            <h3 className="text-4xl md:text-5xl font-serif mb-6">Ready to Transform Your Space?</h3>
            <p className="text-white/80 leading-relaxed mb-8">
              Let's collaborate to create a space that reflects your vision and exceeds your expectations.
            </p>
            <a 
              href="/contact" 
              className="inline-block px-8 py-4 bg-ornate-gold text-white font-display uppercase tracking-wider text-sm transition-transform hover:scale-105"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;