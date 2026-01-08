import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Header } from './Header';
import { renderWithProviders } from '../test/testUtils';

describe('Header', () => {
    it('matches snapshot (logged out)', () => {
        const { asFragment } = renderWithProviders(<Header />, {
            route: '/catalog',
            preloadedState: {
                auth: { user: null, isAuthenticated: false, isLoading: false, error: null }
            }
        });

        expect(asFragment()).toMatchSnapshot();
        expect(screen.getByText('Login')).toBeInTheDocument();
    });

    it('matches snapshot (logged in shows Logout)', () => {
        const { asFragment } = renderWithProviders(<Header />, {
            route: '/catalog',
            preloadedState: {
                auth: {
                    user: { id: 'u1', name: 'Demo', email: 'demo@mail.com' },
                    isAuthenticated: true,
                    isLoading: false,
                    error: null
                }
            }
        });

        expect(asFragment()).toMatchSnapshot();
        expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    it('dispatches logout on Logout click', async () => {
        const user = userEvent.setup();

        const { store } = renderWithProviders(<Header />, {
            route: '/catalog',
            preloadedState: {
                auth: {
                    user: { id: 'u1', name: 'Demo', email: 'demo@mail.com' },
                    isAuthenticated: true,
                    isLoading: false,
                    error: null
                }
            }
        });

        await user.click(screen.getByText('Logout'));

        expect(store.getState().auth.isAuthenticated).toBe(false);
    });
});
