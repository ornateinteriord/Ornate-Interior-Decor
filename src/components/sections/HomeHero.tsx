import React from "react";
import Hero from "../ui-components/Hero";

const HomeHero: React.FC = () => {
  return (
    <Hero
      variant="full"
      title="Thoughtful Interior Architecture & Custom Craft"
      subtitle="Ornate Interior Decor · Bengaluru"
      description="We design and execute residential and commercial interiors shaped around natural light, durable materials, and practical daily living."
      backgroundImage="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2400&auto=format&fit=crop"
      buttonText="Shop Now"
      buttonLink="/shop"
      secondaryButtonText="Explore Projects"
      secondaryButtonLink="/projects"
      hasScrollIndicator={true}
    />
  );
};

export default HomeHero;
