import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { ReviewsList } from '../../components/ReviewsList';
import { renderWithProviders } from '../testUtils';

describe('ReviewsList', () => {
    it('should match a snapshot when reviews list is empty', () => {
        const { asFragment } = renderWithProviders(<ReviewsList reviews={[]} />);

        expect(asFragment()).toMatchSnapshot();
    });

    it('should show empty state text when there are no reviews', () => {
        renderWithProviders(<ReviewsList reviews={[]} />);

        expect(screen.getByText(/no reviews yet/i)).toBeInTheDocument();
    });

    it('should match a snapshot when reviews list has items', () => {
        const { asFragment } = renderWithProviders(
            <ReviewsList
                reviews={[
                    { id: 'r1', text: 'Nice', rating: 5 },
                    { id: 'r2', text: 'Ok', rating: 3 }
                ]}
            />
        );

        expect(asFragment()).toMatchSnapshot();
    });
});
