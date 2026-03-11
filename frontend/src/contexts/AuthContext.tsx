import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { GetMe, Logout, type MeResponse } from "../services/auth";

type AuthUser = MeResponse;

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthed: boolean;
  isAdmin: boolean;
  isUser: boolean;
  role: string;
  refreshMe: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshMe = async () => {
    try {
      const me = await GetMe();
      setUser(me);
    } catch (err) {
      console.error("GetMe error:", err);
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      await Logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
    }
  };

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        if (!alive) return;
        setIsLoading(true);
        await refreshMe();
      } finally {
        if (alive) setIsLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const isAuthed = !!user;
    const role = String(user?.role ?? "").trim().toLowerCase();

    const isAdmin = role === "admin";
    const isUser = role === "user";

    return {
      user,
      isLoading,
      isAuthed,
      isAdmin,
      isUser,
      role,
      refreshMe,
      logout,
    };
  }, [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};