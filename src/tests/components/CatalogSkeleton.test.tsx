import { describe, it, expect } from 'vitest';
import { CatalogSkeleton } from '../../components/CatalogSkeleton';
import { renderWithProviders } from '../testUtils';

describe('CatalogSkeleton', () => {
    it('should match a snapshot', () => {
        const { asFragment } = renderWithProviders(<CatalogSkeleton />);
        expect(asFragment()).toMatchSnapshot();
    });
});
