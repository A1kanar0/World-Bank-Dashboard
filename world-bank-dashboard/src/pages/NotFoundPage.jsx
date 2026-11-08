import { Link, useLocation } from "react-router";

export default function NotFoundPage() {
    const { pathname } = useLocation();

    return (
        <main className="max-w-6xl mx-auto">
            <div className="p-8 text-center bg-white dark:bg-[#1E2235] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <p className="text-4xl mb-2">404</p>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Сторінку не знайдено</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Адреси «{pathname}» не існує.
                </p>
                <Link
                    to="/"
                    className="inline-block mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 transition"
                >
                    На головну
                </Link>
            </div>
        </main>
    );
}