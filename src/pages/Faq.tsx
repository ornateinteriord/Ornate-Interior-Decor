
import React from 'react';
import Hero from '../components/ui-components/Hero';
import FaqAccordion from '../components/ui-components/FaqAccordion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Faq = () => {
  const generalFaqs = [
    {
      question: "What services does Ornate Interior Decor offer?",
      answer: "We offer a comprehensive range of interior design services, including residential and commercial design, space planning, color consultation, custom furniture design, project management, and more. Our team can help with everything from full renovations to styling existing spaces."
    },
    {
      question: "How much does it cost to hire an interior designer?",
      answer: "Our design fees vary depending on the scope, scale, and specific requirements of your project. We offer several different service packages and fee structures to accommodate different budgets and needs. During our initial consultation, we'll discuss your project in detail and provide a transparent cost estimate."
    },
    {
      question: "How long does the design process typically take?",
      answer: "The timeline for each project varies based on its scope and complexity. Small projects might take a few weeks, while larger renovations could span several months. During our initial consultation, we'll provide a detailed timeline specific to your project, including design development, procurement, and installation phases."
    },
    {
      question: "Do you work with clients who are located outside your city?",
      answer: "Yes, we offer remote design services for clients located outside our immediate area. Through a combination of video consultations, digital presentations, and occasional on-site visits when necessary, we can successfully manage projects from a distance."
    }
  ];

  const processFaqs = [
    {
      question: "What happens during the initial consultation?",
      answer: "The initial consultation is an opportunity for us to get to know you, understand your needs and preferences, and assess your space. We'll discuss your vision, budget, timeline, and answer any questions you might have. This meeting helps us determine if we're a good fit for each other and how we can best serve your needs."
    },
    {
      question: "How involved will I be in the design process?",
      answer: "Our design process is collaborative, and we value your input throughout. After understanding your vision, we'll present design concepts and recommendations for your feedback. You'll have the opportunity to review and approve all major decisions before we proceed with implementation."
    },
    {
      question: "What if I don't like the initial design concept?",
      answer: "Our goal is your satisfaction. If you're not completely happy with the initial design concepts, we'll revise them based on your feedback until we achieve a direction you love. This is why we emphasize clear communication and collaboration from the start."
    },
    {
      question: "Do you handle purchasing of furniture and materials?",
      answer: "Yes, we offer procurement services as part of our full-service design packages. We handle sourcing, ordering, tracking, and coordinating delivery of all specified items, saving you time and ensuring everything arrives as expected. We also have access to trade-only vendors and can often secure preferred pricing."
    }
  ];

  return (
    <div >
      <Hero
        title="Frequently Asked Questions"
        subtitle="FAQ"
        description="Find answers to common questions about our services, process, and approach to interior design."
        backgroundImage="https://img.freepik.com/premium-photo/grey-living-room-interior-with-two-armchairs-shelf-with-decoration_780608-8480.jpg?semt=ais_hybrid"
        overlay={true}
      />
      
      <section className="py-20 bg-white">
        <div className="ornate-container">
          <div className="max-w-4xl mx-auto">
            <div className="mb-16">
              <h2 className="ornate-subtitle mb-4 animate-fade-in">General Questions</h2>
              <h3 className="ornate-title mb-12 animate-fade-in">About Our Services</h3>
              
              <FaqAccordion faqs={generalFaqs} />
            </div>
            
            <div className="mb-16">
              <h2 className="ornate-subtitle mb-4 animate-fade-in">Process Questions</h2>
              <h3 className="ornate-title mb-12 animate-fade-in">Working With Us</h3>
              
              <FaqAccordion faqs={processFaqs} />
            </div>
            
            <div className="text-center p-8 bg-ornate-cream animate-fade-in">
              <h3 className="font-serif text-2xl mb-4 text-ornate-charcoal">Still Have Questions?</h3>
              <p className="text-ornate-charcoal/80 mb-6 leading-relaxed">
                We're here to help. Contact us for more information or to schedule a consultation.
              </p>
              <Link to="/contact" className="ornate-btn-primary inline-flex items-center group">
                Contact Us <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Faq;
