import { useContext } from "react";
import { FiltersContext } from "../context/FiltersContext";

export function useFilters() {
    const ctx = useContext(FiltersContext);
    if (!ctx) {
        throw new Error("useFilters потрібно викликати всередині <FiltersProvider>");
    }
    return ctx;
}