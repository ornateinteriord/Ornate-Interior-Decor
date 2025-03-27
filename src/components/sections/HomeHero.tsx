
import React from 'react';
import Hero from '../ui-components/Hero';

const HomeHero: React.FC = () => {
  return (
    <Hero
      title="Elevate Your Space With Exceptional Design"
      subtitle="Welcome to Ornate Interior Decor"
      description="We transform ordinary spaces into extraordinary experiences through thoughtful design, exquisite craftsmanship, and attention to detail."
      backgroundImage="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2400&auto=format&fit=crop"
      buttonText="Discover Our Work"
      buttonLink="/projects"
      hasScrollIndicator={true}
    />
  );
};

export default HomeHero;
