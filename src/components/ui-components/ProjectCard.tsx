
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  category: string;
  description: string;
  image: string;
  link: string;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  title, 
  category, 
  description, 
  image, 
  link,
  index 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`group relative overflow-hidden ${index % 3 === 0 ? 'lg:col-span-2' : 'lg:col-span-1'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        transitionDelay: `${index * 100}ms`,
      }}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ornate-charcoal/80 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 transform transition-transform duration-500 ease-out">
        <p className="ornate-subtitle mb-2 opacity-0 transform translate-y-4 transition-all duration-500 delay-100 group-hover:opacity-100 group-hover:translate-y-0">
          {category}
        </p>
        <h3 className="font-serif text-xl md:text-2xl text-white mb-2 opacity-0 transform translate-y-4 transition-all duration-500 delay-200 group-hover:opacity-100 group-hover:translate-y-0">
          {title}
        </h3>
        <p className="text-white/80 max-w-md mb-4 opacity-0 transform translate-y-4 transition-all duration-500 delay-300 group-hover:opacity-100 group-hover:translate-y-0">
          {description}
        </p>
        <a 
          href={link}
          className="inline-flex items-center text-ornate-gold font-display text-sm uppercase tracking-wider opacity-0 transform translate-y-4 transition-all duration-500 delay-400 group-hover:opacity-100 group-hover:translate-y-0"
        >
          View Project <ArrowRight size={16} className="ml-2 transform transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  );
};

export default ProjectCard;
