// Providers/ThemeProvider.jsx
"use client";
import React, { createContext, useEffect, useState } from 'react';
import { setCookie } from 'cookies-next';

export const ThemeContext = createContext();

const ThemeProvider = ({ children, initialTheme }) => {
    const [theme, setTheme] = useState(initialTheme);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        setCookie("theme", newTheme, { maxAge: 365 * 24 * 60 * 60 });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
