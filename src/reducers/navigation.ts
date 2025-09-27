import { createSlice } from '@reduxjs/toolkit';

// 1. Define the shape of the state for this slice
interface NavigationState {
    isMenuOpen: boolean;
}

// 2. Define the initial state
const initialState: NavigationState = {
    isMenuOpen: false,
};

const navigationSlice = createSlice({
    name: 'navigation',
    initialState,
    // 3. Define the reducers for synchronous actions
    reducers: {
        toggleMenu: (state) => {
            state.isMenuOpen = !state.isMenuOpen;
        },
        openMenu: (state) => {
            state.isMenuOpen = true;
        },
        closeMenu: (state) => {
            state.isMenuOpen = false;
        },
    },
});

// 4. Export the auto-generated action creators and the reducer
export const { toggleMenu, openMenu, closeMenu } = navigationSlice.actions;
export default navigationSlice.reducer;