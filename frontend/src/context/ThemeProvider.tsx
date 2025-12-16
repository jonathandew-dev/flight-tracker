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
    
    const root = document.documentElement;

    if (darkMode && !root.classList.contains("dark")) {
      root.classList.add("dark");
      
    } else if (!darkMode && root.classList.contains("dark")) {
      root.classList.remove("dark");
      
    }

    localStorage.setItem("darkMode", String(darkMode));
    
  }, [darkMode]);

  const toggleDarkMode = () => {
    
    setDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
