import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { LoginPage } from './LoginPage';
import { renderWithProviders } from '../test/testUtils';

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

describe('LoginPage', () => {
    beforeEach(() => {
        navigateMock.mockClear();
    });

    it('matches snapshot', () => {
        const { asFragment } = renderWithProviders(<LoginPage />, {
            route: '/login',
            preloadedState: {
                auth: {
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: null
                }
            }
        });

        expect(asFragment()).toMatchSnapshot();
    });

    it('shows validation errors on blur', async () => {
        const user = userEvent.setup();

        renderWithProviders(<LoginPage />, {
            route: '/login',
            preloadedState: {
                auth: {
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: null
                }
            }
        });

        const email = screen.getByLabelText(/^email$/i);
        const password = document.querySelector('input[name="password"]') as HTMLInputElement;
        expect(password).toBeTruthy();

        await user.click(email);
        await user.tab();

        expect(await screen.findByText(/email is required/i)).toBeInTheDocument();

        await user.type(email, 'bad');
        await user.tab();
        expect(await screen.findByText(/please enter a valid email/i)).toBeInTheDocument();

        await user.click(password);
        await user.tab();
        expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
    });

    it('dispatches loginRequest with form values on submit (valid)', async () => {
        const user = userEvent.setup();

        const { store } = renderWithProviders(<LoginPage />, {
            route: '/login',
            preloadedState: {
                auth: {
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: null
                }
            }
        });

        const spy = vi.spyOn(store, 'dispatch');

        await user.type(screen.getByLabelText(/email/i), 'demo@mail.com');
        const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement;
        expect(passwordInput).toBeTruthy();
        await user.type(passwordInput, '123');

        await user.click(screen.getByRole('button', { name: /^sign in$/i }));

        await waitFor(() => {
            expect(spy).toHaveBeenCalled();
        });

        expect(spy).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'auth/loginRequest',
                payload: { email: 'demo@mail.com', password: '123' }
            })
        );
    });

    it("redirects to 'from' when already authenticated", async () => {
        renderWithProviders(<LoginPage />, {
            route: '/login',
            preloadedState: {
                auth: {
                    user: { id: 'u1', name: 'Demo', email: 'demo@mail.com' },
                    isAuthenticated: true,
                    isLoading: false,
                    error: null
                }
            }
        });

        await waitFor(() => {
            expect(navigateMock).toHaveBeenCalledWith('/catalog', { replace: true });
        });
    });

    it('redirects to location.state.from when already authenticated', async () => {
        renderWithProviders(<LoginPage />, {
            routerEntries: [{ pathname: '/login', state: { from: '/products/p1' } }],
            preloadedState: {
                auth: {
                    user: { id: 'u1', name: 'Demo', email: 'demo@mail.com' },
                    isAuthenticated: true,
                    isLoading: false,
                    error: null
                }
            }
        });

        await waitFor(() => {
            expect(navigateMock).toHaveBeenCalledWith('/products/p1', { replace: true });
        });
    });
});
