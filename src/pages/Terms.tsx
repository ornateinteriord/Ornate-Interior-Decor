import React, { useState } from 'react';
import Hero from "@/components/ui-components/Hero";
import { ChevronDown, Scroll, Shield, Scale, Clock, Paintbrush as Paint, Pencil, DollarSign } from 'lucide-react';

interface TermSection {
  id: number;
  icon: React.ReactNode;
  title: string;
  content: string;
}

const termSections: TermSection[] = [
  {
    id: 1,
    icon: <Scroll className="w-6 h-6" />,
    title: "Acceptance of Terms",
    content: "By accessing and using our interior design services, you acknowledge and agree to be bound by these Terms and Conditions. These terms constitute a legally binding agreement between you and Ornate Interiors."
  },
  {
    id: 2,
    icon: <Paint className="w-6 h-6" />,
    title: "Design Services",
    content: "Our design services include but are not limited to interior design consultation, space planning, furniture selection, color schemes, and project management. The scope of services will be clearly defined in a separate service agreement tailored to your specific project."
  },
  {
    id: 3,
    icon: <DollarSign className="w-6 h-6" />,
    title: "Pricing and Payment",
    content: "Project fees are determined based on scope, complexity, and timeline. A deposit of 50% is required to commence work, with the remaining balance due according to the payment schedule outlined in your service agreement. All prices are subject to change with prior notice."
  },
  {
    id: 4,
    icon: <Clock className="w-6 h-6" />,
    title: "Project Timeline",
    content: "While we strive to complete projects within agreed timeframes, certain factors such as product availability, shipping delays, or contractor schedules may impact completion dates. We will communicate any potential delays promptly and work to minimize their impact."
  },
  {
    id: 5,
    icon: <Pencil className="w-6 h-6" />,
    title: "Revisions and Changes",
    content: "Your service agreement includes a specified number of revision rounds. Additional revisions may incur extra charges. Significant changes to the project scope may require a revised agreement and additional fees."
  },
  {
    id: 6,
    icon: <Shield className="w-6 h-6" />,
    title: "Intellectual Property",
    content: "All design concepts, drawings, and specifications remain the intellectual property of Ornate Interiors until full payment is received. You may not reproduce or use these materials for any purpose other than the specific project without written consent."
  },
  {
    id: 7,
    icon: <Scale className="w-6 h-6" />,
    title: "Liability and Insurance",
    content: "While we maintain professional liability insurance, we are not responsible for the performance of third-party contractors or products. We recommend clients maintain appropriate insurance coverage for their property during renovation or installation work."
  }
];

const Terms = () => {
  const [openSection, setOpenSection] = useState<number | null>(null);

  const toggleSection = (id: number) => {
    setOpenSection(openSection === id ? null : id);
  };

  // Split terms into left and right columns
  const leftTerms = termSections.slice(0, 4);
  const rightTerms = termSections.slice(4);

  return (
    <div className="bg-ornate-offwhite min-h-screen">
      <Hero
        title="Terms & Conditions"
        subtitle="Our Agreement"
        description="Please review our terms and conditions carefully to understand our practices and your obligations."
        backgroundImage="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6"
        overlay={true}
      />

      {/* Main Terms Section */}
      <section className="py-20">
        <div className="ornate-container">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
            <h2 className="ornate-subtitle mb-4">Legal Framework</h2>
            <h3 className="ornate-title mb-6">Understanding Our Terms</h3>
            <p className="text-ornate-charcoal/80 leading-relaxed">
              Our terms and conditions ensure a clear understanding between us and our valued clients. Please read each section carefully.
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column (4 items) */}
            <div className="space-y-4">
              {leftTerms.map((section) => (
                <div
                  key={section.id}
                  className="bg-white rounded-lg shadow-sm animate-fade-in"
                  style={{ animationDelay: `${section.id * 100}ms` }}
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors duration-300 hover:bg-ornate-gold/5 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-ornate-gold">{section.icon}</div>
                      <h4 className="font-serif text-xl text-ornate-charcoal">{section.title}</h4>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-ornate-gold transition-transform duration-300 ${
                        openSection === section.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openSection === section.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-6 pb-5 text-ornate-charcoal/80 leading-relaxed">
                      {section.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column (3 items) */}
            <div className="space-y-4">
              {rightTerms.map((section) => (
                <div
                  key={section.id}
                  className="bg-white rounded-lg shadow-sm animate-fade-in"
                  style={{ animationDelay: `${section.id * 100}ms` }}
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors duration-300 hover:bg-ornate-gold/5 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-ornate-gold">{section.icon}</div>
                      <h4 className="font-serif text-xl text-ornate-charcoal">{section.title}</h4>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-ornate-gold transition-transform duration-300 ${
                        openSection === section.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openSection === section.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-6 pb-5 text-ornate-charcoal/80 leading-relaxed">
                      {section.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-ornate-charcoal text-white">
        <div className="ornate-container">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <h2 className="text-ornate-gold text-sm uppercase tracking-wider font-display mb-4">Ready to Begin?</h2>
            <h3 className="text-4xl md:text-5xl font-serif mb-6">Start Your Design Journey</h3>
            <p className="text-white/80 leading-relaxed mb-8">
              If you have any questions about our terms or would like to discuss your project, we're here to help.
            </p>
            <a 
              href="/contact" 
              className="inline-block px-8 py-4 bg-ornate-gold text-white font-display uppercase tracking-wider text-sm transition-transform hover:scale-105"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Terms;