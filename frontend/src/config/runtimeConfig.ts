declare global {
  interface Window {
    __APP_CONFIG__?: {
      VITE_BACKEND_URL?: string;
      VITE_OPENVAS_URL?: string;
    };
  }
}

const normalizeUrl = (value: string | undefined, fallback: string): string => {
  const finalValue = value && value.trim() !== "" ? value.trim() : fallback;
  return finalValue.replace(/\/+$/, "");
};

const runtimeConfig = typeof window !== "undefined" ? window.__APP_CONFIG__ : undefined;

export const VITE_BACKEND_URL = normalizeUrl(
  runtimeConfig?.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_URL,
  "http://localhost:9000"
);

export const VITE_OPENVAS_URL = normalizeUrl(
  runtimeConfig?.VITE_OPENVAS_URL || import.meta.env.VITE_OPENVAS_URL,
  "http://localhost:9392"
);