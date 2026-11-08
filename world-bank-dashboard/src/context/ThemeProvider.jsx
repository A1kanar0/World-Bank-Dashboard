import { useCallback, useEffect, useMemo, useState } from "react";
import { ThemeContext } from "./ThemeContext";

const STORAGE_KEY = "wb-dashboard-theme";

function readInitialTheme() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === "light") return false;
        if (saved === "dark") return true;
    } catch {
    }
    return true;
}

export default function ThemeProvider({ children }) {
    const [isDark, setIsDark] = useState(readInitialTheme);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
        } catch {
        }
    }, [isDark]);

    const toggleTheme = useCallback(() => setIsDark((prev) => !prev), []);

    const value = useMemo(() => ({ isDark, toggleTheme }), [isDark, toggleTheme]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}