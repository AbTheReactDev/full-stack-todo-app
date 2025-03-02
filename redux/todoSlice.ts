"use client";

import { Todo } from '@/types/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


const loadTodosFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
        const storedTodos = localStorage.getItem('todos');
        return storedTodos ? JSON.parse(storedTodos) : []; // Parse JSON to get array
    }
    return [];
};

const saveTodosToLocalStorage = (todos: any[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('todos', JSON.stringify(todos)); 
    }
};

interface TodoState {
    todos: Todo[];
}

const initialState: TodoState = {
    todos: loadTodosFromLocalStorage(),
};

const todoSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        getTodos: (state, action: PayloadAction<Todo[]>) => {
            state.todos = action.payload;
        },

        addTodo: (state, action: PayloadAction<Todo>) => {
            state.todos.push(action.payload);
            saveTodosToLocalStorage(state.todos)
        },
        updateTodo: (state, action: PayloadAction<{ id: string; title: string }>) => {
            const todo = state.todos.find((t) => t._id === action.payload.id);
            if (todo) {
                todo.title = action.payload.title;
                saveTodosToLocalStorage(state.todos)
            }

        },
        toggleTodo: (state, action: PayloadAction<string>) => {
            const todo = state.todos.find((t) => t._id === action.payload);
            if (todo) {
                todo.completed = !todo.completed;
                saveTodosToLocalStorage(state.todos)
            }
        },
        deleteTodo: (state, action: PayloadAction<string>) => {
            state.todos = state.todos.filter((t) => t._id !== action.payload);
            saveTodosToLocalStorage(state.todos)
        },
    },
});

export const { getTodos, addTodo, updateTodo, toggleTodo, deleteTodo } = todoSlice.actions;

export default todoSlice.reducer;
