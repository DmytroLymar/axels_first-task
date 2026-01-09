import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../testUtils';
import { Header } from '../../components/Header';

const loggedOutState = {
    auth: { user: null, isAuthenticated: false, isLoading: false, error: null }
};

const loggedInState = {
    auth: {
        user: { id: 'u1', name: 'Demo', email: 'demo@mail.com' },
        isAuthenticated: true,
        isLoading: false,
        error: null
    }
};

describe('Header', () => {
    it('should match a snapshot when logged out', () => {
        const { asFragment } = renderWithProviders(<Header />, {
            route: '/catalog',
            preloadedState: loggedOutState
        });

        expect(asFragment()).toMatchSnapshot();
    });

    it('should show Login when logged out', () => {
        renderWithProviders(<Header />, {
            route: '/catalog',
            preloadedState: loggedOutState
        });

        expect(screen.getByText('Login')).toBeInTheDocument();
    });

    it('should match a snapshot when logged in', () => {
        const { asFragment } = renderWithProviders(<Header />, {
            route: '/catalog',
            preloadedState: loggedInState
        });

        expect(asFragment()).toMatchSnapshot();
    });

    it('should show Logout when logged in', () => {
        renderWithProviders(<Header />, {
            route: '/catalog',
            preloadedState: loggedInState
        });

        expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    it('should logout after clicking Logout', async () => {
        const user = userEvent.setup();

        const { store } = renderWithProviders(<Header />, {
            route: '/catalog',
            preloadedState: loggedInState
        });

        await user.click(screen.getByRole('button', { name: /logout/i }));

        expect(store.getState().auth.isAuthenticated).toBe(false);
    });
});
