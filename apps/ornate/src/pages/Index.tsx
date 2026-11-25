import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Mail, Phone, ArrowRight, ArrowUp } from "lucide-react";
import Seo from "../components/seo/Seo";
import HomeHero from "../components/sections/HomeHero";
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
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <ProcessSection />

      <section className="py-20 bg-white">
        <div className="ornate-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="ornate-subtitle mb-3">Visit or Write</p>
              <h2 className="ornate-title mb-6">
                Discuss Your Upcoming Space
              </h2>

              <p className="text-ornate-charcoal/80 mb-8 leading-relaxed">
                Planning a new apartment interior, villa renovation, or workspace fit-out in Bengaluru? Visit our studio in Vijayanagar or send your floor plan for an initial scope discussion.
              </p>

              <ul className="space-y-5 mb-8">
                <li className="flex items-start">
                  <MapPin
                    size={20}
                    className="text-ornate-darkgold mr-3 mt-1 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <address className="text-ornate-charcoal/80 not-italic leading-relaxed">
                    148/E, 17th Main Rd, SBI Staff Colony,
                    <br />
                    Hosahalli Extension, Stage 1, Vijayanagar,
                    <br />
                    Bengaluru, Karnataka 560040
                  </address>
                </li>
                <li className="flex items-center">
                  <Mail
                    size={20}
                    className="text-ornate-darkgold mr-3 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <a
                    href={`mailto:${STUDIO_INFO.email}`}
                    className="text-ornate-charcoal/80 hover:text-ornate-darkgold transition-colors"
                  >
                    {STUDIO_INFO.email}
                  </a>
                </li>
                <li className="flex items-center">
                  <Phone
                    size={20}
                    className="text-ornate-darkgold mr-3 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <a
                    href={STUDIO_INFO.phoneHref}
                    className="text-ornate-charcoal/80 hover:text-ornate-darkgold transition-colors"
                  >
                    {STUDIO_INFO.phoneDisplay}
                  </a>
                </li>
              </ul>

              <div className="flex flex-wrap gap-4">
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

            <div className="relative">
              <div className="relative z-10 overflow-hidden rounded-sm">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop"
                  alt="Bright architectural studio table prepared for interior material and layout consultations"
                  loading="lazy"
                  className="w-full h-auto rounded-sm transition-transform duration-700 ease-out hover:scale-105"
                />
              </div>
              <div
                className="hidden sm:block absolute -top-6 -left-6 w-56 h-56 border-8 border-ornate-gold/15 z-0"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </section>

      <button
        type="button"
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-40 p-3 bg-ornate-charcoal text-white border border-ornate-gold/40 shadow-lg transition-all duration-300 ${
          showScrollButton
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6 pointer-events-none"
        } hover:bg-ornate-darkgold`}
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} aria-hidden="true" />
      </button>
      </div>
    </div>
  );
};

export default Index;
