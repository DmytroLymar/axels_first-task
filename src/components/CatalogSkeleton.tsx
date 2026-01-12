import { Grid } from '@mui/material';
import { CardSkeleton } from './CardSkeleton';

export const CatalogSkeleton = () => {
    return (
        <Grid container spacing={2}>
            {Array.from({ length: 6 }).map((_, i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                    <CardSkeleton />
                </Grid>
            ))}
        </Grid>
    );
};
