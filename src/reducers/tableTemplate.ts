import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import database from '../firebase/firebase';

// Define a type for the table template data.
// This is a guess based on the name; please adjust to your actual data structure.
export interface TableTemplate {
    [key: string]: any; // Using a generic object type for now
}

// Define the shape of the state for this slice.
// It holds a single object rather than an array of items.
interface TableTemplateState {
    data: TableTemplate | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Define the initial state
const initialState: TableTemplateState = {
    data: null,
    status: 'idle',
    error: null,
};

// Create the async thunk for fetching data
export const fetchTableTemplate = createAsyncThunk('tableTemplate/fetchTableTemplate', async () => {
    const snapshot = await database.ref('tableTemplate').once('value');
    // Assuming tableTemplate is a single object in Firebase
    return snapshot.val() as TableTemplate;
});

const tableTemplateSlice = createSlice({
    name: 'tableTemplate',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTableTemplate.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTableTemplate.fulfilled, (state, action: PayloadAction<TableTemplate>) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchTableTemplate.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch table template';
            });
    },
});

export default tableTemplateSlice.reducer;