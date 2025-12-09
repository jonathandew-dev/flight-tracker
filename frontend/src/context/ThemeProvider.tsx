import React, { useState, useEffect, ReactNode } from "react";
import { ThemeContext } from "./ThemeContext";

const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored !== null) return stored === "true";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Debugging
  useEffect(() => {
    console.log("ThemeProvider useEffect", { darkMode });
    const root = document.documentElement;

    if (darkMode && !root.classList.contains("dark")) {
      root.classList.add("dark");
      console.log("Added 'dark' class");
    } else if (!darkMode && root.classList.contains("dark")) {
      root.classList.remove("dark");
      console.log("Removed 'dark' class");
    }

    localStorage.setItem("darkMode", String(darkMode));
    console.log("Root classList now:", root.classList.toString());
  }, [darkMode]);

  const toggleDarkMode = () => {
    console.log("Toggling dark mode. Current:", darkMode);
    setDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
