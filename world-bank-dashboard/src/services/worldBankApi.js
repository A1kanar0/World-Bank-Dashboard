import { formatRegionMap, filterValidCountries, normalizeCountryData } from "../utils/dataFormatters";

const BASE_URL = "https://api.worldbank.org/v2";

async function getRegionMap(signal) {
    try {
        const res = await fetch(`${BASE_URL}/country?per_page=400&format=json`, { signal });
        if (!res.ok) return {};
        const data = await res.json();
        return formatRegionMap(data?.[1]);
    } catch {
        return {};
    }
}

export async function fetchWorldBankData(indicator = "NY.GDP.MKTP.CD", year = 2022, signal) {
    const regionMap = await getRegionMap(signal);

    const firstUrl = `${BASE_URL}/country/all/indicator/${indicator}?date=${year}&format=json&per_page=500&page=1`;
    const res = await fetch(firstUrl, { signal });

    if (!res.ok) {
        throw new Error(`Сервер відповів помилкою: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const rawList = data?.[1] || [];
    const meta = data?.[0];

    let allItems = [...rawList];

    if (meta && meta.pages > 1) {
        const pagePromises = [];
        for (let page = 2; page <= meta.pages; page++) {
            const pageUrl = `${BASE_URL}/country/all/indicator/${indicator}?date=${year}&format=json&per_page=500&page=${page}`;
            pagePromises.push(
                fetch(pageUrl, { signal }).then((r) => {
                    if (!r.ok) throw new Error(`Помилка завантаження сторінки ${page}`);
                    return r.json();
                })
            );
        }

        const pagesData = await Promise.all(pagePromises);
        pagesData.forEach((pData) => {
            if (pData?.[1]) allItems = allItems.concat(pData[1]);
        });
    }

    const validCountries = filterValidCountries(allItems);
    return normalizeCountryData(validCountries, regionMap);
}