
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  faqs: FaqItem[];
}

const FaqAccordion: React.FC<FaqAccordionProps> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div 
          key={index}
          className={`border-b border-ornate-gold/20 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'pb-6' : 'pb-0'}`}
        >
          <button
            className="flex justify-between items-center w-full py-6 text-left focus:outline-none"
            onClick={() => toggleAccordion(index)}
          >
            <span className="font-serif text-lg md:text-xl text-ornate-charcoal">{faq.question}</span>
            <ChevronDown 
              size={20} 
              className={`text-ornate-gold transition-transform duration-300 ${openIndex === index ? 'transform rotate-180' : ''}`} 
            />
          </button>
          <div 
            className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <p className="text-ornate-charcoal/80 leading-relaxed">{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FaqAccordion;
