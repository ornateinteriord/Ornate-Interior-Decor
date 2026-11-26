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
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { StoreExtrasProvider } from "./context/StoreExtrasContext";
import { SearchProvider } from "./context/SearchContext";
import { CartDrawer } from "./components/ecommerce/CartDrawer";
import { CompareBar } from "./components/ecommerce/CompareBar";
import { SearchCommandModal } from "./components/ui-components/SearchCommandModal";
import "./App.css";

const Index = lazy(() => import("./pages/Index"));
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const CartPage = lazy(() => import("./pages/CartPage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const OrderSuccessPage = lazy(() => import("./pages/OrderSuccessPage"));
const AccountPage = lazy(() => import("./pages/AccountPage"));
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
    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-ornate-border shadow-xs">
      <span className="w-2 h-2 rounded-full bg-ornate-moss animate-pulse" />
      <p className="text-xs font-semibold text-ornate-muted">
        Loading Ornate Studio...
      </p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Sonner />
    <AuthProvider>
      <CartProvider>
        <StoreExtrasProvider>
          <SearchProvider>
            <BrowserRouter>
              <div className="hidden md:block">
                <Navbar />
              </div>
              <div className="md:hidden">
                <MobileTopBar />
              </div>

              <ScrollToTop />
              <SearchCommandModal />
              <CartDrawer />
              <CompareBar />

              <main className="min-h-screen pt-14 pb-24 md:pt-0 md:pb-0">
                <ErrorBoundary>
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/shop" element={<Shop />} />
                      <Route path="/shop/:productSlug" element={<ProductDetail />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/wishlist" element={<WishlistPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/orders/:orderNumber" element={<OrderSuccessPage />} />
                      <Route path="/account" element={<AccountPage />} />
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
          </SearchProvider>
        </StoreExtrasProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
