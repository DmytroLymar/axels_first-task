import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ReviewSection } from './ReviewSection';
import { renderWithProviders } from '../test/testUtils';

describe('ReviewSection', () => {
    it('matches snapshot (logged out shows Sign in)', () => {
        const { asFragment } = renderWithProviders(<ReviewSection productId='p1' />, {
            route: '/products/p1',
            preloadedState: {
                auth: { user: null, isAuthenticated: false, isLoading: false, error: null },
                products: {
                    items: [],
                    isLoading: false,
                    error: null,
                    reviewSubmitting: false,
                    reviewError: null
                }
            }
        });

        expect(asFragment()).toMatchSnapshot();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('matches snapshot (logged in shows form)', () => {
        const { asFragment } = renderWithProviders(<ReviewSection productId='p1' />, {
            route: '/products/p1',
            preloadedState: {
                auth: {
                    user: { id: 'u1', name: 'Demo', email: 'demo@mail.com' },
                    isAuthenticated: true,
                    isLoading: false,
                    error: null
                },
                products: {
                    items: [],
                    isLoading: false,
                    error: null,
                    reviewSubmitting: false,
                    reviewError: null
                }
            }
        });

        expect(asFragment()).toMatchSnapshot();
        expect(screen.getByLabelText(/Your review/i)).toBeInTheDocument();
    });

    it('disables submit when text is empty', async () => {
        const user = userEvent.setup();
        renderWithProviders(<ReviewSection productId='p1' />, {
            route: '/products/p1',
            preloadedState: {
                auth: {
                    user: { id: 'u1', name: 'Demo', email: 'demo@mail.com' },
                    isAuthenticated: true,
                    isLoading: false,
                    error: null
                },
                products: {
                    items: [],
                    isLoading: false,
                    error: null,
                    reviewSubmitting: false,
                    reviewError: null
                }
            }
        });

        const btn = screen.getByRole('button', { name: /Submit review/i });
        expect(btn).toBeDisabled();

        await user.type(screen.getByLabelText(/Your review/i), 'Hello');
        expect(btn).toBeEnabled();
    });
});
