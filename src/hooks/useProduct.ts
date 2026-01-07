import { useCallback, useEffect, useState } from 'react';
import type { Product } from '../types/Product';
import { API_BASE } from '../consts';

type UseProductResult = {
    product: Product | null;
    isLoading: boolean;
    error: string;
    refetch: () => void;
    setProduct: React.Dispatch<React.SetStateAction<Product | null>>;
};

export const useProduct = (id?: string): UseProductResult => {
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [reloadKey, setReloadKey] = useState(0);

    const refetch = useCallback(() => {
        setReloadKey((k) => k + 1);
    }, []);

    useEffect(() => {
        const load = async () => {
            if (!id) {
                setProduct(null);
                setIsLoading(false);
                setError('Missing product id');
                return;
            }

            try {
                setIsLoading(true);
                setError('');

                const response = await fetch(`${API_BASE}/products/${id}`);
                if (!response.ok) {
                    throw new Error(`Request failed: ${response.status}`);
                }

                const data = (await response.json()) as Product;

                setProduct(data ?? null);
            } catch (e) {
                const message = e instanceof Error ? e.message : 'Something went wrong';
                setError(message);
                setProduct(null);
            } finally {
                setIsLoading(false);
            }
        };

        load();
    }, [id, reloadKey]);

    return { product, isLoading, error, refetch, setProduct };
};
