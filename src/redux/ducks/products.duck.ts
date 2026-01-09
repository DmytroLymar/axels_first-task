import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import type { RootState } from '../store';
import { API_BASE } from '../../consts';
import type { Product } from '../../types/Product';
import type { Review } from '../../types/Review';
import { createId } from '../../utils/createId';

/** Types */
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

type AddReviewPayload = { productId: string; text: string; rating: number };
type AddReviewSuccessPayload = { productId: string; review: Review };

/** Slice */
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

/** Selectors */
export const selectProductsMeta = (s: RootState) => ({
    itemsCount: s.products.items.length,
    isLoading: s.products.isLoading,
    error: s.products.error
});

export const selectReviewSubmitting = (s: RootState) => s.products.reviewSubmitting;
export const selectReviewError = (s: RootState) => s.products.reviewError;

export const selectProductById = (id?: string) => (s: RootState) => s.products.items.find((p) => p.id === id) ?? null;

const selectIsAuth = (s: RootState) => s.auth.isAuthenticated;

/** API */
function fetchProductsApi(): Promise<unknown> {
    return fetch(`${API_BASE}/products`).then(async (res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json() as Promise<unknown>;
    });
}

// safe normalize
function isProduct(value: unknown): value is Product {
    if (!value || typeof value !== 'object') return false;
    const v = value as Record<string, unknown>;
    return (
        typeof v.id === 'string' &&
        typeof v.name === 'string' &&
        typeof v.image === 'string' &&
        typeof v.description === 'string' &&
        Array.isArray(v.reviews)
    );
}

function normalizeProducts(data: unknown): Product[] {
    if (!data || typeof data !== 'object') return [];
    const products = (data as { products?: unknown }).products;
    if (!Array.isArray(products)) return [];
    return products.filter(isProduct);
}

/** Saga workers */
function* fetchProductsWorker() {
    try {
        const data: unknown = yield call(fetchProductsApi);
        const list: Product[] = normalizeProducts(data);
        yield put(productsActions.fetchProductsSuccess(list));
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Something went wrong';
        yield put(productsActions.fetchProductsFailure(message));
    }
}

function* addReviewWorker(action: ReturnType<typeof productsActions.addReviewRequest>) {
    try {
        const isAuth: boolean = yield select(selectIsAuth);
        if (!isAuth) {
            yield put(productsActions.addReviewFailure('You need to sign in to leave a review.'));
            return;
        }

        const { productId, text, rating } = action.payload;
        const trimmed = text.trim();
        if (!trimmed) {
            yield put(productsActions.addReviewFailure('Review text is required.'));
            return;
        }

        const review: Review = { id: createId(), text: trimmed, rating };
        yield put(productsActions.addReviewSuccess({ productId, review }));
    } catch {
        yield put(productsActions.addReviewFailure('Failed to add review.'));
    }
}

/** Saga watcher */
export function* productsSaga() {
    yield takeLatest(productsActions.fetchProductsRequest.type, fetchProductsWorker);
    yield takeLatest(productsActions.addReviewRequest.type, addReviewWorker);
}
