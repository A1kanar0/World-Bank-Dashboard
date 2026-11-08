import { useState, useEffect } from "react";

/**
 * Універсальний хук завантаження даних.
 *
 * @param {(signal: AbortSignal) => Promise<any>} fetchCallback - функція запиту; має приймати signal
 * @param {any[]} deps - залежності запиту (лише примітиви: рядки, числа, булеві)
 * @returns {{ data: any, loading: boolean, error: string | null }}
 */
export function useFetch(fetchCallback, deps = []) {
    const [state, setState] = useState({ data: null, loading: true, error: null });

    useEffect(() => {
        const controller = new AbortController();

        setState((prev) => ({ ...prev, loading: true, error: null }));

        Promise.resolve()
            .then(() => fetchCallback(controller.signal))
            .then((result) => {
                if (controller.signal.aborted) return; // застаріла відповідь
                setState({ data: result, loading: false, error: null });
            })
            .catch((err) => {
                if (controller.signal.aborted || err?.name === "AbortError") return;
                setState((prev) => ({
                    ...prev,
                    loading: false,
                    error: err?.message || "Невідома помилка мережі",
                }));
            });

        return () => controller.abort();
    }, deps);

    return state;
}