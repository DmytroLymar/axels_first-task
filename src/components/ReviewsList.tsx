import { Divider, List, ListItem, ListItemText, Rating, Stack, Typography } from '@mui/material';
import { Fragment } from 'react';
import type { Review } from '../types/Review';

export const ReviewsList: React.FC<{ reviews: Review[] }> = ({ reviews }) => {
    if (reviews.length === 0) {
        return (
            <Typography variant='body2' color='text.secondary'>
                No reviews yet.
            </Typography>
        );
    }

    return (
        <List dense disablePadding>
            {reviews.map((review) => (
                <Fragment key={review.id}>
                    <ListItem disableGutters sx={{ py: 1 }}>
                        <ListItemText
                            primary={
                                <Stack direction='row' spacing={1} alignItems='center' justifyContent='space-between'>
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
    );
};
