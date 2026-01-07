import type { Review } from './Review';

export type Product = {
    id: string;
    name: string;
    image: string;
    description: string;
    reviews: Review[];
};
