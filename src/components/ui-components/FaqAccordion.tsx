import React, { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  faqs: FaqItem[];
}

const FaqAccordion: React.FC<FaqAccordionProps> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const groupId = useId();

  const toggleAccordion = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="divide-y divide-ornate-gold/20 border-t border-b border-ornate-gold/20">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        const buttonId = `${groupId}-btn-${index}`;
        const panelId = `${groupId}-panel-${index}`;

        return (
          <div key={faq.question} className="transition-colors duration-200">
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex justify-between items-center w-full py-5 text-left gap-4"
                onClick={() => toggleAccordion(index)}
              >
                <span className="font-serif text-lg md:text-xl text-ornate-charcoal">
                  {faq.question}
                </span>
                <ChevronDown
                  size={20}
                  aria-hidden="true"
                  className={`text-ornate-darkgold flex-shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="pb-6"
            >
              <p className="text-ornate-charcoal/80 leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FaqAccordion;
