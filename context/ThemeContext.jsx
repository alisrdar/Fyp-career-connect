"use client";
import { useState, useEffect, createContext, useContext } from "react";

const ThemeContext = createContext("light");

export const ThemeProvider = ({children}) => {
    
    const [theme, setTheme] = useState(() => {
        // Default theme based on localStorage or system
        if (typeof window !== "undefined") {
          const storedTheme = localStorage.getItem("theme");
          if (storedTheme) return storedTheme;
          const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
          return prefersDark ? "dark" : "light";
        }
        return "light";
      });

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme= () => setTheme((prev) => prev === "light" ? "dark" : "light");

    return(
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}
export const useDarkMode = () => useContext(ThemeContext)
