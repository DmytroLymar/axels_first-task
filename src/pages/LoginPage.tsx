import * as React from 'react';
import { Container, Paper, Typography, Stack, TextField, Button, Box, InputAdornment, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const styles = {
    page: {
        minHeight: 'calc(100vh - 65px)',
        display: 'flex',
        alignItems: 'center'
    },
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

const isEmailValid = (value: string) => /^\S+@\S+\.\S+$/.test(value);

export const LoginPage: React.FC = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [touched, setTouched] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);

    const navigate = useNavigate();

    const emailError = touched && email.length > 0 && !isEmailValid(email);
    const canSubmit = email.trim().length > 0 && password.trim().length > 0 && !emailError;

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        setTouched(true);

        if (!canSubmit) return;

        navigate('/catalog');
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <Box sx={styles.page}>
            <Container maxWidth='sm'>
                <Paper sx={styles.card} elevation={0}>
                    <Typography variant='h5' sx={styles.title} gutterBottom>
                        Sign in
                    </Typography>

                    <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                        Use any credentials — demo UI (no API).
                    </Typography>

                    <Box component='form' onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            <TextField
                                label='Email'
                                type='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={() => setTouched(true)}
                                error={emailError}
                                helperText={emailError ? 'Please enter a valid email' : ' '}
                                fullWidth
                                autoComplete='email'
                            />

                            <TextField
                                label='Password'
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                fullWidth
                                autoComplete='current-password'
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position='end'>
                                                <IconButton
                                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                                    onClick={handleTogglePasswordVisibility}
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
                                disabled={!canSubmit}
                            >
                                Sign in
                            </Button>
                        </Stack>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};
