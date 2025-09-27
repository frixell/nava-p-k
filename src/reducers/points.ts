import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import database from '../firebase/firebase';

// Define a type for a single point item
export interface Point {
    id: string;
    // Assuming a structure with coordinates, adjust as needed
    lat: number;
    lng: number;
    name: string;
    [key: string]: any;
}

// Define the shape of the state for this slice
interface PointsState {
    items: Point[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Define the initial state
const initialState: PointsState = {
    items: [],
    status: 'idle',
    error: null,
};

// Create the async thunk for fetching data
export const fetchPoints = createAsyncThunk('points/fetchPoints', async () => {
    const snapshot = await database.ref('points').once('value');
    const items: Point[] = [];
    snapshot.forEach((childSnapshot) => {
        items.push({
            id: childSnapshot.key!,
            ...childSnapshot.val(),
        });
    });
    return items;
});

const pointsSlice = createSlice({
    name: 'points',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPoints.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchPoints.fulfilled, (state, action: PayloadAction<Point[]>) => { state.status = 'succeeded'; state.items = action.payload; })
            .addCase(fetchPoints.rejected, (state, action) => { state.status = 'failed'; state.error = action.error.message || 'Failed to fetch points'; });
    },
});

export default pointsSlice.reducer;