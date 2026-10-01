import { useState } from "react";

export default function Counter({
                                    title = "Лічильник",
                                    initialValue = 1,
                                    min = 0,
                                    max = 100,
                                    step = 1,
                                    onChange,
                                }) {
    const [value, setValue] = useState(initialValue);

    const updateValue = (newValue) => {
        setValue(newValue);
        if (onChange) onChange(newValue);
    };

    const handleIncrement = () => {
        updateValue(Math.min(value + step, max));
    };

    const handleDecrement = () => {
        updateValue(Math.max(value - step, min));
    };

    const handleReset = () => {
        updateValue(initialValue);
    };

    return (
        <div className="p-5 bg-white dark:bg-[#1E2235] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {title}
        </span>
                <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                    Скинути
                </button>
            </div>

            <div className="flex items-center justify-between mt-3 bg-gray-50 dark:bg-[#121522] p-2 rounded-xl border border-gray-200 dark:border-gray-700/50">
                <button
                    type="button"
                    onClick={handleDecrement}
                    disabled={value <= min}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-[#1E2235] text-gray-900 dark:text-white font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-30 cursor-pointer"
                >
                    −
                </button>

                <span className="text-lg font-bold text-gray-900 dark:text-white">
          {value}
        </span>

                <button
                    type="button"
                    onClick={handleIncrement}
                    disabled={value >= max}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-[#1E2235] text-gray-900 dark:text-white font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-30 cursor-pointer"
                >
                    +
                </button>
            </div>
        </div>
    );
}