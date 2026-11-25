import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { AdminAuthProvider, useAdminAuth } from "@/context/AdminAuthContext";
import { AdminLayout } from "@/components/AdminLayout";
import { LoginPage } from "@/pages/LoginPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { ProductsPage } from "@/pages/ProductsPage";
import { OrdersPage } from "@/pages/OrdersPage";
import { CouponsPage } from "@/pages/CouponsPage";
import { CustomersReviewsPage } from "@/pages/CustomersReviewsPage";
import { SystemHealthPage } from "@/pages/SystemHealthPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false },
  },
});

const AdminRouter: React.FC = () => {
  const { admin, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ornate-offwhite text-sm text-ornate-charcoal/70">
        Verifying admin session...
      </div>
    );
  }

  if (!admin) {
    return <LoginPage />;
  }

  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/coupons" element={<CouponsPage />} />
        <Route path="/customers" element={<CustomersReviewsPage />} />
        <Route path="/system" element={<SystemHealthPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster richColors position="top-right" />
      <AdminAuthProvider>
        <BrowserRouter>
          <AdminRouter />
        </BrowserRouter>
      </AdminAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
