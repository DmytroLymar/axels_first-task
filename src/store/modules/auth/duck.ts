import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../../types/User';

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

type LoginPayload = { email: string; password: string };

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
            state.error = action.payload;
            state.user = null;
            state.isAuthenticated = false;
        },
        logout(state) {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            state.isLoading = false;
        }
    }
});

export const authActions = slice.actions;
export const authReducer = slice.reducer;
