
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { toast } from 'sonner';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success('Message sent successfully!', {
        description: "We'll get back to you as soon as possible.",
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setLoading(false);
    }, 1500);
  };

  const inputClasses = "w-full px-4 py-3 bg-white border border-ornate-gold/20 focus:border-ornate-gold focus:ring-1 focus:ring-ornate-gold/30 outline-none transition duration-200";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block mb-2 font-display text-sm uppercase text-ornate-charcoal">
            Full Name <span className="text-ornate-gold">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={inputClasses}
            required
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block mb-2 font-display text-sm uppercase text-ornate-charcoal">
            Email Address <span className="text-ornate-gold">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={inputClasses}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="phone" className="block mb-2 font-display text-sm uppercase text-ornate-charcoal">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>
        
        <div>
          <label htmlFor="subject" className="block mb-2 font-display text-sm uppercase text-ornate-charcoal">
            Subject <span className="text-ornate-gold">*</span>
          </label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className={inputClasses}
            required
          >
            <option value="">Select a subject</option>
            <option value="General Inquiry">General Inquiry</option>
            <option value="Residential Design">Residential Design</option>
            <option value="Commercial Design">Commercial Design</option>
            <option value="Consultation">Consultation</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
      
      <div>
        <label htmlFor="message" className="block mb-2 font-display text-sm uppercase text-ornate-charcoal">
          Your Message <span className="text-ornate-gold">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={6}
          className={inputClasses}
          required
        ></textarea>
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="ornate-btn-primary flex items-center group disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? 'Sending...' : 'Send Message'}
        <Send size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
      </button>
    </form>
  );
};

export default ContactForm;
