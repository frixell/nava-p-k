import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import database from '../firebase/firebase';

// Define a type for a single teaching item
export interface TeachingItem {
    id: string;
    image: string;
    details: string;
    description: string;
    detailsHebrew: string;
    descriptionHebrew: string;
    order: number;
}

// Define a type for the entire page data
export interface TeachingPageData {
    teachings: TeachingItem[];
    seo?: { [key: string]: any };
}

// Define the shape of the state for this slice
interface TeachingPageState {
    // We will store teachings directly on the state
    teachings: TeachingItem[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Define the initial state
const initialState: TeachingPageState = {
    teachings: [],
    status: 'idle',
    error: null,
};

// Create the async thunk for fetching data
export const fetchTeachingPageData = createAsyncThunk('teachingpage/fetchData', async () => {
    const snapshot = await database.ref('teachingpage').once('value');
    const pageData = snapshot.val();
    
    const teachingsArray: TeachingItem[] = [];
    if (pageData?.teachings) {
        Object.keys(pageData.teachings).forEach((key) => {
            teachingsArray.push({
                id: key,
                ...pageData.teachings[key]
            });
        });
    }
    return teachingsArray.sort((a, b) => a.order - b.order);
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
            .addCase(fetchTeachingPageData.fulfilled, (state, action: PayloadAction<TeachingItem[]>) => {
                state.status = 'succeeded';
                state.teachings = action.payload;
            })
            .addCase(fetchTeachingPageData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch teaching page data';
            });
    },
});

export default teachingpageSlice.reducer;