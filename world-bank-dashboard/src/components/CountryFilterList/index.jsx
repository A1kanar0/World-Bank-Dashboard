import { useState } from "react";
import CountryControls from "./CountryControls";
import CountryTable from "./CountryTable";

export default function CountryFilterList({ countries }) {
    const [selectedRegion, setSelectedRegion] = useState("Всі");
    const [sortField, setSortField] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");

    const regions = ["Всі", ...new Set(countries.map((c) => c.region))];

    const filteredCountries =
        selectedRegion === "Всі"
            ? countries
            : countries.filter((c) => c.region === selectedRegion);

    const sortedCountries = [...filteredCountries].sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];

        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });

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