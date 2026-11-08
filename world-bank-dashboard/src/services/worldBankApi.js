import { formatRegionMap, filterValidCountries, normalizeCountryData } from "../utils/dataFormatters";

const BASE_URL = "https://api.worldbank.org/v2";
const PER_PAGE = 500;
const HISTORY_YEARS = 10;

class ApiError extends Error {
    constructor(message) {
        super(message);
        this.name = "ApiError";
    }
}

let regionMapCache = null;
const countriesCache = new Map();

async function requestJson(url, signal) {
    const res = await fetch(url, { signal });

    if (!res.ok) {
        throw new Error(`Сервер відповів помилкою: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();

    const apiMessage = json?.[0]?.message?.[0];
    if (apiMessage) {
        throw new ApiError(`World Bank API: ${apiMessage.value || apiMessage.key || "невідома помилка"}`);
    }

    return json;
}

async function getRegionMap(signal) {
    if (regionMapCache) return regionMapCache;

    try {
        const json = await requestJson(`${BASE_URL}/country?per_page=400&format=json`, signal);
        const map = formatRegionMap(json?.[1]);
        if (Object.keys(map).length > 0) regionMapCache = map;
        return map;
    } catch (err) {
        if (err.name === "AbortError") throw err;
        return {};
    }
}

function buildIndicatorUrl(indicator, year, page) {
    return (
        `${BASE_URL}/country/all/indicator/${encodeURIComponent(indicator)}` +
        `?date=${encodeURIComponent(year)}&format=json&per_page=${PER_PAGE}&page=${page}`
    );
}

/** Список країн з показником за рік  */
export async function fetchWorldBankData(indicator = "NY.GDP.MKTP.CD", year = 2022, signal) {
    const cacheKey = `${indicator}:${year}`;
    if (countriesCache.has(cacheKey)) return countriesCache.get(cacheKey);

    const [regionMap, firstPage] = await Promise.all([
        getRegionMap(signal),
        requestJson(buildIndicatorUrl(indicator, year, 1), signal),
    ]);

    const totalPages = firstPage?.[0]?.pages ?? 1;
    let allItems = firstPage?.[1] || [];

    if (totalPages > 1) {
        const rest = await Promise.all(
            Array.from({ length: totalPages - 1 }, (_, i) =>
                requestJson(buildIndicatorUrl(indicator, year, i + 2), signal)
            )
        );
        rest.forEach((page) => {
            if (page?.[1]) allItems = allItems.concat(page[1]);
        });
    }

    const result = normalizeCountryData(filterValidCountries(allItems), regionMap);
    countriesCache.set(cacheKey, result);
    return result;
}

async function getCountrySeries(iso, indicator, fromYear, toYear, signal) {
    const json = await requestJson(
        `${BASE_URL}/country/${iso}/indicator/${indicator}?date=${fromYear}:${toYear}&format=json&per_page=100`,
        signal
    );

    return (json?.[1] || [])
        .filter((item) => item.value !== null && item.value !== undefined)
        .map((item) => ({ date: String(item.date), value: item.value }))
        .sort((a, b) => Number(a.date) - Number(b.date));
}

function valueAt(series, year) {
    return series.find((point) => point.date === String(year))?.value ?? null;
}

/** деталі */
const detailsCache = new Map();

export async function fetchCountryDetails(code, year = 2022, signal) {
    const iso = String(code ?? "").trim().toUpperCase();
    if (!/^[A-Z]{3}$/.test(iso)) return null;

    const cacheKey = `${iso}:${year}`;
    if (detailsCache.has(cacheKey)) return detailsCache.get(cacheKey);

    const fromYear = year - HISTORY_YEARS + 1;

    const metaPromise = requestJson(`${BASE_URL}/country/${iso}?format=json`, signal)
        .then((json) => json?.[1]?.[0] ?? null)
        .catch((err) => {
            if (err instanceof ApiError) return null;
            throw err;
        });

    const seriesPromise = Promise.all([
        getCountrySeries(iso, "NY.GDP.MKTP.CD", fromYear, year, signal),
        getCountrySeries(iso, "SP.POP.TOTL", fromYear, year, signal),
        getCountrySeries(iso, "NY.GDP.PCAP.CD", fromYear, year, signal),
    ]);
    seriesPromise.catch(() => {});

    const meta = await metaPromise;
    if (!meta || meta.region?.value === "Aggregates") return null;

    const [gdpSeries, populationSeries, perCapitaSeries] = await seriesPromise;

    const result = {
        id: (meta.id || iso).toUpperCase(),
        iso2: meta.iso2Code || "",
        name: (meta.name || iso).trim(),
        region: meta.region?.value?.trim() || "",
        incomeLevel: meta.incomeLevel?.value?.trim() || "",
        lendingType: meta.lendingType?.value?.trim() || "",
        capital: meta.capitalCity?.trim() || "",
        latitude: meta.latitude || "",
        longitude: meta.longitude || "",
        year,
        gdp: valueAt(gdpSeries, year),
        population: valueAt(populationSeries, year),
        gdpPerCapita: valueAt(perCapitaSeries, year),
        gdpHistory: gdpSeries,
    };

    detailsCache.set(cacheKey, result);
    return result;
}