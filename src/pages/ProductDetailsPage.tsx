import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemText,
    Paper,
    Rating,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import { Fragment, useCallback, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Review } from '../types/Review';
import { getAverageRating } from '../utils/rating';
import { useProduct } from '../hooks/useProduct';

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

const createId = () => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return crypto.randomUUID();
    }

    return String(Date.now());
};

export const ProductDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const { product, isLoading, error, setProduct } = useProduct(id);

    const [text, setText] = useState('');
    const [rating, setRating] = useState(5);

    const avgRating = useMemo(() => {
        const list = product?.reviews;
        if (!Array.isArray(list) || list.length === 0) return 0;
        return getAverageRating(list);
    }, [product?.reviews]);

    const reviewsCount = product?.reviews?.length ?? 0;

    const handleAddReview = () => {
        if (!text.trim()) return;

        const newReview: Review = {
            id: createId(),
            text: text.trim(),
            rating
        };

        setProduct((prev) => {
            if (!prev) return prev;
            const prevReviews = Array.isArray(prev.reviews) ? prev.reviews : [];
            return { ...prev, reviews: [...prevReviews, newReview] };
        });

        setText('');
        setRating(5);
    };

    const handleRatingChange = useCallback((_: unknown, value: number | null) => {
        setRating(value ?? 1);
    }, []);

    if (!id) {
        return (
            <Container maxWidth='lg' sx={styles.container}>
                <Alert severity='error'>Missing product id in URL</Alert>
            </Container>
        );
    }

    if (isLoading) {
        return (
            <Container maxWidth='lg' sx={styles.container}>
                <Stack direction='row' spacing={2} alignItems='center'>
                    <CircularProgress size={22} />
                    <Typography>Loading product…</Typography>
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

                        {reviewsCount > 0 ? (
                            <List dense disablePadding>
                                {product?.reviews.map((review) => (
                                    <Fragment key={review.id}>
                                        <ListItem disableGutters sx={styles.reviewItem}>
                                            <ListItemText
                                                primary={
                                                    <Stack
                                                        direction='row'
                                                        spacing={1}
                                                        alignItems='center'
                                                        justifyContent='space-between'
                                                    >
                                                        <Typography variant='body2'>{review.text}</Typography>
                                                        <Rating value={review.rating} readOnly size='small' />
                                                    </Stack>
                                                }
                                            />
                                        </ListItem>
                                        <Divider />
                                    </Fragment>
                                ))}
                            </List>
                        ) : (
                            <Typography variant='body2' color='text.secondary'>
                                No reviews yet.
                            </Typography>
                        )}

                        <Divider sx={styles.dividerSection} />

                        <Typography variant='h6' fontWeight={800} gutterBottom>
                            Leave a review
                        </Typography>

                        <Stack spacing={2}>
                            <TextField
                                label='Your review'
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                fullWidth
                                multiline
                                minRows={3}
                            />

                            <Stack direction='row' spacing={2} alignItems='center'>
                                <Typography variant='body2' color='text.secondary'>
                                    Rating:
                                </Typography>
                                <Rating value={rating} onChange={handleRatingChange} />
                            </Stack>

                            <Button variant='contained' onClick={handleAddReview} disabled={!text.trim()}>
                                Submit review
                            </Button>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};
