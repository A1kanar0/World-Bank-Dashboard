import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useFilters } from "../../hooks/useFilters";
import { DEFAULT_FILTERS } from "../../constants/filterConstants";

const LABEL_CLS = "block text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-1";
const CONTROL_CLS =
    "w-full p-2 text-xs font-medium border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-[#1E2235] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500";

export default function FilterPanel({ countries = [] }) {
    const { filters, setFilters, resetFilters } = useFilters();

    const { control, watch, reset } = useForm({ defaultValues: filters });

    useEffect(() => {
        const subscription = watch((values) => setFilters({ ...DEFAULT_FILTERS, ...values }));
        return () => subscription.unsubscribe();
    }, [watch, setFilters]);

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

    const handleReset = () => {
        reset(DEFAULT_FILTERS);
        resetFilters();
    };

    return (
        <div className="p-4 bg-gray-50 dark:bg-[#121522] rounded-xl border border-gray-200 dark:border-gray-800 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex-1 min-w-[200px]">
                    <label className={LABEL_CLS}>Пошук за назвою</label>
                    <Controller
                        name="searchQuery"
                        control={control}
                        render={({ field }) => (
                            <input
                                type="text"
                                placeholder="Введіть назву країни..."
                                {...field}
                                className={CONTROL_CLS}
                            />
                        )}
                    />
                </div>

                <div className="min-w-[180px]">
                    <label className={LABEL_CLS}>Регіон</label>
                    <Controller
                        name="selectedRegion"
                        control={control}
                        render={({ field }) => (
                            <select {...field} className={`${CONTROL_CLS} cursor-pointer`}>
                                {regions.map((region) => (
                                    <option key={region} value={region}>
                                        {region}
                                    </option>
                                ))}
                            </select>
                        )}
                    />
                </div>

                <div className="min-w-[150px]">
                    <label className={LABEL_CLS}>Сортувати за</label>
                    <Controller
                        name="sortField"
                        control={control}
                        render={({ field }) => (
                            <select {...field} className={`${CONTROL_CLS} cursor-pointer`}>
                                <option value="name">Назва країни</option>
                                <option value="value">ВВП USD</option>
                            </select>
                        )}
                    />
                </div>

                <div className="min-w-[130px]">
                    <label className={LABEL_CLS}>Напрямок</label>
                    <Controller
                        name="sortOrder"
                        control={control}
                        render={({ field }) => (
                            <select {...field} className={`${CONTROL_CLS} cursor-pointer`}>
                                <option value="asc">⬆️ За зростанням</option>
                                <option value="desc">⬇️ За спаданням</option>
                            </select>
                        )}
                    />
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