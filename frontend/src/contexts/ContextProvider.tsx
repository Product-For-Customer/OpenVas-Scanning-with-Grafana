import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode, ChangeEvent } from "react";

interface InitialState {
  chat: boolean;
  cart: boolean;
  userProfile: boolean;
  notification: boolean;
}

type ThemeMode = "Light" | "Dark";

interface StateContextType {
  screenSize: number | undefined;
  setScreenSize: React.Dispatch<React.SetStateAction<number | undefined>>;

  currentColor: string;
  setCurrentColor: React.Dispatch<React.SetStateAction<string>>;

  currentMode: ThemeMode;
  setCurrentMode: React.Dispatch<React.SetStateAction<ThemeMode>>;

  themeSettings: boolean;
  setThemeSettings: React.Dispatch<React.SetStateAction<boolean>>;

  activeMenu: boolean;
  setActiveMenu: React.Dispatch<React.SetStateAction<boolean>>;

  isClicked: InitialState;
  setIsClicked: React.Dispatch<React.SetStateAction<InitialState>>;
  initialState: InitialState;

  setMode: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setColor: (color: string) => void;
  handleClick: (clicked: keyof InitialState) => void;

  toggleMode: () => void;
}

const initialState: InitialState = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
};

const StateContext = createContext<StateContextType | undefined>(undefined);

interface ContextProviderProps {
  children: ReactNode;
}

const STORAGE_KEY_MODE = "themeMode";
const STORAGE_KEY_COLOR = "colorMode";

/* ✅ สลับ Syncfusion theme โดยเปลี่ยน href ของ <link id="ej2-theme"> */
const applySyncfusionTheme = (mode: ThemeMode) => {
  const link = document.getElementById("ej2-theme") as HTMLLinkElement | null;
  if (!link) return;

  const lightHref = "https://cdn.syncfusion.com/ej2/material.css";
  const darkHref = "https://cdn.syncfusion.com/ej2/material-dark.css";

  link.href = mode === "Dark" ? darkHref : lightHref;
};

/* ✅ สลับ Tailwind dark + Syncfusion theme พร้อมกัน */
const applyTheme = (mode: ThemeMode) => {
  const root = document.documentElement; // <html>
  if (mode === "Dark") root.classList.add("dark");
  else root.classList.remove("dark");

  applySyncfusionTheme(mode);
};

const getSystemPrefMode = (): ThemeMode => {
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
  return prefersDark ? "Dark" : "Light";
};

export const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
  const [screenSize, setScreenSize] = useState<number | undefined>(undefined);
  const [currentColor, setCurrentColor] = useState<string>("#1860e7ff");
  const [currentMode, setCurrentMode] = useState<ThemeMode>("Light");
  const [themeSettings, setThemeSettings] = useState<boolean>(false);
  const [activeMenu, setActiveMenu] = useState<boolean>(true);
  const [isClicked, setIsClicked] = useState<InitialState>(initialState);

  // ✅ โหลดค่าครั้งแรก (localStorage > system) + apply ให้ html + syncfusion
  useEffect(() => {
    const savedMode = localStorage.getItem(STORAGE_KEY_MODE);
    const savedColor = localStorage.getItem(STORAGE_KEY_COLOR);

    const initMode: ThemeMode =
      savedMode === "Dark" || savedMode === "Light"
        ? (savedMode as ThemeMode)
        : getSystemPrefMode();

    setCurrentMode(initMode);
    localStorage.setItem(STORAGE_KEY_MODE, initMode);

    if (savedColor) setCurrentColor(savedColor);

    // ✅ สำคัญ: apply ทันทีตอน mount
    applyTheme(initMode);
  }, []);

  // ✅ ทุกครั้งที่ currentMode เปลี่ยน => apply + save
  useEffect(() => {
    applyTheme(currentMode);
    localStorage.setItem(STORAGE_KEY_MODE, currentMode);
  }, [currentMode]);

  // ✅ (optional) sync ข้ามแท็บ
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY_MODE) return;
      if (e.newValue === "Dark" || e.newValue === "Light") {
        setCurrentMode(e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setMode = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const next: ThemeMode = e.target.value === "Dark" ? "Dark" : "Light";
    setCurrentMode(next);
  };

  const toggleMode = () => {
    setCurrentMode((prev) => (prev === "Dark" ? "Light" : "Dark"));
  };

  const setColor = (color: string) => {
    setCurrentColor(color);
    localStorage.setItem(STORAGE_KEY_COLOR, color);
  };

  const handleClick = (clicked: keyof InitialState) =>
    setIsClicked({ ...initialState, [clicked]: true });

  const value = useMemo<StateContextType>(
    () => ({
      currentColor,
      currentMode,
      activeMenu,
      screenSize,
      setScreenSize,
      handleClick,
      isClicked,
      initialState,
      setIsClicked,
      setActiveMenu,
      setCurrentColor,
      setCurrentMode,
      setMode,
      setColor,
      themeSettings,
      setThemeSettings,
      toggleMode,
    }),
    [currentColor, currentMode, activeMenu, screenSize, isClicked, themeSettings]
  );

  return <StateContext.Provider value={value}>{children}</StateContext.Provider>;
};

export const useStateContext = (): StateContextType => {
  const context = useContext(StateContext);
  if (!context) throw new Error("useStateContext must be used within a ContextProvider");
  return context;
};