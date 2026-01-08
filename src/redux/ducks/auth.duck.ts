import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { delay, put, takeLatest } from 'redux-saga/effects';
import type { RootState } from '../store';
import type { User } from '../../types/User';

/** Types */
export type LoginPayload = { email: string; password: string };

type AuthState = {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
};

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
};

/** Slice */
const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginRequest(state, _action: PayloadAction<LoginPayload>) {
            state.isLoading = true;
            state.error = null;
        },
        loginSuccess(state, action: PayloadAction<User>) {
            state.isLoading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        loginFailure(state, action: PayloadAction<string>) {
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
            state.error = action.payload;
        },
        logout(state) {
            state.user = null;
            state.isAuthenticated = false;
            state.isLoading = false;
            state.error = null;
        }
    }
});

export const authActions = slice.actions;
export const authReducer = slice.reducer;

/** Selectors */
export const selectIsAuth = (s: RootState) => s.auth.isAuthenticated;
export const selectAuthUser = (s: RootState) => s.auth.user;
export const selectAuthLoading = (s: RootState) => s.auth.isLoading;
export const selectAuthError = (s: RootState) => s.auth.error;

/** Saga workers */
function* loginWorker(action: ReturnType<typeof authActions.loginRequest>) {
    try {
        yield delay(400);

        const { email } = action.payload;

        yield put(
            authActions.loginSuccess({
                id: 'u1',
                name: 'Demo User',
                email
            })
        );
    } catch {
        yield put(authActions.loginFailure('Login failed'));
    }
}

/** Saga watcher */
export function* authSaga() {
    yield takeLatest(authActions.loginRequest.type, loginWorker);
}
