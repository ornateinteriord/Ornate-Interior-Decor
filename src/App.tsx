import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/ui-components/Navbar";
import Footer from "./components/ui-components/Footer";
import {
  MobileBottomNav,
  MobileTopBar,
} from "./components/mobile/MobileAppShell";
import ScrollToTop from "./components/scroll/ScrolltoTop";
import ErrorBoundary from "./components/error/ErrorBoundary";
import "./App.css";

const Index = lazy(() => import("./pages/Index"));
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Service = lazy(() => import("./pages/Service"));
const Projects = lazy(() => import("./pages/Projects"));
const Faq = lazy(() => import("./pages/Faq"));
const Help = lazy(() => import("./pages/Help"));
const PrivacyandPolicy = lazy(() => import("./pages/PrivacyandPolicy"));
const Terms = lazy(() => import("./pages/Terms"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const PageLoader = () => (
  <div
    className="min-h-screen flex items-center justify-center bg-ornate-offwhite"
    role="status"
    aria-live="polite"
  >
    <p className="font-display text-xs uppercase tracking-widest text-ornate-charcoal/70">
      Loading page...
    </p>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Sonner />
    <BrowserRouter>
      <div className="hidden md:block">
        <Navbar />
      </div>
      <div className="md:hidden">
        <MobileTopBar />
      </div>

      <ScrollToTop />

      <main className="min-h-screen pt-14 pb-24 md:pt-0 md:pb-0">
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/shop/:productSlug" element={<ProductDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Service />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/help" element={<Help />} />
              <Route path="/privacy-policy" element={<PrivacyandPolicy />} />
              <Route path="/terms-and-conditions" element={<Terms />} />
              <Route
                path="/terms"
                element={<Navigate to="/terms-and-conditions" replace />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>

      <div className="hidden md:block">
        <Footer />
      </div>
      <div className="md:hidden">
        <MobileBottomNav />
      </div>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
