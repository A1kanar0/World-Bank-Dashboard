export default function ThemeToggle({ isDark, onToggle }) {
    return (
        <button
            onClick={onToggle}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-gray-100 dark:bg-[#1E2235] text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:opacity-80 transition"
        >
            <span>{isDark ? "🌙 Dark Mode" : "☀️ Light Mode"}</span>
        </button>
    );
}