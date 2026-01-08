import { combineReducers } from '@reduxjs/toolkit';
import { authReducer } from './ducks/auth.duck';
import { productsReducer } from './ducks/products.duck';

export const rootReducer = combineReducers({
    auth: authReducer,
    products: productsReducer
});
