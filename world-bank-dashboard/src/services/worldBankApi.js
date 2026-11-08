import { formatRegionMap, filterValidCountries, normalizeCountryData } from "../utils/dataFormatters.js";

const BASE_URL = "https://api.worldbank.org/v2";
const PER_PAGE = 500;

let regionMapCache = null;

async function requestJson(url, signal) {
    const res = await fetch(url, { signal });

    if (!res.ok) {
        throw new Error(`Сервер відповів помилкою: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();

    const apiMessage = json?.[0]?.message?.[0];
    if (apiMessage) {
        throw new Error(`World Bank API: ${apiMessage.value || apiMessage.key || "невідома помилка"}`);
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

export async function fetchWorldBankData(indicator = "NY.GDP.MKTP.CD", year = 2022, signal) {
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

    return normalizeCountryData(filterValidCountries(allItems), regionMap);
}