import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { GetMe, Logout, type MeResponse } from "../services/auth";

type AuthUser = MeResponse;

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthed: boolean;
  isAdmin: boolean;
  role: string;
  refreshMe: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
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
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      await Logout();
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
    const role = String(user?.role ?? "").toLowerCase();

    // ถ้าระบบคุณอยากให้ user/admin ผ่าน logic บางอย่างเหมือนกัน ก็เก็บแบบนี้ได้
    const isAdmin = role === "admin" || role === "user";

    return {
      user,
      isLoading,
      isAuthed,
      isAdmin,
      role,
      refreshMe,
      logout,
    };
  }, [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};