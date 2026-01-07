import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { CatalogPage } from '../pages/CatalogPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';

export const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path='/' element={<Navigate to='/login' replace />} />
            <Route path='/login' element={<LoginPage />} />

            <Route path='/catalog' element={<CatalogPage />} />

            <Route path='/products/:id' element={<ProductDetailsPage />} />

            <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
    );
};
