
import React from 'react';
import Hero from '../components/ui-components/Hero';
import ContactForm from '../components/ui-components/ContactForm';
import { MapPin, Mail, Phone, Clock, Instagram, Facebook, Twitter } from 'lucide-react';

const Contact = () => {
  return (
    <div >
      <Hero
        title="Get In Touch"
        subtitle="Contact Us"
        description="We'd love to hear from you. Reach out to discuss your project, ask questions, or schedule a consultation."
        backgroundImage="https://www.pixelstalk.net/wp-content/uploads/images1/Orange-sofa-room-design-wallpaper-hd-free-download.jpg"
        overlay={true}
      />
      
      <section className="py-20 bg-white">
        <div className="ornate-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="animate-fade-in">
              <h2 className="ornate-subtitle mb-4">Contact Information</h2>
              <h3 className="ornate-title mb-6">We're Here To Help</h3>
              
              <p className="text-ornate-charcoal/80 mb-10 leading-relaxed">
                Whether you're looking to renovate your home, design a commercial space, or simply have questions about our services, we're here to help. Reach out to us to schedule a consultation or learn more about how we can transform your space.
              </p>
              
              <div className="space-y-8 mb-10">
                <div className="flex items-start">
                  <MapPin size={24} className="text-ornate-gold mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-serif text-lg mb-2 text-ornate-charcoal">Our Location</h4>
                    <address className="text-ornate-charcoal/80 not-italic">
                      148/E, 17th Main Rd,SBI Staff Colony,<br />
                      Hosahalli Extension, stage 1,Vijayanagar<br />
                      Bengaluru,Karnataka 560040
                    </address>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail size={24} className="text-ornate-gold mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-serif text-lg mb-2 text-ornate-charcoal">Email Us</h4>
                    <a href="https://mail.google.com/mail/?view=cm&fs=1&to=ornateinteriord@gmail.com" className="text-ornate-charcoal/80 hover:text-ornate-gold transition-colors">
                      ornateinteriord@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone size={24} className="text-ornate-gold mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-serif text-lg mb-2 text-ornate-charcoal">Call Us</h4>
                    <a href="tel:+919845044424" className="text-ornate-charcoal/80 hover:text-ornate-gold transition-colors">
                      9845044424
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock size={24} className="text-ornate-gold mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-serif text-lg mb-2 text-ornate-charcoal">Office Hours</h4>
                    <p className="text-ornate-charcoal/80">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-serif text-lg mb-4 text-ornate-charcoal">Connect With Us</h4>
                <div className="flex space-x-4">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-3 border border-ornate-gold/20 text-ornate-gold hover:bg-ornate-gold hover:text-white transition-colors rounded-full">
                    <Instagram size={20} />
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-3 border border-ornate-gold/20 text-ornate-gold hover:bg-ornate-gold hover:text-white transition-colors rounded-full">
                    <Facebook size={20} />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-3 border border-ornate-gold/20 text-ornate-gold hover:bg-ornate-gold hover:text-white transition-colors rounded-full">
                    <Twitter size={20} />
                  </a>
                </div>
              </div>
            </div>
            
            <div className="bg-ornate-offwhite p-8 md:p-10 shadow-sm animate-fade-in ">
              <h3 className="font-serif text-2xl mb-6 text-ornate-charcoal">Send Us a Message</h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
      
      <section className="h-[500px] w-full">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.041401723144!2d77.53727429999999!3d12.9692026!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3dde6dcd1763%3A0xfd2c0043be1b3327!2sOrnate%20Interior%20Decor%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1743154910866!5m2!1sen!2sin" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="Ornate Interior Decor location"
        ></iframe>
      </section>
    </div>
  );
};

export default Contact;
