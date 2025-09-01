"use client";
import { useState, useEffect, createContext, useContext } from "react";

const ThemeContext = createContext("light");

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light');
    const toggleTheme = () => setTheme((prev) =>
        prev === "light" ? "dark" : "light"
    );

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme")
        if (storedTheme) {
          setTheme(storedTheme);
        } else {
          const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
          setTheme(prefersDark ? "dark" : "light");
        }
      }, []);

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);


    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}
export const useDarkMode = () => useContext(ThemeContext)
