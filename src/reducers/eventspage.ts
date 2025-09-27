import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchCategories, Category } from './categories';

// Define the shape of the state for this slice
interface EventsPageState {
    // This slice might hold filters, selected categories, etc.
    // For now, we'll assume it holds a copy of the categories.
    categories: Category[];
    status: 'idle' | 'succeeded';
}

// Define the initial state
const initialState: EventsPageState = {
    categories: [],
    status: 'idle',
};

const eventspageSlice = createSlice({
    name: 'eventspage',
    initialState,
    reducers: {
        // Add any synchronous actions for this slice here if needed
    },
    extraReducers: (builder) => {
        // This reducer will run when `fetchCategories.fulfilled` is dispatched
        builder.addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
            state.categories = action.payload;
            state.status = 'succeeded';
        });
    },
});

export default eventspageSlice.reducer;