import React from 'react';
import Hero from "@/components/ui-components/Hero";
import { Shield, Lock, Eye, UserCheck, Server, Bell } from 'lucide-react';

const privacyPoints = [
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Data Protection",
    description: "We implement industry-standard security measures to protect your personal information and ensure it remains confidential."
  },
  {
    icon: <Lock className="w-8 h-8" />,
    title: "Secure Transactions",
    description: "All financial transactions are encrypted and processed through secure payment gateways to protect your sensitive data."
  },
  {
    icon: <Eye className="w-8 h-8" />,
    title: "Information Usage",
    description: "We only collect essential information needed to provide our design services and improve your experience."
  },
  {
    icon: <UserCheck className="w-8 h-8" />,
    title: "User Rights",
    description: "You have full control over your personal data, including the right to access, modify, or delete your information."
  },
  {
    icon: <Server className="w-8 h-8" />,
    title: "Data Storage",
    description: "Your information is stored on secure servers with regular backups and strict access controls."
  },
  {
    icon: <Bell className="w-8 h-8" />,
    title: "Communication Preferences",
    description: "You can customize your communication preferences and opt-out of marketing materials at any time."
  }
];

const PrivacyAndPolicy = () => {
  return (
    <div className="bg-ornate-offwhite min-h-screen">
      <Hero
        title="Privacy & Policy"
        subtitle="Your Privacy Matters"
        description="We are committed to protecting your privacy and ensuring the security of your personal information."
        backgroundImage="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6"
        overlay={true}
      />

      {/* Key Privacy Points */}
      <section className="py-20">
        <div className="ornate-container">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
            <h2 className="ornate-subtitle mb-4">Our Commitment</h2>
            <h3 className="ornate-title mb-6">Privacy Highlights</h3>
            <p className="text-ornate-charcoal/80 leading-relaxed">
              Understanding how your information is handled is important to us. Here are the key points of our privacy policy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {privacyPoints.map((point, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="text-ornate-gold mb-6">{point.icon}</div>
                <h4 className="font-serif text-xl mb-4 text-ornate-charcoal">{point.title}</h4>
                <p className="text-ornate-charcoal/70 leading-relaxed">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Policy Section */}
      <section className="py-20 bg-white">
        <div className="ornate-container">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg">
              <h2 className="font-serif text-3xl text-ornate-charcoal mb-8">Detailed Privacy Policy</h2>
              
              <div className="space-y-8">
                <div className="animate-fade-in">
                  <h3 className="font-serif text-2xl text-ornate-charcoal mb-4">Information We Collect</h3>
                  <p className="text-ornate-charcoal/80 leading-relaxed mb-4">
                    We collect information that you provide directly to us, including your name, email address, phone number, and any other information you choose to provide when using our services or contacting us.
                  </p>
                </div>

                <div className="animate-fade-in" style={{ animationDelay: '150ms' }}>
                  <h3 className="font-serif text-2xl text-ornate-charcoal mb-4">How We Use Your Information</h3>
                  <p className="text-ornate-charcoal/80 leading-relaxed mb-4">
                    We use the information we collect to provide, maintain, and improve our services, communicate with you about our services, and personalize your experience with our design solutions.
                  </p>
                </div>

                <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
                  <h3 className="font-serif text-2xl text-ornate-charcoal mb-4">Information Sharing</h3>
                  <p className="text-ornate-charcoal/80 leading-relaxed mb-4">
                    We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website or servicing you.
                  </p>
                </div>

                <div className="animate-fade-in" style={{ animationDelay: '450ms' }}>
                  <h3 className="font-serif text-2xl text-ornate-charcoal mb-4">Your Rights</h3>
                  <p className="text-ornate-charcoal/80 leading-relaxed mb-4">
                    You have the right to access, correct, or delete your personal information at any time. You can also object to our processing of your personal information or request that we transfer your data to another service provider.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-ornate-charcoal text-white">
        <div className="ornate-container">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <h2 className="text-ornate-gold text-sm uppercase tracking-wider font-display mb-4">Questions?</h2>
            <h3 className="text-4xl md:text-5xl font-serif mb-6">Contact Our Privacy Team</h3>
            <p className="text-white/80 leading-relaxed mb-8">
              If you have any questions about our privacy policy or how we handle your data, please don't hesitate to reach out.
            </p>
            <a 
              href="/contact" 
              className="inline-block px-8 py-4 bg-ornate-gold text-white font-display uppercase tracking-wider text-sm transition-transform hover:scale-105"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyAndPolicy;