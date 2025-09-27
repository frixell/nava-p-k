import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import database from '../firebase/firebase';

// Define a type for a single category item
export interface Category {
    id: string;
    // Assuming a structure like this, adjust as needed
    name: string;
    description?: string;
    [key: string]: any;
}

// Define the shape of the state for this slice
interface CategoriesState {
    items: Category[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Define the initial state
const initialState: CategoriesState = {
    items: [],
    status: 'idle',
    error: null,
};

// Create the async thunk for fetching data, renaming for convention
export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
    const snapshot = await database.ref('categories').once('value');
    const items: Category[] = [];
    snapshot.forEach((childSnapshot) => {
        items.push({
            id: childSnapshot.key!,
            ...childSnapshot.val(),
        });
    });
    return items;
});

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {}, // No synchronous reducers needed for this slice
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch categories';
            });
    },
});

export default categoriesSlice.reducer;