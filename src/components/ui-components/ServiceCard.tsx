import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  icon,
  link,
}) => {
  return (
    <article className="bg-white p-8 border border-ornate-gold/20 hover:border-ornate-gold/60 shadow-sm transition-colors duration-300 group flex flex-col justify-between">
      <div>
        <div className="text-ornate-darkgold mb-6" aria-hidden="true">
          {icon}
        </div>
        <h3 className="font-serif text-xl mb-4 text-ornate-charcoal">{title}</h3>
        <p className="text-ornate-charcoal/75 mb-6 leading-relaxed text-sm">
          {description}
        </p>
      </div>

      <Link
        to={link}
        className="inline-flex items-center text-ornate-darkgold hover:text-ornate-charcoal font-display text-xs uppercase tracking-wider transition-colors"
      >
        Explore Service
        <ArrowRight
          size={15}
          className="ml-2 transform transition-transform group-hover:translate-x-1"
          aria-hidden="true"
        />
      </Link>
    </article>
  );
};

export default ServiceCard;
