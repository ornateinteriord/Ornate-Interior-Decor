
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon, link, index }) => {
  return (
    <div 
      className="bg-white p-8 border border-ornate-gold/10 hover:border-ornate-gold/30 shadow-sm hover:shadow-md transition-all duration-300 group animate-fade-in"
      style={{ 
        animationDelay: `${index * 150}ms`,
      }}
    >
      <div className="text-ornate-gold mb-6 transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>
      
      <h3 className="font-serif text-xl mb-4 text-ornate-charcoal">{title}</h3>
      
      <p className="text-ornate-charcoal/70 mb-6 leading-relaxed">{description}</p>
      
      <Link 
        to={link} 
        className="inline-flex items-center text-ornate-gold font-display text-sm uppercase tracking-wider"
      >
        Learn More <ArrowRight size={16} className="ml-2 transform transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
};

export default ServiceCard;
