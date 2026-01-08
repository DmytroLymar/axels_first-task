import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginPage } from '../../pages/LoginPage';
import { renderWithProviders } from '../testUtils';

vi.mock('@mui/icons-material', async () => {
    const React = await import('react');
    return {
        Visibility: () => React.createElement('span', { 'data-testid': 'icon-visibility' }),
        VisibilityOff: () => React.createElement('span', { 'data-testid': 'icon-visibilityoff' })
    };
});

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return {
        ...actual,
        useNavigate: () => navigateMock
    };
});

const loggedOutState = {
    auth: {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
    }
} as const;

const loggedInState = {
    auth: {
        user: { id: 'u1', name: 'Demo', email: 'demo@mail.com' },
        isAuthenticated: true,
        isLoading: false,
        error: null
    }
} as const;

const getPasswordInput = () => document.querySelector('input[name="password"]') as HTMLInputElement | null;

describe('LoginPage', () => {
    beforeEach(() => {
        navigateMock.mockClear();
    });

    it('should match a snapshot', () => {
        const { asFragment } = renderWithProviders(<LoginPage />, {
            route: '/login',
            preloadedState: loggedOutState
        });

        expect(asFragment()).toMatchSnapshot();
    });

    it('should render password input', () => {
        renderWithProviders(<LoginPage />, { route: '/login', preloadedState: loggedOutState });

        expect(getPasswordInput()).toBeTruthy();
    });

    it('should show "Email is required" after email blur', async () => {
        const user = userEvent.setup();
        renderWithProviders(<LoginPage />, { route: '/login', preloadedState: loggedOutState });

        const email = screen.getByLabelText(/^email$/i);

        await user.click(email);
        await user.tab();

        expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    });

    it('should show "Please enter a valid email" after invalid email blur', async () => {
        const user = userEvent.setup();
        renderWithProviders(<LoginPage />, { route: '/login', preloadedState: loggedOutState });

        const email = screen.getByLabelText(/^email$/i);

        await user.type(email, 'bad');
        await user.tab();

        expect(await screen.findByText(/please enter a valid email/i)).toBeInTheDocument();
    });

    it('should show "Password is required" after password blur', async () => {
        const user = userEvent.setup();
        renderWithProviders(<LoginPage />, { route: '/login', preloadedState: loggedOutState });

        const password = getPasswordInput();
        if (!password) throw new Error('Password input not found');

        await user.click(password);
        await user.tab();

        expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
    });

    it('should dispatch loginRequest when form is valid and submitted', async () => {
        const user = userEvent.setup();

        const { store } = renderWithProviders(<LoginPage />, {
            route: '/login',
            preloadedState: loggedOutState
        });

        const spy = vi.spyOn(store, 'dispatch');

        await user.type(screen.getByLabelText(/email/i), 'demo@mail.com');

        const password = getPasswordInput();
        if (!password) throw new Error('Password input not found');

        await user.type(password, '123');
        await user.click(screen.getByRole('button', { name: /^sign in$/i }));

        await waitFor(() => {
            expect(spy).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'auth/loginRequest',
                    payload: { email: 'demo@mail.com', password: '123' }
                })
            );
        });
    });

    it("should redirect to '/catalog' when already authenticated", async () => {
        renderWithProviders(<LoginPage />, {
            route: '/login',
            preloadedState: loggedInState
        });

        await waitFor(() => {
            expect(navigateMock).toHaveBeenCalledWith('/catalog', { replace: true });
        });
    });

    it('should redirect to location.state.from when already authenticated', async () => {
        renderWithProviders(<LoginPage />, {
            routerEntries: [{ pathname: '/login', state: { from: '/products/p1' } }],
            preloadedState: loggedInState
        });

        await waitFor(() => {
            expect(navigateMock).toHaveBeenCalledWith('/products/p1', { replace: true });
        });
    });
});
