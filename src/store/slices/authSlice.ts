import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { signInWithEmail, signUpWithEmail, signOut } from '../../services/authService';

export interface AuthState {
  uid?: string | null;
}

const initialState: AuthState = {};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state: AuthState, action: PayloadAction<string | null>) => {
      state.uid = action.payload ?? undefined;
    },
    logout: (state: AuthState) => {
      state.uid = undefined;
    }
  }
});

export const { login, logout } = authSlice.actions;

export const startLogin = (credentials: { email: string; password: string }) => async (dispatch: any) => {
  const userCredential = await signInWithEmail(credentials.email, credentials.password);
  const uid = userCredential.user?.uid ?? null;
  dispatch(login(uid));
  return uid;
};

export const startSignin = (credentials: { email: string; password: string }) => async () => {
  await signUpWithEmail(credentials.email, credentials.password);
};

export const startLogout = () => async (dispatch: any) => {
  await signOut();
  dispatch(logout());
};

export default authSlice.reducer;
