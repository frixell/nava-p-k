import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import database from '../firebase/firebase';

// Define a type for the about page data.
// This is a guess; please adjust to your actual data structure.
export interface AboutPageData {
    title: string;
    content: string;
    imageUrl?: string;
    seo?: {
        title: string;
        description: string;
        keyWords: string;
    };
}

// Define the shape of the state for this slice
interface AboutPageState {
    data: AboutPageData | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Define the initial state
const initialState: AboutPageState = {
    data: null,
    status: 'idle',
    error: null,
};

// Create the async thunk for fetching data
export const fetchAboutPageData = createAsyncThunk('aboutpage/fetchData', async () => {
    const snapshot = await database.ref('aboutpage').once('value');
    return snapshot.val() as AboutPageData;
});

// Create an async thunk for updating data
export const updateAboutPageData = createAsyncThunk(
    'aboutpage/updateData',
    async (aboutData: Omit<AboutPageData, 'seo'>) => {
        await database.ref('website/aboutpage').update({ ...aboutData });
        return aboutData;
    }
);

// Create an async thunk for updating SEO data
export const updateAboutPageSeo = createAsyncThunk(
    'aboutpage/updateSeo',
    async (seoData: AboutPageData['seo']) => {
        if (!seoData) {
            // Don't try to update if there's no data
            return;
        }
        // Update both server-side and client-side SEO data
        await database.ref('serverSeo/about/seo').update(seoData);
        await database.ref('website/aboutpage/seo').update(seoData);
        return seoData;
    }
);

const aboutpageSlice = createSlice({
    name: 'aboutpage',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAboutPageData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAboutPageData.fulfilled, (state, action: PayloadAction<AboutPageData>) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(updateAboutPageSeo.fulfilled, (state, action: PayloadAction<AboutPageData['seo']>) => {
                if (state.data) {
                    state.data.seo = action.payload;
                }
            })
            .addCase(updateAboutPageData.fulfilled, (state, action: PayloadAction<AboutPageData>) => {
                // Also update the state on successful save
                state.data = action.payload;
            })
            .addCase(fetchAboutPageData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch about page data';
            });
    },
});

export default aboutpageSlice.reducer;