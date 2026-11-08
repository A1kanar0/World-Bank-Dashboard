import { useEffect, useMemo, useState } from "react";
import { fetchWorldBankData } from "../../services/worldBankApi";
import { useFetch } from "../../hooks/useFetch";
import { DEFAULT_FILTERS } from "../../constants/filterConstants";
import FilterPanel from "./FilterPanel";
import CountryTable from "./CountryTable";

export default function CountryContainer({ year = 2022, onKpiUpdate }) {
    const [filters, setFilters] = useState(DEFAULT_FILTERS);

    const { data: rawCountries, loading, error } = useFetch(
        (signal) => fetchWorldBankData("NY.GDP.MKTP.CD", year, signal),
        [year]
    );

    const { data: rawPrevCountries } = useFetch(
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
            let aVal = a[filters.sortField];
            let bVal = b[filters.sortField];

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

    if (!countries || countries.length === 0) {
        return (
            <div className="p-8 bg-white dark:bg-[#1E2235] rounded-2xl border border-gray-200 dark:border-gray-800 text-center col-span-full">
                <p className="text-sm text-gray-500 dark:text-gray-400">Дані відсутні за обраний рік ({year}).</p>
            </div>
        );
    }

    return (
        <div className="p-5 bg-white dark:bg-[#1E2235] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm col-span-full">
            <FilterPanel
                countries={countries}
                filters={filters}
                onFilterChange={setFilters}
            />

            {processedCountries.length === 0 ? (
                <div className="p-8 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Країн за вказаними фільтрами не знайдено.</p>
                </div>
            ) : (
                <CountryTable countries={processedCountries} />
            )}
        </div>
    );
}