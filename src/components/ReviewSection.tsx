import { Alert, Button, Rating, Stack, TextField, Typography } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { productsActions, selectReviewError, selectReviewSubmitting } from '../redux/ducks/products.duck';

type Props = {
    productId: string;
};

export const ReviewSection: React.FC<Props> = ({ productId }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const isAuth = useAppSelector((s) => s.auth.isAuthenticated);
    const reviewSubmitting = useAppSelector(selectReviewSubmitting);
    const reviewError = useAppSelector(selectReviewError);

    const [text, setText] = useState('');
    const [rating, setRating] = useState(5);

    const from = useMemo(() => `/products/${productId}`, [productId]);

    const goToLogin = useCallback(() => {
        navigate('/login', { state: { from } });
    }, [navigate, from]);

    useEffect(() => {
        if (reviewError && text.trim().length > 0) {
            dispatch(productsActions.clearReviewError());
        }
    }, [text, reviewError, dispatch]);

    const submit = useCallback(() => {
        if (!isAuth) return goToLogin();

        dispatch(
            productsActions.addReviewRequest({
                productId,
                text,
                rating
            })
        );

        setText('');
        setRating(5);
    }, [isAuth, goToLogin, dispatch, productId, text, rating]);

    return (
        <Stack spacing={2}>
            <Typography variant='h6' fontWeight={800} gutterBottom>
                Leave a review
            </Typography>

            {!isAuth ? (
                <Stack spacing={2}>
                    <Alert severity='info'>You need to sign in to leave a review.</Alert>
                    <Button variant='contained' onClick={goToLogin}>
                        Sign in
                    </Button>
                </Stack>
            ) : (
                <>
                    {reviewError && <Alert severity='error'>{reviewError}</Alert>}

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
                        <Rating value={rating} onChange={(_, v) => setRating(v ?? 1)} />
                    </Stack>

                    <Button variant='contained' onClick={submit} disabled={reviewSubmitting || !text.trim()}>
                        {reviewSubmitting ? 'Submitting...' : 'Submit review'}
                    </Button>
                </>
            )}
        </Stack>
    );
};
