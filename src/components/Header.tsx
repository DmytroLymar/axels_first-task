import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Button,
    IconButton,
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    Container
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

type NavItem = { label: string; to: string };

const NAV_ITEMS: NavItem[] = [
    { label: 'Catalog', to: '/catalog' },
    { label: 'Login', to: '/login' }
];

export const Header: React.FC = () => {
    const [open, setOpen] = useState(false);
    const { pathname } = useLocation();

    const closeDrawer = () => setOpen(false);

    return (
        <>
            <AppBar
                position='sticky'
                elevation={0}
                sx={{
                    backdropFilter: 'blur(8px)',
                    borderBottom: '1px solid rgba(255,255,255,0.15)',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
                }}
            >
                <Container maxWidth='lg'>
                    <Toolbar
                        disableGutters
                        sx={{
                            minHeight: { xs: 56, md: 64 },
                            gap: 2
                        }}
                    >
                        {/* Mobile burger */}
                        <IconButton
                            edge='start'
                            color='inherit'
                            aria-label='open navigation menu'
                            onClick={() => setOpen(true)}
                            sx={{ display: { xs: 'inline-flex', md: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>

                        {/* Logo + title */}
                        <Box
                            component={Link}
                            to='/catalog'
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                color: 'inherit',
                                textDecoration: 'none',
                                flexGrow: 1,
                                minWidth: 0
                            }}
                        >
                            <Box
                                component='img'
                                src='/logo.svg'
                                alt='Phone Store logo'
                                sx={{
                                    width: 28,
                                    height: 28,
                                    display: 'block'
                                }}
                            />

                            <Typography
                                variant='h6'
                                sx={{
                                    fontWeight: 800,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                            >
                                Phone Store
                            </Typography>
                        </Box>

                        {/* Desktop nav */}
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5 }}>
                            {NAV_ITEMS.map((item) => {
                                const active = pathname === item.to || pathname.startsWith(item.to + '/');

                                return (
                                    <Button
                                        key={item.to}
                                        component={Link}
                                        to={item.to}
                                        color='inherit'
                                        sx={{
                                            fontWeight: 800,
                                            opacity: active ? 1 : 0.85,
                                            borderRadius: 2,
                                            px: 1.5,
                                            py: 0.75,
                                            '&:hover': { opacity: 1 },
                                            ...(active
                                                ? {
                                                      bgcolor: 'rgba(255,255,255,0.16)'
                                                  }
                                                : {})
                                        }}
                                    >
                                        {item.label}
                                    </Button>
                                );
                            })}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Mobile drawer */}
            <Drawer anchor='left' open={open} onClose={closeDrawer} PaperProps={{ sx: { width: 280 } }}>
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box component='img' src='/logo.svg' alt='Phone Store logo' sx={{ width: 28, height: 28 }} />
                    <Typography fontWeight={900}>Phone Store</Typography>
                </Box>

                <List>
                    {NAV_ITEMS.map((item) => {
                        const active = pathname === item.to || pathname.startsWith(item.to + '/');

                        return (
                            <ListItemButton
                                key={item.to}
                                component={Link}
                                to={item.to}
                                onClick={closeDrawer}
                                selected={active}
                            >
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        );
                    })}
                </List>
            </Drawer>
        </>
    );
};
