import React, { createContext, useState, useEffect, useContext } from "react";
import { authService } from "@/services";
import type { AuthResponse } from "@/services/auth.service";

// TODO do this the tanstack-query way, and set a refetchInterval of 15 minutes to refresh the httpOnly cookie auth

type User = AuthResponse["data"];

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
  updateUser: (data: User) => void;
  clearUser: () => void;
} | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) return;

    const fetchUser = async () => {
      try {
        const { data } = await authService.getProfile();
        setUser(data);
      } catch (err: any) {
        setUser(null)
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const updateUser = (data: User) => {
    setUser(data);
    setLoading(false);
  };

  const clearUser = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, updateUser, clearUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
