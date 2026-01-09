import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ReviewSection } from '../../components/ReviewSection';
import { renderWithProviders } from '../testUtils';

const baseProductsState = {
    items: [],
    isLoading: false,
    error: null,
    reviewSubmitting: false,
    reviewError: null
};

const loggedOutState = {
    auth: { user: null, isAuthenticated: false, isLoading: false, error: null },
    products: baseProductsState
};

const loggedInState = {
    auth: {
        user: { id: 'u1', name: 'Demo', email: 'demo@mail.com' },
        isAuthenticated: true,
        isLoading: false,
        error: null
    },
    products: baseProductsState
};

describe('ReviewSection', () => {
    it('should match a snapshot when logged out', () => {
        const { asFragment } = renderWithProviders(<ReviewSection productId='p1' />, {
            route: '/products/p1',
            preloadedState: loggedOutState
        });

        expect(asFragment()).toMatchSnapshot();
    });

    it('should show Sign in button when logged out', () => {
        renderWithProviders(<ReviewSection productId='p1' />, {
            route: '/products/p1',
            preloadedState: loggedOutState
        });

        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('should match a snapshot when logged in', () => {
        const { asFragment } = renderWithProviders(<ReviewSection productId='p1' />, {
            route: '/products/p1',
            preloadedState: loggedInState
        });

        expect(asFragment()).toMatchSnapshot();
    });

    it('should show review input when logged in', () => {
        renderWithProviders(<ReviewSection productId='p1' />, {
            route: '/products/p1',
            preloadedState: loggedInState
        });

        expect(screen.getByLabelText(/your review/i)).toBeInTheDocument();
    });

    it('should disable submit button when text is empty', () => {
        renderWithProviders(<ReviewSection productId='p1' />, {
            route: '/products/p1',
            preloadedState: loggedInState
        });

        expect(screen.getByRole('button', { name: /submit review/i })).toBeDisabled();
    });

    it('should enable submit button when user types text', async () => {
        const user = userEvent.setup();

        renderWithProviders(<ReviewSection productId='p1' />, {
            route: '/products/p1',
            preloadedState: loggedInState
        });

        await user.type(screen.getByLabelText(/your review/i), 'Hello');

        expect(screen.getByRole('button', { name: /submit review/i })).toBeEnabled();
    });
});
