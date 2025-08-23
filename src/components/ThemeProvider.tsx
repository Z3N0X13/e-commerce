"use client";

import { createContext, useContext, ReactNode } from "react";
import { useTheme } from "@/hooks/use-theme";

type ThemeContextType = {
  theme: "light" | "dark";
  mounted: boolean;
  toggleTheme: () => void;
  setThemeMode: (theme: "light" | "dark") => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const themeData = useTheme();

  return (
    <ThemeContext.Provider value={themeData}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
}
