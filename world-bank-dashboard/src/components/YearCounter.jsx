import { useState } from "react";

export default function YearCounter({ initialYear = 2023 }) {
    const [year, setYear] = useState(initialYear);

    return (
        <div className="p-5 bg-white dark:bg-[#1E2235] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Рік аналізу
        </span>
                <button
                    onClick={() => setYear(initialYear)}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                    Reset
                </button>
            </div>

            <div className="flex items-center justify-between mt-3 bg-gray-50 dark:bg-[#121522] p-2 rounded-xl border border-gray-200 dark:border-gray-700/50">
                <button
                    onClick={() => setYear((prev) => Math.max(prev - 1, 2000))}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-[#1E2235] text-gray-900 dark:text-white font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                    −
                </button>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
          {year}
        </span>
                <button
                    onClick={() => setYear((prev) => Math.min(prev + 1, 2026))}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-[#1E2235] text-gray-900 dark:text-white font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                    +
                </button>
            </div>
        </div>
    );
}