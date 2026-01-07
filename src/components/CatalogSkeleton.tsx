import { Card, CardActions, CardContent, Divider, Grid, Skeleton } from '@mui/material';

export const CatalogSceletons = () => {
    return (
        <Grid container spacing={2}>
            {Array.from({ length: 6 }).map((_, i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card sx={{ height: '100%' }}>
                        <Skeleton variant='rectangular' height={180} />

                        <CardContent>
                            <Skeleton width='70%' height={28} />
                            <Skeleton width='100%' />
                            <Skeleton width='85%' />
                        </CardContent>

                        <Divider />

                        <CardActions sx={{ justifyContent: 'space-between' }}>
                            <Skeleton width={90} height={32} />
                            <Skeleton width={60} height={32} />
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};
