import type { RootState } from '../../index';

export const selectProductsMeta = (s: RootState) => ({
    itemsCount: s.products.items.length,
    isLoading: s.products.isLoading,
    error: s.products.error
});

export const selectReviewMeta = (s: RootState) => ({
    reviewSubmitting: s.products.reviewSubmitting,
    reviewError: s.products.reviewError
});

export const selectProductById = (id?: string) => (s: RootState) => s.products.items.find((p) => p.id === id) ?? null;
