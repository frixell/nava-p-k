import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 1. Define the shape of the state for this slice
interface AuthState {
    uid: string | null;
}

// 2. Define the initial state using that type
const initialState: AuthState = {
    uid: null,
};

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
});

// 4. Export the auto-generated action creators and the reducer
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;