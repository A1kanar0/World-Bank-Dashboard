import { useState, useEffect, useCallback, useMemo } from "react";
import { fetchWorldBankData } from "../../services/worldBankApi";
import { useFetch } from "../../hooks/useFetch";
import { useDebounce } from "../../hooks/useDebounce";
import FilterPanel from "./FilterPanel";
import CountryTable from "./CountryTable";

export default function CountryContainer({ year = 2022, onKpiUpdate }) {
    const [filters, setFilters] = useState({
        searchQuery: "",
        selectedRegion: "Всі",
        sortField: "value",
        sortOrder: "desc",
    });

    const debouncedSearchQuery = useDebounce(filters.searchQuery, 400);

    const fetchApi = useCallback(
        () => fetchWorldBankData("NY.GDP.MKTP.CD", year),
        [year]
    );

    const { data: rawCountries, loading, error } = useFetch(fetchApi, year);
    const countries = rawCountries || [];

    const regions = useMemo(
        () => ["Всі", ...new Set(countries.map((c) => c.region).filter(Boolean))],
        [countries]
    );

    const filteredCountries = useMemo(() => {
        return countries.filter((c) => {
            const matchesSearch = c.name
                .toLowerCase()
                .includes(debouncedSearchQuery.toLowerCase());
            const matchesRegion =
                filters.selectedRegion === "Всі" || c.region === filters.selectedRegion;

            return matchesSearch && matchesRegion;
        });
    }, [countries, debouncedSearchQuery, filters.selectedRegion]);

    const sortedCountries = useMemo(() => {
        return [...filteredCountries].sort((a, b) => {
            const field = filters.sortField;
            let aVal = a[field];
            let bVal = b[field];

            if (typeof aVal === "string") {
                const res = aVal.localeCompare(bVal);
                return filters.sortOrder === "asc" ? res : -res;
            }

            if (aVal < bVal) return filters.sortOrder === "asc" ? -1 : 1;
            if (aVal > bVal) return filters.sortOrder === "asc" ? 1 : -1;
            return 0;
        });
    }, [filteredCountries, filters.sortField, filters.sortOrder]);

    const handleFilterChange = useCallback((newFilters) => {
        setFilters((prev) => {
            if (JSON.stringify(prev) === JSON.stringify(newFilters)) return prev;
            return { ...prev, ...newFilters };
        });
    }, []);

    useEffect(() => {
        if (onKpiUpdate && !loading && !error) {
            const totalGdp = sortedCountries.reduce((acc, curr) => acc + curr.value, 0);
            const avgGdp = sortedCountries.length ? totalGdp / sortedCountries.length : 0;

            onKpiUpdate([
                { id: 1, title: "Загальний ВВП обраних країн", value: totalGdp, change: 2.4, type: "currency" },
                { id: 2, title: "Середній ВВП на країну", value: avgGdp, change: 1.1, type: "currency" },
                { id: 3, title: "Кількість підрахованих країн", value: sortedCountries.length, change: 0, type: "number" },
            ]);
        }
    }, [sortedCountries, onKpiUpdate, loading, error]);

    if (loading) {
        return (
            <div className="p-8 text-center bg-white dark:bg-[#1E2235] rounded-2xl border border-gray-200 dark:border-gray-800 col-span-full">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent mb-2"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Завантаження даних World Bank API...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-2xl col-span-full text-center">
                <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">⚠️ Помилка завантаження: {error}</p>
            </div>
        );
    }

    return (
        <div className="p-5 bg-white dark:bg-[#1E2235] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm col-span-full">
            <FilterPanel regions={regions} onFilterChange={handleFilterChange} />

            {sortedCountries.length === 0 ? (
                <div className="p-8 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Країн за вказаними фільтрами не знайдено.</p>
                </div>
            ) : (
                <CountryTable countries={sortedCountries} />
            )}
        </div>
    );
}