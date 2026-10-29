export function formatGdp(value) {
    if (value === undefined || value === null || isNaN(value)) return "—";
    if (value >= 1e12) {
        return `$${(value / 1e12).toFixed(2)} Трлн`;
    }
    if (value >= 1e9) {
        return `$${(value / 1e9).toFixed(1)} Млрд`;
    }
    return `$${Number(value).toLocaleString()}`;
}

export function formatPercent(value) {
    if (value === undefined || value === null || isNaN(value)) return "—";
    const num = Number(value);
    const prefix = num > 0 ? "+" : "";
    return `${prefix}${num.toFixed(1)}%`;
}

export function formatPopulation(value) {
    if (value === undefined || value === null || isNaN(value)) return "—";
    const num = Number(value);
    if (num >= 1e9) {
        return `${(num / 1e9).toFixed(2)} Млрд`;
    }
    if (num >= 1e6) {
        return `${(num / 1e6).toFixed(1)} Млн`;
    }
    return num.toLocaleString();
}

export function formatNumber(value) {
    if (value === undefined || value === null || isNaN(value)) return "0";
    return Number(value).toLocaleString();
}