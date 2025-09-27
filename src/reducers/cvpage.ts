import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import database from '../firebase/firebase';

// Define a type for a single item within a CV section
export interface CVItem {
    year: string;
    description: string;
}

// Define a type for a CV section (e.g., "Education", "Exhibitions")
export interface CVSection {
    title: string;
    items: CVItem[];
}

// Define a type for the entire CV page data structure
export interface CVPageData {
    title: string;
    sections: CVSection[];
}

// Define the shape of the state for this slice
interface CVPageState {
    data: CVPageData | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Define the initial state
const initialState: CVPageState = {
    data: null,
    status: 'idle',
    error: null,
};

/**
 * A robust utility to convert a Firebase object (or an array) into a guaranteed array.
 * @param data The data from Firebase, which could be an object or an array.
 */
const firebaseObjectToArray = <T>(data: Record<string, T> | T[] | undefined): T[] => {
    if (!data) {
        return [];
    }
    if (Array.isArray(data)) {
        return data; // It's already an array
    }
    return Object.values(data);
};

// Create the async thunk for fetching data
export const fetchCVPageData = createAsyncThunk<CVPageData>(
    'cvpage/fetchData', 
    async () => {
    const snapshot = await database.ref('cvpage').once('value');
    const rawData = snapshot.val();

    // A temporary interface to describe a section before its 'items' are converted to an array.
    type RawCVSection = Omit<CVSection, 'items'> & {
        items?: Record<string, CVItem> | CVItem[];
    };
    
    const sections: CVSection[] = firebaseObjectToArray<RawCVSection>(rawData?.sections).map(section => ({
        ...section,
        items: firebaseObjectToArray<CVItem>(section.items),
    }));
    
    // Construct the object explicitly to preserve type information,
    // instead of spreading an 'any' type from rawData.
    const typedData: CVPageData = { title: rawData?.title || '', sections };
    return typedData;
}
);

// Create an async thunk for updating data
export const updateCVPageData = createAsyncThunk(
    'cvpage/updateData',
    async (cvData: CVPageData) => {
        await database.ref('cvpage').update(cvData);
        return cvData;
    }
);

const cvpageSlice = createSlice({
    name: 'cvpage',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCVPageData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCVPageData.fulfilled, (state, action: PayloadAction<CVPageData>) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(updateCVPageData.fulfilled, (state, action: PayloadAction<CVPageData>) => {
                // Also update the state on successful save
                state.data = action.payload;
            })
            .addCase(fetchCVPageData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch CV page data';
            });
    },
});

export default cvpageSlice.reducer;