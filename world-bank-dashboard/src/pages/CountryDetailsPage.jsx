import { Link, Navigate, useParams, useSearchParams } from "react-router";
import { useFetch } from "../hooks/useFetch";
import { fetchCountryDetails } from "../services/worldBankApi";
import { DEFAULT_YEAR, MAX_YEAR, MIN_YEAR } from "../constants/filterConstants";
import { formatGdp, formatPopulation } from "../utils/formatters";

const CARD_CLS =
    "p-5 bg-white dark:bg-[#1E2235] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm";

function parseYear(raw) {
    const year = Number(raw);
    return Number.isInteger(year) && year >= MIN_YEAR && year <= MAX_YEAR ? year : DEFAULT_YEAR;
}

function BackLink() {
    return (
        <Link
            to="/"
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-[#1E2235] text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:opacity-80 transition"
        >
            ← Назад до дашборду
        </Link>
    );
}

function StatCard({ title, value }) {
    return (
        <div className={CARD_CLS}>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {title}
            </span>
            <p className="mt-4 text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{value}</p>
        </div>
    );
}

function InfoRow({ label, value }) {
    return (
        <div className="flex items-baseline justify-between gap-4 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
            <dt className="text-xs text-gray-500 dark:text-gray-400">{label}</dt>
            <dd className="text-xs font-semibold text-gray-900 dark:text-white text-right">{value || "—"}</dd>
        </div>
    );
}

function GdpHistory({ history }) {
    if (history.length === 0) {
        return <p className="text-xs text-gray-500 dark:text-gray-400">Даних за цей період немає.</p>;
    }

    const max = Math.max(...history.map((point) => point.value));

    return (
        <ul className="space-y-2">
            {history.map(({ date, value }) => (
                <li key={date} className="flex items-center gap-3 text-xs">
                    <span className="w-10 text-gray-500 dark:text-gray-400">{date}</span>
                    <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-[#121522] overflow-hidden">
                        <div
                            className="h-full rounded-full bg-indigo-500"
                            style={{ width: `${max > 0 ? (value / max) * 100 : 0}%` }}
                        />
                    </div>
                    <span className="w-24 text-right font-medium text-gray-800 dark:text-gray-200">
                        {formatGdp(value)}
                    </span>
                </li>
            ))}
        </ul>
    );
}

export default function CountryDetailsPage() {
    const { code } = useParams();
    const [searchParams] = useSearchParams();
    const rawYear = searchParams.get("year");
    const year = parseYear(rawYear);

    const { data, loading, error } = useFetch(
        (signal) => fetchCountryDetails(code, year, signal),
        [code, year]
    );

    if (rawYear !== String(year)) {
        return <Navigate to={`/country/${encodeURIComponent(code)}?year=${year}`} replace />;
    }

    let content;

    if (loading) {
        content = (
            <div className={`${CARD_CLS} text-center`}>
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent mb-2"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Завантаження даних про країну...</p>
            </div>
        );
    } else if (error) {
        content = (
            <div className="p-6 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-2xl text-center">
                <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">⚠️ Помилка завантаження: {error}</p>
            </div>
        );
    } else if (!data) {
        // неіснуючий id
        content = (
            <div className={`${CARD_CLS} text-center`}>
                <p className="text-4xl mb-2">🔍</p>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Країну не знайдено</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Країни з кодом «{code}» не існує. Поверніться до списку й виберіть країну зі списку.
                </p>
            </div>
        );
    } else {
        const perCapita = data.gdpPerCapita == null ? null : Math.round(data.gdpPerCapita);
        const coordinates = data.latitude && data.longitude ? `${data.latitude}, ${data.longitude}` : "";

        content = (
            <>
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{data.name}</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {data.id} · {data.region || "регіон невідомий"} · дані за {data.year} рік
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                    <StatCard title={`ВВП (${data.year})`} value={formatGdp(data.gdp)} />
                    <StatCard title="Населення" value={formatPopulation(data.population)} />
                    <StatCard title="ВВП на душу населення" value={formatGdp(perCapita)} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <section className={CARD_CLS}>
                        <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                            Загальна інформація
                        </h3>
                        <dl>
                            <InfoRow label="Код ISO3" value={data.id} />
                            <InfoRow label="Код ISO2" value={data.iso2} />
                            <InfoRow label="Регіон" value={data.region} />
                            <InfoRow label="Столиця" value={data.capital} />
                            <InfoRow label="Рівень доходу" value={data.incomeLevel} />
                            <InfoRow label="Тип кредитування" value={data.lendingType} />
                            <InfoRow label="Координати (широта, довгота)" value={coordinates} />
                        </dl>
                    </section>

                    <section className={CARD_CLS}>
                        <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                            ВВП за останні 10 років
                        </h3>
                        <GdpHistory history={data.gdpHistory} />
                    </section>
                </div>
            </>
        );
    }

    return (
        <main className="max-w-6xl mx-auto">
            <BackLink />
            {content}
        </main>
    );
}