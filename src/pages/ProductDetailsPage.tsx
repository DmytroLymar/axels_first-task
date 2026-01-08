import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Divider,
    Grid,
    Paper,
    Rating,
    Stack,
    Typography
} from '@mui/material';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAverageRating } from '../utils/rating';
import { ReviewsList } from '../components/ReviewsList';
import { ReviewSection } from '../components/ReviewSection';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { productsActions, selectProductById, selectProductsMeta } from '../redux/ducks/products.duck';

const styles = {
    container: { py: 4 },
    headerRow: { mb: 2 },
    imagePaper: { p: 2 },
    image: {
        width: '100%',
        height: { xs: 260, md: 360 },
        objectFit: 'contain',
        bgcolor: 'background.default',
        p: 1,
        borderRadius: 2
    },
    rightPaper: { p: 2 },
    dividerSection: { my: 2 },
    reviewItem: { py: 1 },
    ratingRow: { mt: 0.5 }
};

export const ProductDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();

    const { itemsCount, isLoading, error } = useAppSelector(selectProductsMeta);
    const product = useAppSelector(selectProductById(id));

    useEffect(() => {
        if (itemsCount === 0) dispatch(productsActions.fetchProductsRequest());
    }, [dispatch, itemsCount]);

    const reviews = product?.reviews ?? [];
    const reviewsCount = reviews.length;
    const avgRating = reviewsCount ? getAverageRating(reviews) : 0;

    if (!id) {
        return (
            <Container maxWidth='lg' sx={styles.container}>
                <Alert severity='error'>Missing product id in URL</Alert>
            </Container>
        );
    }

    const isInitialLoading = itemsCount === 0 && isLoading;
    if (isInitialLoading) {
        return (
            <Container maxWidth='lg' sx={styles.container}>
                <Stack direction='row' spacing={2} alignItems='center'>
                    <CircularProgress size={22} />
                    <Typography>Loading products…</Typography>
                </Stack>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth='lg' sx={styles.container}>
                <Stack spacing={2}>
                    <Alert severity='error'>{error}</Alert>
                    <Button component={Link} to='/catalog' variant='outlined'>
                        Back to catalog
                    </Button>
                </Stack>
            </Container>
        );
    }

    if (!product) {
        return (
            <Container maxWidth='lg' sx={styles.container}>
                <Typography variant='h6' fontWeight={800} color='error'>
                    Product not found
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth='lg' sx={styles.container}>
            <Stack direction='row' spacing={2} alignItems='center' sx={styles.headerRow}>
                <Button component={Link} to='/catalog' variant='outlined'>
                    Back to catalog
                </Button>

                <Stack spacing={0.5}>
                    <Typography variant='h4' fontWeight={800}>
                        {product.name}
                    </Typography>

                    <Stack direction='row' spacing={1} alignItems='center' sx={styles.ratingRow}>
                        <Rating value={avgRating} precision={0.5} readOnly size='small' />
                        <Typography variant='body2' color='text.secondary'>
                            ({reviewsCount})
                        </Typography>
                    </Stack>
                </Stack>
            </Stack>

            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={styles.imagePaper}>
                        <Box component='img' src={product.image} alt={product.name} sx={styles.image} />
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={styles.rightPaper}>
                        <Typography variant='h6' fontWeight={800} gutterBottom>
                            Description
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                            {product.description}
                        </Typography>

                        <Divider sx={styles.dividerSection} />

                        <Typography variant='h6' fontWeight={800} gutterBottom>
                            Reviews
                        </Typography>

                        <ReviewsList reviews={reviews} />

                        <ReviewSection productId={id} />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};
