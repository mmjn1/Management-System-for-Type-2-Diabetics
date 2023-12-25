import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/api/userslice';

export const store = configureStore({
    reducer: {
        user: userReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',

});

export default store;