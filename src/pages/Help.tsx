
import React from 'react';
import Hero from '../components/ui-components/Hero';
import { ArrowRight, BookOpen, MessageCircle, Video, FileText, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Help = () => {
  const resources = [
    {
      icon: <BookOpen size={32} className="text-ornate-gold" />,
      title: 'Design Guides',
      description: 'Access our collection of detailed design guides covering everything from color theory to space planning principles.',
      link: '#'
    },
    {
      icon: <MessageCircle size={32} className="text-ornate-gold" />,
      title: 'Chat Support',
      description: 'Connect with our team in real-time for immediate assistance with your design questions or concerns.',
      link: '#'
    },
    {
      icon: <Video size={32} className="text-ornate-gold" />,
      title: 'Video Tutorials',
      description: 'Watch our design professionals demonstrate techniques, trends, and tips through easy-to-follow video content.',
      link: '#'
    },
    {
      icon: <FileText size={32} className="text-ornate-gold" />,
      title: 'Documentation',
      description: 'Browse our comprehensive documentation covering all aspects of our services, processes, and policies.',
      link: '#'
    }
  ];

  return (
    <div >
      <Hero
        title="Help & Support"
        subtitle="We're Here For You"
        description="Find the assistance you need through our comprehensive support resources and direct communication channels."
        backgroundImage="https://www.pixelstalk.net/wp-content/uploads/images1/Green-room-wallpaper-1920x1200.jpg"
        overlay={true}
      />
      
      {/* Resources Section */}
      <section className="py-20 bg-white">
        <div className="ornate-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="ornate-subtitle mb-4 animate-fade-in">Support Resources</h2>
            <h3 className="ornate-title mb-6 animate-fade-in">How Can We Help You?</h3>
            <p className="text-ornate-charcoal/80 leading-relaxed animate-fade-in">
              We offer multiple ways to get the support you need, from self-service resources to personalized assistance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {resources.map((resource, index) => (
              <div 
                key={index}
                className="p-8 border border-ornate-gold/10 hover:border-ornate-gold/30 transition-all duration-300 text-center group animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-block mb-6 transition-transform duration-300 group-hover:scale-110">
                  {resource.icon}
                </div>
                <h4 className="font-serif text-xl mb-4 text-ornate-charcoal">{resource.title}</h4>
                <p className="text-ornate-charcoal/70 mb-6 leading-relaxed">
                  {resource.description}
                </p>
                <a 
                  href={resource.link} 
                  className="inline-flex items-center text-ornate-gold font-display text-sm uppercase tracking-wider"
                >
                  Access Now <ArrowRight size={16} className="ml-2 transform transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Support Section */}
      <section className="py-20 bg-ornate-cream">
        <div className="ornate-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in">
              <h2 className="ornate-subtitle mb-4">Get Personalized Help</h2>
              <h3 className="ornate-title mb-6">Contact Our Support Team</h3>
              
              <p className="text-ornate-charcoal/80 mb-8 leading-relaxed">
                Can't find what you're looking for in our resources? Our dedicated support team is ready to assist you with personalized help for your specific questions or concerns.
              </p>
              
              <div className="bg-white p-8 border border-ornate-gold/10 mb-8">
                <div className="flex items-center mb-6">
                  <Mail size={24} className="text-ornate-gold mr-4 flex-shrink-0" />
                  <div>
                    <h4 className="font-serif text-lg text-ornate-charcoal">Email Support</h4>
                    <p className="text-ornate-charcoal/70">Response within 24 hours</p>
                  </div>
                </div>
                <a 
                  href="mailto:support@ornateinterior.com" 
                  className="ornate-btn-primary w-full flex justify-center items-center group"
                >
                  Email Us <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
              
              <Link 
                to="/contact" 
                className="ornate-btn-outline w-full flex justify-center items-center group"
              >
                All Contact Options <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="bg-white p-8 shadow-sm animate-fade-in">
              <h3 className="font-serif text-2xl mb-6 text-ornate-charcoal">Frequently Asked Questions</h3>
              
              <div className="space-y-6">
                {[
                  { 
                    question: "How do I schedule a consultation?", 
                    answer: "You can schedule a consultation by contacting us through our website, calling our office, or sending an email to info@ornateinterior.com." 
                  },
                  { 
                    question: "What information should I prepare before our first meeting?", 
                    answer: "It's helpful to gather inspiration images, measurements of your space, and notes about your preferences, budget, and timeline before our initial consultation." 
                  },
                  { 
                    question: "How can I access my project documents?", 
                    answer: "All project documents are shared through our client portal. You should have received login credentials via email when your project was initiated." 
                  }
                ].map((item, index) => (
                  <div key={index} className="border-b border-ornate-gold/10 pb-6">
                    <h4 className="font-serif text-lg mb-2 text-ornate-charcoal">{item.question}</h4>
                    <p className="text-ornate-charcoal/70">{item.answer}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <Link to="/faq" className="inline-flex items-center text-ornate-gold font-display text-sm uppercase tracking-wider group">
                  View All FAQs <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Help;
