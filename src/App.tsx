
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Faq from "./pages/Faq";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import Navbar from "./components/ui-components/Navbar";
import Footer from "./components/ui-components/Footer";
import Service from "./pages/Service";
import Projects from "./pages/Projects";
import PrivacyandPolicy from "./pages/PrivacyandPolicy";
import Terms from "./pages/Terms";
import ScrollToTop from "./components/scroll/ScrolltoTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <ScrollToTop/>
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services" element={<Service />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/help" element={<Help />} />
            <Route path="/privacy-policy" element={<PrivacyandPolicy />} />
            <Route path="/terms" element={<Terms />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
