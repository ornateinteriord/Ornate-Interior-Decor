import React, { createContext, useContext, useEffect, useState } from "react";
import {
  adminApi,
  getStoredAdminToken,
  setStoredAdminToken,
} from "@/lib/adminApi";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AdminAuthContextValue {
  admin: AdminUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getStoredAdminToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    adminApi
      .get("/auth/me")
      .then((res) => {
        setAdmin(res.data.data.admin);
      })
      .catch(() => {
        setStoredAdminToken(null);
        setAdmin(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = async (email: string, password: string) => {
    const res = await adminApi.post("/auth/login", { email, password });
    const { token, admin: adminUser } = res.data.data;
    setStoredAdminToken(token);
    setAdmin(adminUser);
  };

  const logout = () => {
    setStoredAdminToken(null);
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return ctx;
}
