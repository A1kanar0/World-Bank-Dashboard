import { useEffect } from "react";
import { useForm } from "react-hook-form";

const DEFAULT_VALUES = {
    searchQuery: "",
    selectedRegion: "Всі",
    sortField: "value",
    sortOrder: "desc",
};

export default function FilterPanel({ regions = [], onFilterChange }) {
    const { register, watch, reset } = useForm({
        defaultValues: DEFAULT_VALUES,
    });

    useEffect(() => {
        const subscription = watch((value) => {
            if (onFilterChange) {
                onFilterChange(value);
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, onFilterChange]);

    const handleReset = () => {
        reset(DEFAULT_VALUES);
        if (onFilterChange) {
            onFilterChange(DEFAULT_VALUES);
        }
    };

    return (
        <div className="p-4 bg-gray-50 dark:bg-[#121522] rounded-xl border border-gray-200 dark:border-gray-800 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                {/* 1. Пошук */}
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-1">
                        Пошук за назвою
                    </label>
                    <input
                        type="text"
                        placeholder="Введіть назву країни..."
                        {...register("searchQuery")}
                        className="w-full p-2 text-xs font-medium border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-[#1E2235] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* 2. Регіон */}
                <div className="min-w-[150px]">
                    <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-1">
                        Регіон
                    </label>
                    <select
                        {...register("selectedRegion")}
                        className="w-full p-2 text-xs font-medium border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-[#1E2235] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {(regions || []).map((region) => (
                            <option key={region} value={region}>
                                {region}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 3. Поле сортування */}
                <div className="min-w-[150px]">
                    <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-1">
                        Сортувати за
                    </label>
                    <select
                        {...register("sortField")}
                        className="w-full p-2 text-xs font-medium border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-[#1E2235] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="name">Назва країни</option>
                        <option value="value">ВВП USD</option>
                    </select>
                </div>

                {/* 4. Напрямок */}
                <div className="min-w-[130px]">
                    <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-1">
                        Напрямок
                    </label>
                    <select
                        {...register("sortOrder")}
                        className="w-full p-2 text-xs font-medium border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-[#1E2235] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="asc">⬆️ За зростанням</option>
                        <option value="desc">⬇️ За спаданням</option>
                    </select>
                </div>

                {/* Кнопка скидання */}
                <div className="self-end">
                    <button
                        type="button"
                        onClick={handleReset}
                        className="px-3 py-2 text-xs font-semibold rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition cursor-pointer"
                    >
                        Скинути
                    </button>
                </div>
            </div>
        </div>
    );
}