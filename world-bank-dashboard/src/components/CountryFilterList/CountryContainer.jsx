import { useEffect, useMemo } from "react";
import { fetchWorldBankData } from "../../services/worldBankApi";
import { useFetch } from "../../hooks/useFetch";
import { useFilters } from "../../hooks/useFilters";
import { DEFAULT_FILTERS } from "../../constants/filterConstants";
import FilterPanel from "./FilterPanel";
import CountryTable from "./CountryTable";

export default function CountryContainer({ onKpiUpdate }) {
    const { debouncedFilters: filters, year } = useFilters();

    const { data: rawCountries, loading, error } = useFetch(
        (signal) => fetchWorldBankData("NY.GDP.MKTP.CD", year, signal),
        [year]
    );

    const { data: rawPrevCountries, error: prevError } = useFetch(
        (signal) => fetchWorldBankData("NY.GDP.MKTP.CD", year - 1, signal),
        [year]
    );

    const countries = useMemo(() => rawCountries || [], [rawCountries]);
    const prevCountries = useMemo(() => rawPrevCountries || [], [rawPrevCountries]);

    const processedCountries = useMemo(() => {
        const query = (filters.searchQuery || "").trim().toLowerCase();
        const selectedReg = (filters.selectedRegion || DEFAULT_FILTERS.selectedRegion).trim();

        const filtered = countries.filter((c) => {
            const matchesSearch = !query || c.name.toLowerCase().includes(query);
            const matchesRegion = selectedReg === DEFAULT_FILTERS.selectedRegion || c.region === selectedReg;
            return matchesSearch && matchesRegion;
        });

        return [...filtered].sort((a, b) => {
            const aVal = a[filters.sortField];
            const bVal = b[filters.sortField];

            if (typeof aVal === "string") {
                const res = aVal.localeCompare(bVal);
                return filters.sortOrder === "asc" ? res : -res;
            }

            return filters.sortOrder === "asc" ? aVal - bVal : bVal - aVal;
        });
    }, [countries, filters]);

    const kpis = useMemo(() => {
        const totalGdp = processedCountries.reduce((acc, c) => acc + c.value, 0);
        const count = processedCountries.length;
        const avgGdp = count ? totalGdp / count : 0;

        const prevTotalGdp = prevCountries.reduce((acc, c) => acc + c.value, 0);
        const prevAvgGdp = prevCountries.length ? prevTotalGdp / prevCountries.length : 0;

        const isAllSelected = count > 0 && count === countries.length;

        let totalGdpChange = 0;
        let avgGdpChange = 0;

        if (isAllSelected && prevTotalGdp > 0) {
            totalGdpChange = Number((((totalGdp - prevTotalGdp) / prevTotalGdp) * 100).toFixed(1));
            avgGdpChange = Number((((avgGdp - prevAvgGdp) / prevAvgGdp) * 100).toFixed(1));
        }

        return [
            {
                key: "totalGdp",
                title: isAllSelected ? `Загальний ВВП (${year} vs ${year - 1})` : "Загальний ВВП обраних країн",
                value: totalGdp,
                change: totalGdpChange,
                type: "currency",
            },
            {
                key: "avgGdp",
                title: isAllSelected ? `Середній ВВП (${year} vs ${year - 1})` : "Середній ВВП на країну",
                value: avgGdp,
                change: avgGdpChange,
                type: "currency",
            },
            {
                key: "count",
                title: "Кількість підрахованих країн",
                value: count,
                change: 0,
                type: "number",
            },
        ];
    }, [processedCountries, countries.length, prevCountries, year]);

    useEffect(() => {
        if (onKpiUpdate) {
            onKpiUpdate(kpis);
        }
    }, [kpis, onKpiUpdate]);

    let content;

    if (loading) {
        content = (
            <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent mb-2"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Завантаження даних World Bank API...</p>
            </div>
        );
    } else if (error) {
        content = (
            <div className="p-6 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-2xl text-center">
                <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">⚠️ Помилка завантаження: {error}</p>
            </div>
        );
    } else if (countries.length === 0) {
        content = (
            <div className="p-8 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Дані відсутні за обраний рік ({year}).</p>
            </div>
        );
    } else if (processedCountries.length === 0) {
        content = (
            <div className="p-8 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Країн за вказаними фільтрами не знайдено.</p>
            </div>
        );
    } else {
        content = <CountryTable countries={processedCountries} />;
    }

    return (
        <div className="p-5 bg-white dark:bg-[#1E2235] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm col-span-full">
            <FilterPanel countries={countries} />

            {prevError && (
                <p className="mb-4 text-xs text-amber-600 dark:text-amber-400">
                    Не вдалося завантажити дані за {year - 1}: порівняння з минулим роком недоступне.
                </p>
            )}

            {content}
        </div>
    );
}