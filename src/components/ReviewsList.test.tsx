import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { ReviewsList } from './ReviewsList';
import { renderWithProviders } from '../test/testUtils';

describe('ReviewsList', () => {
    it('matches snapshot (empty)', () => {
        const { asFragment } = renderWithProviders(<ReviewsList reviews={[]} />);
        expect(asFragment()).toMatchSnapshot();
        expect(screen.getByText(/No reviews yet/i)).toBeInTheDocument();
    });

    it('matches snapshot (with items)', () => {
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
