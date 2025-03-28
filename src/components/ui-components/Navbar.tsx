import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Projects", path: "/projects" },
    { name: "Contact", path: "/contact" },
    { name: "FAQ", path: "/faq" },
    { name: "Help & Support", path: "/help" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when navigating
    setIsOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? " py-3 bg-white shadow-sm lg:bg-white/90 lg:backdrop-blur-sm"
          : "py-6 bg-transparent"
      }`}
    >
      <div className="ornate-container">
        <nav className="flex items-center justify-between">
          <Link to="/" className="relative z-50">
            <h1 className="font-serif text-2xl font-medium">
              <span className="text-ornate-gold">Ornate</span>{" "}
              <span
                className={isScrolled ? "text-ornate-charcoal" : "text-white"}
              >
                Interior Decor
              </span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`font-display text-sm uppercase tracking-wider transition-all duration-300 
        ${
          location.pathname === link.path ||
          (link.path.includes("#") &&
            location.pathname === "/" &&
            link.path.includes(location.hash))
            ? "text-ornate-gold border-b-2 border-ornate-gold"
            : `${
                isScrolled ? "text-ornate-charcoal" : "text-white"
              } hover:text-ornate-gold  hover:border-ornate-gold`
        }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Navigation Toggle */}
          <button
            className={`lg:hidden relative z-50 ${
              isScrolled ? "text-ornate-charcoal" : "text-ornate-offwhite"
            }`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} className="text-ornate-charcoal" /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } lg:hidden`}
      >
        <div className="ornate-container flex flex-col justify-center h-full">
          <div className="flex flex-col space-y-8 items-center text-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`font-display text-xl uppercase tracking-wider transition-all duration-300
                  ${
                    location.pathname === link.path
                      ? "text-ornate-gold"
                      : "text-ornate-charcoal hover:text-ornate-gold"
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
