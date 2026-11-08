import { useState, useEffect } from "react";

export function useFetch(fetchCallback, deps = []) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        setLoading(true);
        setError(null);

        fetchCallback(controller.signal)
            .then((result) => {
                setData(result);
                setLoading(false);
            })
            .catch((err) => {
                if (err.name !== "AbortError") {
                    setError(err.message || "Невідома помилка мережі");
                    setLoading(false);
                }
            });

        return () => {
            controller.abort();
        };
    }, deps);

    return { data, loading, error };
}