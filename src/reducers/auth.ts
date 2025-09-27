import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import firebase from 'firebase/app';

// 1. Define the shape of the state for this slice
interface AuthState {
    uid: string | null;
}

// 2. Define the initial state using that type
const initialState: AuthState = {
    uid: null,
};

// Create the async thunk for logging in
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ userEmail, password }: { userEmail: string, password: string }, { rejectWithValue }) => {
        const userCredential = await firebase.auth().signInWithEmailAndPassword(userEmail, password);
        // The return value of a fulfilled thunk is the action payload
        return userCredential.user!.uid;
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    // 3. Define the reducers. Immer is used under the hood.
    reducers: {
        login: (state, action: PayloadAction<string>) => {
            state.uid = action.payload;
        },
        logout: (state) => {
            state.uid = null;
        },
    },
    extraReducers: (builder) => {
        // When the loginUser thunk is fulfilled, update the state with the user's UID
        builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<string>) => {
            state.uid = action.payload;
        });
    }
});

// 4. Export the auto-generated action creators and the reducer
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;