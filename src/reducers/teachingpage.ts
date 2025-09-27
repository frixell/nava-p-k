import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import database from '../firebase/firebase';

// Define a type for the teaching page data.
// This is a guess; please adjust to your actual data structure.
export interface TeachingPageData {
    title: string;
    content: string;
    imageUrl?: string;
}

// Define the shape of the state for this slice
interface TeachingPageState {
    data: TeachingPageData | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Define the initial state
const initialState: TeachingPageState = {
    data: null,
    status: 'idle',
    error: null,
};

// Create the async thunk for fetching data
export const fetchTeachingPageData = createAsyncThunk('teachingpage/fetchData', async () => {
    const snapshot = await database.ref('teachingpage').once('value');
    return snapshot.val() as TeachingPageData;
});

const teachingpageSlice = createSlice({
    name: 'teachingpage',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTeachingPageData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTeachingPageData.fulfilled, (state, action: PayloadAction<TeachingPageData>) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchTeachingPageData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch teaching page data';
            });
    },
});

export default teachingpageSlice.reducer;