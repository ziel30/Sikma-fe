"use client";

import { useEffect } from "react";

const THEME_KEY = "sikma:theme";

/** Applies the persisted dark-mode preference to <html> on load. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const isDark = localStorage.getItem(THEME_KEY) === "dark";
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  return <>{children}</>;
}
