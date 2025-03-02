"use client";

import { Theme } from '@/types/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


const loadThemeFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
        const storedTheme = localStorage.getItem('theme') as Theme;
        return storedTheme || Theme.LIGHT; 
    }
    return Theme.LIGHT;
};

const saveThemeToLocalStorage = (theme: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('theme', theme);
    }
};

const initialState : {theme : Theme} = {
    theme: loadThemeFromLocalStorage(),
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT
            saveThemeToLocalStorage(state.theme)
        },
        setTheme: (state, action: PayloadAction<Theme>) => {
            state.theme = action.payload
            saveThemeToLocalStorage(state.theme);
        }
    },
});

export const { toggleTheme, setTheme } = themeSlice.actions;

export default themeSlice.reducer;
