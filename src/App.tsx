import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { Box } from '@mui/material';
import { Header } from './components/Header';
import { LoginPage } from './pages/LoginPage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';

function App() {
    return (
        <BrowserRouter>
            <Box>
                <Header />

                <Routes>
                    <Route path='/' element={<Navigate to='/login' replace />} />

                    <Route path='/login' element={<LoginPage />} />
                    <Route path='/catalog' element={<CatalogPage />} />
                    <Route path='/catalog/:id' element={<ProductDetailsPage />} />
                </Routes>
            </Box>
        </BrowserRouter>
    );
}

export default App;
