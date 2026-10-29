const BASE_URL = "https://api.worldbank.org/v2";

const AGGREGATE_CODES = new Set([
    "AFE", "AFW", "ARB", "CEB", "CSS", "EAP", "EAR", "EAS", "ECA", "ECS",
    "EMU", "EUU", "FCV", "FCS", "HIC", "HPC", "IBD", "IBT", "IDA", "IDB",
    "IDX", "LAC", "LCN", "LDC", "LIC", "LMC", "LMY", "LTE", "MEA", "MIC",
    "MNA", "NAC", "OED", "OSS", "PRE", "PSS", "PST", "SAS", "SSA", "SSF",
    "SST", "TEA", "TEC", "TLA", "TMN", "TSA", "TSS", "UMC", "WLD"
]);

export async function fetchWorldBankData(indicator = "NY.GDP.MKTP.CD", year = 2022) {
    const response = await fetch(
        `${BASE_URL}/country/all/indicator/${indicator}?date=${year}&format=json&per_page=500`
    );

    if (!response.ok) {
        throw new Error(`Помилка API: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || !data[1] || !Array.isArray(data[1])) {
        return [];
    }

    return data[1]
        .filter((item) => {
            if (!item.countryiso3code || item.value === null) return false;

            const code = item.countryiso3code.toUpperCase();

            if (AGGREGATE_CODES.has(code)) return false;

            return true;
        })
        .map((item) => ({
            id: item.countryiso3code,
            name: item.country?.value || item.country,
            region: (typeof item.region === "object" ? item.region?.value : item.region) || "Країна",
            value: item.value,
            date: item.date,
        }));
}