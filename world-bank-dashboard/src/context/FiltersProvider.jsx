import { useCallback, useMemo, useState } from "react";
import { FiltersContext } from "./FiltersContext";
import { useDebounce } from "../hooks/useDebounce";
import { DEFAULT_FILTERS, DEFAULT_YEAR } from "../constants/filterConstants";

export default function FiltersProvider({ children }) {
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [year, setYear] = useState(DEFAULT_YEAR);


    const debouncedFilters = useDebounce(filters, 400);

    const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

    const value = useMemo(
        () => ({ filters, debouncedFilters, setFilters, resetFilters, year, setYear }),
        [filters, debouncedFilters, resetFilters, year]
    );

    return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}