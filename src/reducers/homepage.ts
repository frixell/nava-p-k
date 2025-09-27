import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import database from '../firebase/firebase'; // Assuming firebase is configured and exported

// Define a type for a single homepage item
interface HomepageItem {
    id: string;
    // Be specific about the data shape for better type safety
    title: string;
    description: string;
}

// Define the shape of the state for this slice
interface HomepageState {
    items: HomepageItem[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Define the initial state
const initialState: HomepageState = {
    items: [],
    status: 'idle',
    error: null,
};

// Create the async thunk for fetching data
export const fetchHomepageData = createAsyncThunk('homepage/fetchData', async () => {
    const snapshot = await database.ref('homepage').once('value');
    const items: HomepageItem[] = [];
    snapshot.forEach((childSnapshot) => {
        items.push({
            id: childSnapshot.key!,
            ...childSnapshot.val(),
        });
    });
    return items;
});

const homepageSlice = createSlice({
    name: 'homepage',
    initialState,
    reducers: {}, // No synchronous actions needed for this example
    extraReducers: (builder) => {
        builder
            .addCase(fetchHomepageData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchHomepageData.fulfilled, (state, action: PayloadAction<HomepageItem[]>) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchHomepageData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch homepage data';
            });
    },
});

export default homepageSlice.reducer;