import { useCallback, useState } from "react";
import KpiCard from "../components/KpiCard";
import Counter from "../components/Counter";
import CountryContainer from "../components/CountryFilterList/CountryContainer";
import { useFilters } from "../hooks/useFilters";
import { DEFAULT_YEAR, MAX_YEAR, MIN_YEAR } from "../constants/filterConstants";

export default function DashboardPage() {
    const { year, setYear } = useFilters();
    const [kpis, setKpis] = useState([]);

    const handleKpiUpdate = useCallback((newKpis) => {
        setKpis((prev) => (JSON.stringify(prev) === JSON.stringify(newKpis) ? prev : newKpis));
    }, []);

    return (
        <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
            {kpis.map((kpi) => (
                <KpiCard
                    key={kpi.key}
                    title={kpi.title}
                    value={kpi.value}
                    change={kpi.change}
                    type={kpi.type}
                />
            ))}

            <Counter
                title="Рік аналізу"
                value={year}
                initialValue={DEFAULT_YEAR}
                min={MIN_YEAR}
                max={MAX_YEAR}
                onChange={setYear}
            />

            <CountryContainer onKpiUpdate={handleKpiUpdate} />
        </main>
    );
}