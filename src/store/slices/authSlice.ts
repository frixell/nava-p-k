import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { signInWithEmail, signUpWithEmail, signOut } from '../../services/authService';
import type { AppDispatch, AppThunk } from '../configureStore';

export interface AuthState {
  uid: string | null;
}

const initialState: AuthState = {
  uid: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state: AuthState, action: PayloadAction<string | null>) => {
      state.uid = action.payload;
    },
    logout: (state: AuthState) => {
      state.uid = null;
    }
  }
});

export const { login, logout } = authSlice.actions;

export const startLogin = (
  credentials: { email: string; password: string }
): AppThunk<Promise<string | null>> => async (dispatch: AppDispatch) => {
  const userCredential = await signInWithEmail(credentials.email, credentials.password);
  const uid = userCredential.user?.uid ?? null;
  dispatch(login(uid));
  return uid;
};

export const startSignin = (
  credentials: { email: string; password: string }
): AppThunk<Promise<void>> => async () => {
  await signUpWithEmail(credentials.email, credentials.password);
};

export const startLogout = (): AppThunk<Promise<void>> => async (dispatch: AppDispatch) => {
  await signOut();
  dispatch(logout());
};

export default authSlice.reducer;
