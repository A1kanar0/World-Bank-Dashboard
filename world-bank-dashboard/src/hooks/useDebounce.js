import { useState, useEffect } from "react";

/**
 * @param {any} value - Значення, яке змінюється
 * @param {number} delay - Затримка в мілісекундах (за замовчуванням 400 мс)
 */
export function useDebounce(value, delay = 400) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}