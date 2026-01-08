import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { ProductCard } from '../../components/ProductCard';
import { renderWithProviders } from '../testUtils';

const product = {
    id: 'p1',
    name: 'Iphone 17',
    image: 'https://example.com/a.png',
    description: 'desc',
    reviews: []
};

describe('ProductCard', () => {
    it('should match a snapshot', () => {
        const { asFragment } = renderWithProviders(<ProductCard product={product} />, {
            route: '/catalog'
        });

        expect(asFragment()).toMatchSnapshot();
    });

    it('should navigate to product details page when clicking View details', () => {
        renderWithProviders(<ProductCard product={product} />, {
            route: '/catalog'
        });

        const link = screen.getByRole('link', { name: /view details/i });

        expect(link).toHaveAttribute('href', `/products/${product.id}`);
    });
});
