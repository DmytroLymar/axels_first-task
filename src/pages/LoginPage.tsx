import React, { useEffect } from 'react';
import { Box, Button, Container, IconButton, InputAdornment, Paper, Stack, TextField, Typography } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { authActions } from '../store/modules/auth/duck';

const styles = {
    page: { minHeight: 'calc(100vh - 65px)', display: 'flex', alignItems: 'center' },
    card: {
        p: { xs: 2.5, md: 3.5 },
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 10px 30px rgba(0,0,0,0.10)'
    },
    title: { fontWeight: 900 },
    button: { borderRadius: 2, py: 1.2, fontWeight: 900 }
};

const schema = yup.object({
    email: yup.string().email('Please enter a valid email').required('Email is required'),
    password: yup.string().min(3, 'Min 3 chars').required('Password is required')
});

export const LoginPage: React.FC = () => {
    const [showPassword, setShowPassword] = React.useState(false);

    const location = useLocation();
    const from = (location.state as { from?: string } | null)?.from || '/catalog';

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, isLoading, error } = useAppSelector((s) => s.auth);

    useEffect(() => {
        if (isAuthenticated) navigate(from, { replace: true });
    }, [isAuthenticated, navigate, from]);

    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema: schema,
        onSubmit: (values) => {
            dispatch(authActions.loginRequest(values));
        }
    });

    return (
        <Box sx={styles.page}>
            <Container maxWidth='sm'>
                <Paper sx={styles.card} elevation={0}>
                    <Typography variant='h5' sx={styles.title} gutterBottom>
                        Sign in
                    </Typography>

                    <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                        Use any credentials — demo UI (login via saga).
                    </Typography>

                    {error && (
                        <Typography variant='body2' color='error' sx={{ mb: 1 }}>
                            {error}
                        </Typography>
                    )}

                    <Box component='form' onSubmit={formik.handleSubmit}>
                        <Stack spacing={2}>
                            <TextField
                                label='Email'
                                name='email'
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email ? formik.errors.email : ' '}
                                fullWidth
                                autoComplete='email'
                            />

                            <TextField
                                label='Password'
                                name='password'
                                type={showPassword ? 'text' : 'password'}
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password ? formik.errors.password : ' '}
                                fullWidth
                                autoComplete='current-password'
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position='end'>
                                                <IconButton
                                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                                    onClick={() => setShowPassword((p) => !p)}
                                                    edge='end'
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }
                                }}
                            />

                            <Button
                                variant='contained'
                                size='large'
                                type='submit'
                                sx={styles.button}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Signing in...' : 'Sign in'}
                            </Button>
                        </Stack>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};
