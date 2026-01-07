import { call, put, select, takeLatest } from 'redux-saga/effects';
import { productsActions } from './duck';
import { API_BASE } from '../../../consts';
import type { Product } from '../../../types/Product';
import { createId } from '../../../utils/createId';
import type { Review } from '../../../types/Review';
import type { RootState } from '../..';

type ProductsResponse = { products?: Product[] };

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

function fetchProductsApi() {
    return fetch(`${API_BASE}/products`).then(async (res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return (await res.json()) as ProductsResponse;
    });
}

function* fetchProductsWorker() {
    try {
        const data: ProductsResponse = yield call(fetchProductsApi);
        const list: Product[] = normalizeProducts(data);
        yield put(productsActions.fetchProductsSuccess(list));
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Something went wrong';
        yield put(productsActions.fetchProductsFailure(message));
    }
}

const selectIsAuth = (s: RootState) => s.auth.isAuthenticated;

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

        const review: Review = {
            id: createId(),
            text: trimmed,
            rating
        };

        // якщо треба імітація API — можна delay(200) тут
        yield put(productsActions.addReviewSuccess({ productId, review }));
    } catch {
        yield put(productsActions.addReviewFailure('Failed to add review.'));
    }
}

export function* productsSaga() {
    yield takeLatest(productsActions.fetchProductsRequest.type, fetchProductsWorker);
    yield takeLatest(productsActions.addReviewRequest.type, addReviewWorker);
}
