
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-ornate-offwhite py-20">
      <div className="text-center max-w-lg px-6">
        <span className="font-serif text-8xl text-ornate-gold">404</span>
        <h1 className="font-serif text-3xl mb-6 text-ornate-charcoal mt-4">Page Not Found</h1>
        <p className="text-ornate-charcoal/80 mb-10 leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/" className="ornate-btn-primary inline-flex items-center group">
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
