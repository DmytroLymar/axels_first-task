import { useCallback, useEffect, useState } from 'react';
import type { Product } from '../types/Product';
import { API_BASE } from '../consts';

type ProductsResponse = {
    products?: Product[];
};

type UseProductsResult = {
    products: Product[];
    isLoading: boolean;
    error: string;
    refetch: () => void;
};

export const useProducts = (): UseProductsResult => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [reloadKey, setReloadKey] = useState(0);

    const refetch = useCallback(() => {
        setReloadKey((k) => k + 1);
    }, []);

    useEffect(() => {
        const load = async () => {
            try {
                setIsLoading(true);
                setError('');

                const response = await fetch(`${API_BASE}/products`);
                if (!response.ok) {
                    throw new Error(`Request failed: ${response.status}`);
                }

                const data = (await response.json()) as ProductsResponse;
                const list = Array.isArray(data.products) ? data.products : [];

                setProducts(list);
            } catch (e) {
                const message = e instanceof Error ? e.message : 'Something went wrong';
                setError(message);
                setProducts([]);
            } finally {
                setIsLoading(false);
            }
        };

        load();
    }, [reloadKey]);

    return { products, isLoading, error, refetch };
};
