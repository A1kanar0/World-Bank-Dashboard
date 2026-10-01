import { useState} from "react";
import KpiCard from "./components/KpiCard";
import Counter from "./components/Counter.jsx";
import ThemeToggle from "./components/ThemeToggle";
import CountryFilterList from "./components/CountryFilterList";
import { initialKpis, mockCountries } from "./mockData";

export default function App() {
  const [isDark, setIsDark] = useState(true);


  return (
      <div className={`min-h-screen ${isDark ? "dark" : ""} bg-gray-100 dark:bg-[#0D0F17] text-gray-900 dark:text-white p-6 font-sans transition-colors duration-300`}>
        <header className="max-w-6xl mx-auto flex items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-800">
          <div>
            <div className="flex items-center gap-2">
            <span className="font-extrabold text-xl tracking-wider text-indigo-600 dark:text-indigo-400">
              Dashboard
            </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium">
              World Bank
            </span>
            </div>
            <h1 className="text-xl font-bold mt-1 text-gray-900 dark:text-white">
              Світова Економіка
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark((prev) => !prev)} />
          </div>
        </header>

        <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {initialKpis.map((kpi) => (
              <KpiCard
                  key={kpi.id}
                  title={kpi.title}
                  value={kpi.value}
                  change={kpi.change}
                  type={kpi.type}
              />
          ))}

          <Counter
              title="Рік аналізу"
              initialValue={2023}
              min={2000}
              max={2026}
          />

          <CountryFilterList countries={mockCountries} />
        </main>
      </div>
  );
}