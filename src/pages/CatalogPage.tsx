import { Container, Typography, Stack, Grid, Alert } from '@mui/material';
import { CatalogSceletons } from '../components/CatalogSkeleton';
import { ProductCard } from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';

const styles = {
    root: { py: { xs: 3, md: 4 } },
    header: { mb: 2 },
    grid: { xs: 12, sm: 6, md: 4 }
};

export const CatalogPage: React.FC = () => {
    const { products, isLoading, error } = useProducts();

    return (
        <Container maxWidth='lg' sx={styles.root}>
            <Stack spacing={0.5} sx={styles.header}>
                <Typography variant='h5' fontWeight={900}>
                    Catalog
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                    List of products. Click a card to open details.
                </Typography>
            </Stack>

            {isLoading && <CatalogSceletons />}

            {!isLoading && error && <Alert severity='error'>{error}</Alert>}

            {!isLoading && !error && (
                <Grid container spacing={2}>
                    {products.map((p) => (
                        <Grid key={p.id} size={styles.grid}>
                            <ProductCard product={p} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};
