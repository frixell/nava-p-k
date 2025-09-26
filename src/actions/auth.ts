import { Dispatch } from 'redux';
import firebase from 'firebase/app';
import 'firebase/auth';

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
        return firebase.auth().createUserWithEmailAndPassword(email, password)
        .catch((error: firebase.auth.Error) => {
            // Handle Errors here.
            console.log(error);
            const errorCode = error.code;
            const errorMessage = error.message;
            // ...
        });
    };
};

export const login = (uid: string): LoginAction => ({
    type: LOGIN,
    uid
});

export const startLogin = (email: string, password: string) => {
    return () => {
        return firebase.auth().signInWithEmailAndPassword(email, password)
        .catch((error: firebase.auth.Error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // ...
        });
    };
};

export const logout = (): LogoutAction => ({
    type: LOGOUT
});

export const startLogout = () => {
    return () => {
        return firebase.auth().signOut();
    };
};