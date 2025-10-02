export interface AuthState {
  uid?: string | null;
}

export interface RootState {
  auth: AuthState;
  [key: string]: unknown;
}
