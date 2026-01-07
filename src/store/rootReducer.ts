import { combineReducers } from '@reduxjs/toolkit';
import { authReducer } from './modules/auth/duck';
import { productsReducer } from './modules/products/duck';

export const rootReducer = combineReducers({
    auth: authReducer,
    products: productsReducer
});
