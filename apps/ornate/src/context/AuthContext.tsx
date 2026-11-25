import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { UserProfile } from "@/types/furniture";
import {
  ecommerceApi,
  getCustomerToken,
  setCustomerToken,
} from "@/services/ecommerceApi";

interface AuthContextValue {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<UserProfile>;
  register: (payload: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<UserProfile>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  setUserState: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getCustomerToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const profile = await ecommerceApi.getMe();
      setUser(profile);
    } catch {
      setCustomerToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const { token, user: loggedUser } = await ecommerceApi.login({ email, password });
    setCustomerToken(token);
    setUser(loggedUser);
    return loggedUser;
  }, []);

  const register = useCallback(
    async (payload: { name: string; email: string; phone: string; password: string }) => {
      const { token, user: createdUser } = await ecommerceApi.register(payload);
      setCustomerToken(token);
      setUser(createdUser);
      return createdUser;
    },
    []
  );

  const logout = useCallback(() => {
    setCustomerToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
        refreshUser,
        setUserState: setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
