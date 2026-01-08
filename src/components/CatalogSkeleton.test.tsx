import { describe, it, expect } from 'vitest';
import { CatalogSkeleton } from './CatalogSkeleton';
import { renderWithProviders } from '../test/testUtils';

describe('CatalogSkeleton', () => {
    it('matches snapshot', () => {
        const { asFragment } = renderWithProviders(<CatalogSkeleton />);
        expect(asFragment()).toMatchSnapshot();
    });
});
