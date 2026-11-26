import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Mail, Phone, ArrowRight, ArrowUp } from "lucide-react";
import Seo from "../components/seo/Seo";
import HomeHero from "../components/sections/HomeHero";
import FeaturedCatalogSection from "../components/sections/FeaturedCatalogSection";
import AboutSection from "../components/sections/AboutSection";
import ServicesSection from "../components/sections/ServicesSection";
import ProjectsSection from "../components/sections/ProjectsSection";
import ProcessSection from "../components/sections/ProcessSection";
import MobileHomeView from "../components/mobile/MobileHomeView";
import { STUDIO_INFO } from "@/lib/seo";

const Index = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="pt-0">
      <Seo
        title="Ornate Interior Decor | Interior Design Studio in Bengaluru"
        exactTitle
        description="Ornate Interior Decor designs and executes residential and commercial interiors in Vijayanagar, Bengaluru, from space planning to custom furniture."
        path="/"
      />

      <div className="md:hidden">
        <MobileHomeView />
      </div>

      <div className="hidden md:block">
        <HomeHero />
        <FeaturedCatalogSection />
        <AboutSection />
        <ServicesSection tone="dark" />
        <ProjectsSection />
        <ProcessSection />

        <section className="py-20 bg-ornate-cream border-t border-ornate-border">
          <div className="ornate-container">
            <div className="ornate-card p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
              <div>
                <span className="ornate-pill-label mb-3">Visit or Write</span>
                <h2 className="ornate-title mb-5">
                  Discuss Your Upcoming Space
                </h2>

                <p className="text-ornate-muted mb-7 leading-relaxed">
                  Planning a new apartment interior, villa renovation, or workspace fit-out in Bengaluru? Visit our studio in Vijayanagar or share your floor plan for an initial scope discussion.
                </p>

                <ul className="space-y-4 mb-8 text-sm">
                  <li className="flex items-start gap-3">
                    <MapPin
                      size={19}
                      className="text-ornate-moss mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <address className="text-ornate-charcoal/85 not-italic leading-relaxed">
                      148/E, 17th Main Rd, SBI Staff Colony, Hosahalli Extension, Stage 1, Vijayanagar, Bengaluru, Karnataka 560040
                    </address>
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail
                      size={19}
                      className="text-ornate-moss flex-shrink-0"
                      aria-hidden="true"
                    />
                    <a
                      href={`mailto:${STUDIO_INFO.email}`}
                      className="text-ornate-charcoal font-medium hover:text-ornate-darkgold transition-colors"
                    >
                      {STUDIO_INFO.email}
                    </a>
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone
                      size={19}
                      className="text-ornate-moss flex-shrink-0"
                      aria-hidden="true"
                    />
                    <a
                      href={STUDIO_INFO.phoneHref}
                      className="text-ornate-charcoal font-medium hover:text-ornate-darkgold transition-colors"
                    >
                      {STUDIO_INFO.phoneDisplay}
                    </a>
                  </li>
                </ul>

                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/contact"
                    className="ornate-btn-primary inline-flex items-center group"
                  >
                    Book a Consultation
                    <ArrowRight
                      size={16}
                      className="ml-2 group-hover:translate-x-1 transition-transform"
                      aria-hidden="true"
                    />
                  </Link>
                  <Link
                    to="/help"
                    className="ornate-btn-outline inline-flex items-center"
                  >
                    Prepare for Your Visit
                  </Link>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop"
                  alt="Bright architectural studio table prepared for interior material and layout consultations"
                  loading="lazy"
                  className="w-full h-auto object-cover transition-transform duration-700 ease-out hover:scale-105"
                />
              </div>
            </div>
          </div>
        </section>

        <button
          type="button"
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 z-30 w-11 h-11 rounded-full bg-ornate-moss text-white border border-white/15 shadow-lg flex items-center justify-center transition-all duration-300 ${
            showScrollButton
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6 pointer-events-none"
          } hover:bg-ornate-darkgold`}
          aria-label="Scroll to top"
        >
          <ArrowUp size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default Index;
