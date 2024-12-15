"use client";

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Todo {
    _id: string;
    title: string;
    completed: boolean;
}

interface TodoState {
    todos: Todo[];
}

const initialState: TodoState = {
    todos: [],
};

const todoSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        setTodos: (state, action: PayloadAction<Todo[]>) => {
            state.todos = action.payload;
        },
        addTodo: (state, action: PayloadAction<Todo>) => {
            state.todos.push(action.payload);
        },
        updateTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
            const todo = state.todos.find((t) => t._id === action.payload.id);
            if (todo) {
                todo.title = action.payload.title;
            }
        },
        toggleTodo: (state, action: PayloadAction<string>) => {
            const todo = state.todos.find((t) => t._id === action.payload);
            if (todo) {
                todo.completed = !todo.completed;
            }
        },
        deleteTodo: (state, action: PayloadAction<string>) => {
            state.todos = state.todos.filter((t) => t._id !== action.payload);
        },
    },
});

export const { setTodos, addTodo, updateTodo, toggleTodo, deleteTodo } = todoSlice.actions;

export default todoSlice.reducer;
