import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import database from '../firebase/firebase';

// Define a type for a single teaching item
export interface TeachingItem {
    id: string;
    publicId?: string;
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
    seo?: {
        title: string;
        description: string;
        keyWords: string;
    };
}

// Define the shape of the state for this slice
interface TeachingPageState {
    // Store all page data in a single 'data' object for consistency
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
    return {
        teachings: teachingsArray.sort((a, b) => a.order - b.order),
        seo: pageData?.seo
    };
});

// Thunk for adding a new teaching item
export const addTeachingItem = createAsyncThunk('teachingpage/addItem', async (item: Omit<TeachingItem, 'id'>) => {
    const ref = await database.ref('website/teachingpage/teachings').push(item);
    return { ...item, id: ref.key! };
});

// Thunk for updating an existing teaching item
export const updateTeachingItem = createAsyncThunk('teachingpage/updateItem', async (item: TeachingItem) => {
    const { id, ...dataToUpdate } = item;
    await database.ref(`website/teachingpage/teachings/${id}`).update(dataToUpdate);
    return item;
});

// Thunk for deleting a teaching item
export const deleteTeachingItem = createAsyncThunk('teachingpage/deleteItem', async (item: TeachingItem) => {
    const { id, publicId } = item;
    await database.ref(`website/teachingpage/teachings/${id}`).remove();

    // If there's a publicId, call the server to delete the image from Cloudinary
    if (publicId) {
        await fetch('/deleteImage', {
            method: 'POST',
            body: `publicid=${publicId}`,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
    }
    return id; // Return the id of the deleted item
});

// Create an async thunk for updating SEO data
export const updateTeachingPageSeo = createAsyncThunk(
    'teachingpage/updateSeo',
    async (seoData: TeachingPageData['seo']) => {
        if (!seoData) {
            return;
        }
        // Update both server-side and client-side SEO data
        await database.ref('serverSeo/teaching/seo').update(seoData);
        await database.ref('website/teachingpage/seo').update(seoData);
        return seoData;
    }
);

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
            .addCase(addTeachingItem.fulfilled, (state, action: PayloadAction<TeachingItem>) => {
                if (state.data) {
                    state.data.teachings.push(action.payload);
                }
            })
            .addCase(updateTeachingItem.fulfilled, (state, action: PayloadAction<TeachingItem>) => {
                if (state.data) {
                    const index = state.data.teachings.findIndex(item => item.id === action.payload.id);
                    if (index !== -1) {
                        state.data.teachings[index] = action.payload;
                    }
                }
            })
            .addCase(deleteTeachingItem.fulfilled, (state, action: PayloadAction<string>) => {
                if (state.data) {
                    state.data.teachings = state.data.teachings.filter(item => item.id !== action.payload);
                }
            })
            .addCase(updateTeachingPageSeo.fulfilled, (state, action: PayloadAction<TeachingPageData['seo']>) => {
                if (state.data) {
                    state.data.seo = action.payload;
                }
            })
            .addCase(fetchTeachingPageData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch teaching page data';
            });
    },
});

export default teachingpageSlice.reducer;