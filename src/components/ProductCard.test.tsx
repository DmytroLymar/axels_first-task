import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { ProductCard } from './ProductCard';
import { renderWithProviders } from '../test/testUtils';

const product = {
    id: 'p1',
    name: 'Iphone 17',
    image: 'https://example.com/a.png',
    description: 'desc',
    reviews: []
};

describe('ProductCard', () => {
    it('matches snapshot', () => {
        const { asFragment } = renderWithProviders(<ProductCard product={product} />, {
            route: '/catalog'
        });

        expect(asFragment()).toMatchSnapshot();
    });

    it('navigates to product details link', () => {
        renderWithProviders(<ProductCard product={product} />, { route: '/catalog' });

        const link = screen.getByRole('link', { name: /view details/i });
        expect(link).toHaveAttribute('href', `/products/${product.id}`);
    });
});
