const REGION_MAP = {
    EAS: "East Asia & Pacific",
    ECS: "Europe & Central Asia",
    LCN: "Latin America & Caribbean",
    MEA: "Middle East & North Africa",
    NAC: "North America",
    SAS: "South Asia",
    SSF: "Sub-Saharan Africa",
};

const AGGREGATE_CODES = new Set([
    "AFE", "AFW", "ARB", "CEB", "CSS", "EAP", "EAR", "ECA", "EAS", "ECS",
    "EMU", "EUU", "FCV", "FCS", "HIC", "HPC", "IBD", "IBT", "IDA", "IDB",
    "IDX", "LAC", "LCN", "LDC", "LIC", "LMC", "LMY", "LTE", "MEA", "MIC",
    "MNA", "NAC", "OED", "OSS", "PRE", "PSS", "PST", "SAS", "SSA", "SSF",
    "SST", "TEA", "TEC", "TLA", "TMN", "TSA", "TSS", "UMC", "WLD",
    "XD", "XT", "XN", "XM", "XQ", "XP", "XU", "XR", "XS", "XJ", "XL", "XO"
]);

export function formatRegionMap(rawCountries) {
    const map = {};
    if (!Array.isArray(rawCountries)) return map;

    rawCountries.forEach((item) => {
        const code = item.id?.toUpperCase();
        const regionName = item.region?.value?.trim();

        if (code && regionName && regionName !== "Aggregates") {
            map[code] = regionName;
        }
    });

    return map;
}

export function filterValidCountries(rawItems) {
    if (!Array.isArray(rawItems)) return [];

    return rawItems.filter((item) => {
        if (item.value === null || item.value === undefined) return false;

        const code = (item.countryiso3code || item.country?.id || "").toUpperCase();

        if (!code) return false;

        return !AGGREGATE_CODES.has(code);
    });
}

export function normalizeCountryData(validItems, regionMap = {}) {
    if (!Array.isArray(validItems)) return [];

    return validItems.map((item) => {
        const code = (item.countryiso3code || item.country?.id || "").toUpperCase();
        const regionName = regionMap[code] || REGION_MAP[code] || "Інші";

        return {
            id: code,
            name: (item.country?.value || item.country || "").trim(),
            region: regionName,
            value: item.value,
            date: item.date,
        };
    });
}