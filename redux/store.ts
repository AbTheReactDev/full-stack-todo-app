"use client";

import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './todoSlice';
import authReducer from './authSlice';
import themeReducer from './themeSlice';

export const store = configureStore({
    reducer: {
        todos: todoReducer,
        theme: themeReducer,
        auth : authReducer
    },
    devTools: true,
});

// Types for the Redux store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
