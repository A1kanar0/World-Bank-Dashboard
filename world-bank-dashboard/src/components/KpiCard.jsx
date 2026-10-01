import { formatGdp, formatPopulation, formatPercent } from "../utils/formatters";

export default function KpiCard({ title, value, change, type }) {
    const isPositive = change >= 0;

    const renderFormattedValue = () => {
        if (type === "currency") return formatGdp(value);
        if (type === "population") return formatPopulation(value);
        return `${value} р.`;
    };

    return (
        <div className="p-5 bg-white dark:bg-[#1E2235] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        {title}
      </span>
            <div className="mt-4 flex items-baseline justify-between">
        <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          {renderFormattedValue()}
        </span>
                <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        isPositive
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                    }`}
                >
          {formatPercent(change)}
        </span>
            </div>
        </div>
    );
}