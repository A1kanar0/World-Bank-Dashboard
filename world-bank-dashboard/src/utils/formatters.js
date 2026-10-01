export function formatGdp(value) {
    if (value >= 1e12) {
        return `$${(value / 1e12).toFixed(2)} Трлн`;
    }
    if (value >= 1e9) {
        return `$${(value / 1e9).toFixed(1)} Млрд`;
    }
    return `$${value.toLocaleString()}`;
}

export function formatPercent(value) {
    const prefix = value > 0 ? "+" : "";
    return `${prefix}${value.toFixed(1)}%`;
}

export function formatPopulation(value) {
    if (value >= 1e9) {
        return `${(value / 1e9).toFixed(2)} Млрд`;
    }
    if (value >= 1e6) {
        return `${(value / 1e6).toFixed(1)} Млн`;
    }
    return value.toLocaleString();
}