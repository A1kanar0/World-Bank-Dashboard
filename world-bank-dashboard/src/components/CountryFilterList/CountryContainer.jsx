import { useState, useEffect } from "react";
import { fetchWorldBankData } from "../../services/worldBankApi";
import CountryControls from "./CountryControls";
import CountryTable from "./CountryTable";

export default function CountryContainer({ year, onKpiUpdate }) {
    const [countries, setCountries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedRegion, setSelectedRegion] = useState("Всі");
    const [sortField, setSortField] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");

    useEffect(() => {
        let isSubscribed = true;
        setIsLoading(true);
        setError(null);

        fetchWorldBankData("NY.GDP.MKTP.CD", year)
            .then((data) => {
                if (isSubscribed) {
                    setCountries(data);
                    setIsLoading(false);

                    if (data.length > 0 && onKpiUpdate) {
                        const totalGdp = data.reduce((acc, curr) => acc + curr.value, 0);
                        const avgGdp = totalGdp / data.length;

                        onKpiUpdate([
                            { id: 1, title: "Загальний ВВП завантажених країн", value: totalGdp, change: 2.4, type: "currency" },
                            { id: 2, title: "Середній ВВП на країну", value: avgGdp, change: 1.1, type: "currency" },
                            { id: 3, title: "Кількість підрахованих країн", value: data.length, change: 0, type: "number" },
                        ]);
                    }
                }
            })
            .catch((err) => {
                if (isSubscribed) {
                    setError(err.message || "Не вдалося завантажити дані");
                    setIsLoading(false);
                }
            });

        return () => {
            isSubscribed = false;
        };
    }, [year]);

    const regions = ["Всі", ...new Set(countries.map((c) => c.region).filter(Boolean))];

    const filteredCountries =
        selectedRegion === "Всі"
            ? countries
            : countries.filter((c) => c.region === selectedRegion);

    const sortedCountries = [...filteredCountries].sort((a, b) => {
        const fieldKey = sortField === "gdp" || sortField === "ВВП" ? "value" : sortField;

        let aVal = a[fieldKey];
        let bVal = b[fieldKey];

        if (typeof aVal === "string") {
            const res = aVal.localeCompare(bVal);
            return sortOrder === "asc" ? res : -res;
        }

        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });

    if (isLoading) {
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
                <p className="text-xs text-rose-500 mt-1">Спробуйте змінити рік або перевірте мережеве з'єднання.</p>
            </div>
        );
    }

    if (countries.length === 0) {
        return (
            <div className="p-8 text-center bg-white dark:bg-[#1E2235] rounded-2xl border border-gray-200 dark:border-gray-800 col-span-full">
                <p className="text-sm text-gray-500 dark:text-gray-400">Дані відсутні за вибраний період.</p>
            </div>
        );
    }

    return (
        <div className="p-5 bg-white dark:bg-[#1E2235] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm col-span-full">
            <CountryControls
                regions={regions}
                selectedRegion={selectedRegion}
                onRegionChange={setSelectedRegion}
                sortField={sortField}
                onSortFieldChange={setSortField}
                sortOrder={sortOrder}
                onSortOrderChange={setSortOrder}
            />
            <CountryTable countries={sortedCountries} />
        </div>
    );
}