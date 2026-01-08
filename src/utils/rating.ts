import type { Review } from '../types/Review';

export const getAverageRating = (reviews: Review[]): number => {
    if (reviews.length === 0) return 0;

    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / reviews.length;
};
