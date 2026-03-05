import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { GetMe, Logout, type MeResponse } from "../services/auth";

type AuthUser = MeResponse;

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthed: boolean;
  isAdmin: boolean;
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
      // ถ้า cookie ไม่มี/หมดอายุ → ถือว่าไม่ได้ login
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const isAuthed = !!user;
    const role = (user?.role ?? "").toLowerCase();
    const isAdmin = role === "admin" || role === "user";
    return {
      user,
      isLoading,
      isAuthed,
      isAdmin,
      refreshMe,
      logout,
    };
  }, [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};