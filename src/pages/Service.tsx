import { useEffect } from 'react';
import Hero from '@/components/ui-components/Hero';
import ServicesSection from '@/components/sections/ServicesSection';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';



const serviceImages = [
  {
    url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace",
    title: "Living Room Design",
    description: "Create your perfect living space"
  },
  {
    url: "https://images.unsplash.com/photo-1616137466211-f939a420be84",
    title: "Kitchen Design",
    description: "Modern kitchen solutions"
  },
  {
    url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0",
    title: "Bedroom Design",
    description: "Peaceful bedroom retreats"
  },
  {
    url: "https://images.unsplash.com/photo-1616046229478-9901c5536a45",
    title: "Office Design",
    description: "Professional workspace solutions"
  }
];

const ServiceImageCard = ({ image, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative rounded-lg shadow-lg overflow-hidden group"
      whileHover={{ scale: 1.03 }}
    >
      <motion.img
        src={image.url}
        alt={image.title}
        className="w-full h-[300px] object-cover rounded-lg"
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.3 }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent rounded-lg flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <motion.h4 
          className="text-2xl font-serif mb-2 text-white"
          initial={{ y: 10 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {image.title}
        </motion.h4>
        <motion.p 
          className="text-white/90"
          initial={{ y: 10 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {image.description}
        </motion.p>
      </div>
    </motion.div>
  );
};

const Service = () => {
  useEffect(() => {
    // Smooth scroll for the entire page
    if (typeof window !== 'undefined') {
      const html = document.querySelector('html');
      html.style.scrollBehavior = 'smooth';
      return () => {
        html.style.scrollBehavior = 'auto';
      };
    }
  }, []);

  const [sectionRef, sectionInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="bg-ornate-offwhite">
      <Hero
        title="What We Offer"
        subtitle="Our Services"
        description="We provide a full range of interior design services tailored to meet your unique needs, from concept development to final styling."
        backgroundImage="https://img.freepik.com/free-photo/gray-sofa-brown-living-room-with-copy-space_43614-954.jpg"
        overlay={true}
      />

      <section 
        ref={sectionRef}
        className="mt-12 overflow-hidden"
      >
        <div className="ornate-container">
          <motion.div 
            className="text-center max-w-3xl mx-auto "
            initial={{ opacity: 0, y: 20 }}
            animate={sectionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="ornate-subtitle mb-4">Our Expertise</h2>
            <h3 className="ornate-title mb-6">Featured Projects</h3>
            <p className="text-ornate-charcoal/80 leading-relaxed mb-6">
              Explore our portfolio of carefully curated interior design projects that showcase our commitment to excellence and attention to detail.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-2"
            initial="hidden"
            animate={sectionInView ? "visible" : "hidden"}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.15
                }
              }
            }}
          >
            {serviceImages.map((image, index) => (
              <ServiceImageCard key={index} image={image} index={index} />
            ))}
          </motion.div>
        </div>
      </section>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <ServicesSection />
      </motion.div>
    </div>
  );
};

export default Service;