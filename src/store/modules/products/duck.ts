import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../../types/Product';
import type { Review } from '../../../types/Review';

type ProductsState = {
    items: Product[];
    isLoading: boolean;
    error: string | null;

    reviewSubmitting: boolean;
    reviewError: string | null;
};

const initialState: ProductsState = {
    items: [],
    isLoading: false,
    error: null,

    reviewSubmitting: false,
    reviewError: null
};

type AddReviewPayload = {
    productId: string;
    text: string;
    rating: number;
};

type AddReviewSuccessPayload = {
    productId: string;
    review: Review;
};

const slice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        fetchProductsRequest(state) {
            state.isLoading = true;
            state.error = null;
        },
        fetchProductsSuccess(state, action: PayloadAction<Product[]>) {
            state.isLoading = false;
            state.items = action.payload;
        },
        fetchProductsFailure(state, action: PayloadAction<string>) {
            state.isLoading = false;
            state.items = [];
            state.error = action.payload;
        },

        addReviewRequest(state, _action: PayloadAction<AddReviewPayload>) {
            state.reviewSubmitting = true;
            state.reviewError = null;
        },
        addReviewSuccess(state, action: PayloadAction<AddReviewSuccessPayload>) {
            state.reviewSubmitting = false;

            const { productId, review } = action.payload;
            const p = state.items.find((x) => x.id === productId);
            if (!p) return;

            const prev = Array.isArray(p.reviews) ? p.reviews : [];
            p.reviews = [...prev, review];
        },
        addReviewFailure(state, action: PayloadAction<string>) {
            state.reviewSubmitting = false;
            state.reviewError = action.payload;
        },
        clearReviewError(state) {
            state.reviewError = null;
        }
    }
});

export const productsActions = slice.actions;
export const productsReducer = slice.reducer;
