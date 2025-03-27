
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Testimonial {
  name: string;
  title: string;
  quote: string;
  image: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: 'Emma Thompson',
    title: 'Homeowner',
    quote: 'Working with Ornate Interior Decor was an absolute pleasure. They transformed our home into a beautiful, functional space that perfectly reflects our style and needs. Their attention to detail and commitment to quality is unmatched.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&auto=format&fit=crop',
    rating: 5
  },
  {
    name: 'Michael Chen',
    title: 'Restaurant Owner',
    quote: 'The team at Ornate exceeded our expectations. They designed a restaurant space that not only looks stunning but also functions perfectly for our staff and customers. The atmosphere they created has been a significant factor in our success.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&auto=format&fit=crop',
    rating: 5
  },
  {
    name: 'Sarah Johnson',
    title: 'Real Estate Developer',
    quote: "We've collaborated with Ornate on multiple projects, and they consistently deliver exceptional results. Their designs add significant value to our properties and always impress potential buyers. A true pleasure to work with.",
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop',
    rating: 5
  }
];

const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        size={16} 
        className={i < rating ? 'text-ornate-gold fill-ornate-gold' : 'text-gray-300'} 
      />
    ));
  };

  return (
    <section className="py-20 bg-ornate-cream">
      <div className="ornate-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="ornate-subtitle mb-4 animate-fade-in">Testimonials</h2>
          <h3 className="ornate-title mb-6 animate-fade-in">What Our Clients Say</h3>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-10 p-8 bg-white shadow-sm border border-ornate-gold/10">
            <div className="w-full md:w-1/3 flex-shrink-0">
              <div className="relative aspect-square overflow-hidden rounded-full border-4 border-ornate-gold/20 mx-auto" style={{ maxWidth: '220px' }}>
                <img 
                  src={testimonials[currentIndex].image} 
                  alt={testimonials[currentIndex].name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="w-full md:w-2/3">
              <div className="flex mb-4">
                {renderStars(testimonials[currentIndex].rating)}
              </div>
              
              <blockquote className="font-serif text-xl italic text-ornate-charcoal mb-6">
                "{testimonials[currentIndex].quote}"
              </blockquote>
              
              <div>
                <p className="font-serif text-lg text-ornate-charcoal">{testimonials[currentIndex].name}</p>
                <p className="text-ornate-gold">{testimonials[currentIndex].title}</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-8 space-x-4">
            <button 
              onClick={goToPrevious}
              className="p-2 rounded-full border border-ornate-gold/20 text-ornate-gold hover:bg-ornate-gold hover:text-white transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>
            
            <button 
              onClick={goToNext}
              className="p-2 rounded-full border border-ornate-gold/20 text-ornate-gold hover:bg-ornate-gold hover:text-white transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
