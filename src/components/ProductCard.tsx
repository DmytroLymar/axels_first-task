import {
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Divider,
    Stack,
    Typography,
    Button,
    Rating,
    Box
} from '@mui/material';
import { Link } from 'react-router-dom';
import type { Product } from '../types/Product';

type Props = {
    product: Product;
};

const getAverageRating = (reviews: Product['reviews']) => {
    if (!reviews.length) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
};

export const ProductCard: React.FC<Props> = ({ product }) => {
    const avgRating = getAverageRating(product.reviews);
    const reviewsCount = product.reviews.length;

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                overflow: 'hidden',
                transition: 'transform .15s ease, box-shadow .15s ease',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: 6 }
            }}
        >
            <Box component={Link} to={`/products/${product.id}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                <CardMedia
                    component='img'
                    image={product.image}
                    alt={product.name}
                    sx={{
                        height: 220,
                        width: '100%',
                        objectFit: 'contain',
                        bgcolor: 'grey.50',
                        p: 1.5
                    }}
                />

                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant='h6' fontWeight={800}>
                        {product.name}
                    </Typography>

                    <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{
                            mt: 0.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                        }}
                    >
                        {product.description}
                    </Typography>

                    <Stack direction='row' spacing={1} alignItems='center' sx={{ mt: 1 }}>
                        <Rating value={avgRating} precision={0.5} readOnly size='small' />
                        <Typography variant='body2' color='text.secondary'>
                            {reviewsCount > 0 ? `(${reviewsCount})` : '(No reviews)'}
                        </Typography>
                    </Stack>
                </CardContent>
            </Box>

            <Divider />

            <CardActions sx={{ justifyContent: 'space-between' }}>
                <Button component={Link} to={`/products/${product.id}`}>
                    View details
                </Button>
            </CardActions>
        </Card>
    );
};
