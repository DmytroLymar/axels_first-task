import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { rootReducer } from '../redux/rootReducer';
import type { RootState } from '../redux/store';

type RenderOptions = {
    route?: string;
    preloadedState?: Partial<RootState>;
    routerEntries?: Array<string | { pathname: string; state?: unknown }>;
};

export function renderWithProviders(
    ui: React.ReactElement,
    { route = '/', preloadedState, routerEntries }: RenderOptions = {}
) {
    const store = configureStore({
        reducer: rootReducer,
        preloadedState,
        middleware: (gDM) => gDM({ thunk: false, serializableCheck: false })
    });

    return {
        store,
        ...render(
            <Provider store={store}>
                <MemoryRouter initialEntries={routerEntries ?? [route ?? '/']}>{ui}</MemoryRouter>
            </Provider>
        )
    };
}
