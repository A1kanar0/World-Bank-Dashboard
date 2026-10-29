import { useState, useEffect } from "react";

/**
 * @param {Function} fetchFunction - Асинхронна функція для запиту
 * @param {Array|Object} params - Параметри запиту, при зміні яких виконується перезапит
 */
export function useFetch(fetchFunction, params = null) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isSubscribed = true;
        setLoading(true);
        setError(null);

        fetchFunction(params)
            .then((result) => {
                if (isSubscribed) {
                    setData(result);
                    setLoading(false);
                }
            })
            .catch((err) => {
                if (isSubscribed) {
                    setError(err.message || "Помилка при завантаженні даних");
                    setLoading(false);
                }
            });

        return () => {
            isSubscribed = false;
        };
    }, [fetchFunction, JSON.stringify(params)]);

    return { data, loading, error };
}