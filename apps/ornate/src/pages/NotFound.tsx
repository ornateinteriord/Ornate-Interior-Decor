import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Seo from "../components/seo/Seo";
import { MobileNotFoundView } from "../components/mobile/MobileInfoViews";

const NotFound = () => {
  const location = useLocation();

  return (
    <>
      <Seo
        title="Page Not Found (404)"
        description="The requested page could not be found on Ornate Interior Decor."
        path={location.pathname}
        noIndex
      />

      <div className="md:hidden">
        <MobileNotFoundView pathname={location.pathname} />
      </div>

      <div className="hidden md:flex min-h-screen items-center justify-center bg-ornate-offwhite pt-32 pb-20">

      <div className="ornate-container">
        <div className="max-w-xl mx-auto bg-white border border-ornate-gold/20 p-10 text-center shadow-sm">
          <p className="font-display text-xs uppercase tracking-widest text-ornate-darkgold mb-3">
            Error 404
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-ornate-charcoal mb-4">
            Page Not Found
          </h1>
          <p className="text-ornate-charcoal/80 mb-8 leading-relaxed">
            The address <code className="px-1.5 py-0.5 bg-ornate-cream text-ornate-charcoal text-sm">{location.pathname}</code> does not match a page on this site. It may have moved or been typed incorrectly.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/" className="ornate-btn-primary inline-flex items-center justify-center group">
              <ArrowLeft
                size={16}
                className="mr-2 group-hover:-translate-x-1 transition-transform"
                aria-hidden="true"
              />
              Return to Home
            </Link>
            <Link to="/projects" className="ornate-btn-outline inline-flex items-center justify-center group">
              Browse Projects
              <ArrowRight
                size={16}
                className="ml-2 group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-ornate-gold/15 flex flex-wrap justify-center gap-6 text-xs font-display uppercase tracking-wider text-ornate-charcoal/70">
            <Link to="/services" className="hover:text-ornate-darkgold transition-colors">
              Services
            </Link>
            <Link to="/about" className="hover:text-ornate-darkgold transition-colors">
              About
            </Link>
            <Link to="/contact" className="hover:text-ornate-darkgold transition-colors">
              Contact
            </Link>
            <Link to="/faq" className="hover:text-ornate-darkgold transition-colors">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default NotFound;
