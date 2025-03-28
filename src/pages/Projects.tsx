
import Hero from "@/components/ui-components/Hero";
import ProjectCard from "@/components/ui-components/ProjectCard";


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

const Projects = () => {
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

      {/* Portfolio Grid Section */}
      <section className="py-20 bg-white">
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