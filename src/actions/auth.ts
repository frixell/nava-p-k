import { Dispatch } from 'redux';
import { signInWithEmail, signUpWithEmail, signOut } from '../services/authService';

// Action Types
export const LOGIN = 'LOGIN' as const;
export const LOGOUT = 'LOGOUT' as const;

// Action Interfaces
export interface LoginAction {
    type: typeof LOGIN;
    uid: string;
}

export interface LogoutAction {
    type: typeof LOGOUT;
}

export type AuthActionTypes = LoginAction | LogoutAction;

// Action Creators
export const signin = (email: string, password: string) => {
    return () => {
        return signUpWithEmail(email, password);
    };
};

export const login = (uid: string): LoginAction => ({
    type: LOGIN,
    uid
});

export const startLogin = (email: string, password: string) => {
    return (dispatch: Dispatch<AuthActionTypes>) => {
        return signInWithEmail(email, password)
            .then((userCredential) => {
                // Login successful - dispatch the login action to store the user in Redux
                if (userCredential.user?.uid) {
                    dispatch(login(userCredential.user.uid));
                }
                return userCredential; // Return success
            });
    };
};

export const logout = (): LogoutAction => ({
    type: LOGOUT
});

export const startLogout = () => {
    return () => {
        return signOut();
    };
};
