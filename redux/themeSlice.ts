"use client";

import { createSlice, PayloadAction } from '@reduxjs/toolkit';


const loadThemeFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
        const storedTheme = localStorage.getItem('theme');
        return storedTheme || 'light'; // Default to 'light' if no theme is stored
    }
    return 'light';
};

const saveThemeToLocalStorage = (theme: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('theme', theme);
    }
};

const initialState = {
    theme: loadThemeFromLocalStorage(),
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === "light" ? "dark" : "light"
            saveThemeToLocalStorage(state.theme)
        },
        setTheme: (state, action: PayloadAction<string>) => {
            state.theme = action.payload
        }
    },
});

export const { toggleTheme, setTheme } = themeSlice.actions;

export default themeSlice.reducer;
