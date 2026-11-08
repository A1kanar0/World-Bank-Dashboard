import { Link, NavLink, Outlet } from "react-router";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../hooks/useTheme";

export default function Layout() {
    const { isDark } = useTheme();

    return (
        <div className={`min-h-screen ${isDark ? "dark" : ""} bg-gray-100 dark:bg-[#0D0F17] text-gray-900 dark:text-white p-6 font-sans transition-colors duration-300`}>
            <header className="max-w-6xl mx-auto flex items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-800">
                <div>
                    <Link to="/" className="flex items-center gap-2">
                        <span className="font-extrabold text-xl tracking-wider text-indigo-600 dark:text-indigo-400">
                            Dashboard
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium">
                            World Bank API
                        </span>
                    </Link>
                    <h1 className="text-xl font-bold mt-1 text-gray-900 dark:text-white">
                        Світова Економіка
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <nav>
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) =>
                                `px-3 py-2 text-xs font-semibold rounded-xl transition ${
                                    isActive
                                        ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                                        : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                }`
                            }
                        >
                            Дашборд
                        </NavLink>
                    </nav>
                    <ThemeToggle />
                </div>
            </header>

            <Outlet />
        </div>
    );
}