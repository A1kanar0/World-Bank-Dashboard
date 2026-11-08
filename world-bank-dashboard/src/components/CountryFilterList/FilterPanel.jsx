import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDebounce } from "../../hooks/useDebounce";
import { DEFAULT_FILTERS } from "../../constants/filterConstants";

export default function FilterPanel({ countries = [], filters = DEFAULT_FILTERS, onFilterChange }) {
    const { register, watch, reset } = useForm({
        defaultValues: filters,
    });

    const formValues = watch();
    const debouncedSearchQuery = useDebounce(formValues.searchQuery, 400);

    const regions = useMemo(() => {
        const uniqueRegions = Array.from(
            new Set(
                countries
                    .map((c) => c.region)
                    .filter((r) => r && r !== "NA" && r !== "Aggregates" && r !== "Інші")
            )
        ).sort();

        return [DEFAULT_FILTERS.selectedRegion, ...uniqueRegions];
    }, [countries]);

    useEffect(() => {
        if (!onFilterChange) return;

        onFilterChange((prev) => ({
            ...prev,
            ...formValues,
            searchQuery: debouncedSearchQuery,
        }));
    }, [debouncedSearchQuery, formValues.selectedRegion, formValues.sortField, formValues.sortOrder, onFilterChange]);

    const handleReset = () => {
        reset(DEFAULT_FILTERS);
        if (onFilterChange) onFilterChange(DEFAULT_FILTERS);
    };

    return (
        <div className="p-4 bg-gray-50 dark:bg-[#121522] rounded-xl border border-gray-200 dark:border-gray-800 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
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

                <div className="min-w-[180px]">
                    <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-1">
                        Регіон
                    </label>
                    <select
                        {...register("selectedRegion")}
                        className="w-full p-2 text-xs font-medium border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-[#1E2235] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                        {regions.map((region) => (
                            <option key={region} value={region}>
                                {region}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="min-w-[150px]">
                    <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-1">
                        Сортувати за
                    </label>
                    <select
                        {...register("sortField")}
                        className="w-full p-2 text-xs font-medium border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-[#1E2235] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                        <option value="name">Назва країни</option>
                        <option value="value">ВВП USD</option>
                    </select>
                </div>

                <div className="min-w-[130px]">
                    <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-1">
                        Напрямок
                    </label>
                    <select
                        {...register("sortOrder")}
                        className="w-full p-2 text-xs font-medium border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-[#1E2235] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                        <option value="asc">⬆️ За зростанням</option>
                        <option value="desc">⬇️ За спаданням</option>
                    </select>
                </div>

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