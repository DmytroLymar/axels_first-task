import { Card, CardActions, CardContent, Divider, Skeleton } from '@mui/material';

export const CardSkeleton = () => {
    return (
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
    );
};
