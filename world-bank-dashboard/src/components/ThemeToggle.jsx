import { useTheme } from "../hooks/useTheme";

export default function ThemeToggle() {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-gray-100 dark:bg-[#1E2235] text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:opacity-80 transition cursor-pointer"
        >
            <span>{isDark ? "🌙 Dark Mode" : "☀️ Light Mode"}</span>
        </button>
    );
}