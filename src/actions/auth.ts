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
            // Handle Errors here - return user-friendly error
            let userMessage = 'Registration failed. Please try again.';

            switch(error.code) {
                case 'auth/email-already-in-use':
                    userMessage = 'This email is already registered.';
                    break;
                case 'auth/weak-password':
                    userMessage = 'Password should be at least 6 characters.';
                    break;
                case 'auth/invalid-email':
                    userMessage = 'Please enter a valid email address.';
                    break;
            }

            return Promise.reject({ message: userMessage, code: error.code });
        });
    };
};

export const login = (uid: string): LoginAction => ({
    type: LOGIN,
    uid
});

export const startLogin = (email: string, password: string) => {
    return (dispatch: Dispatch<AuthActionTypes>) => {
        return firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Login successful - dispatch the login action to store the user in Redux
            if (userCredential.user?.uid) {
                dispatch(login(userCredential.user.uid));
            }

            return userCredential; // Return success
        })
        .catch((error: firebase.auth.Error) => {
            // Return user-friendly error messages
            let userMessage = 'Login failed. Please try again.';

            switch(error.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                    userMessage = 'Invalid email or password.';
                    break;
                case 'auth/too-many-requests':
                    userMessage = 'Too many failed attempts. Please try again later.';
                    break;
                case 'auth/network-request-failed':
                    userMessage = 'Network error. Please check your connection.';
                    break;
                case 'auth/invalid-email':
                    userMessage = 'Please enter a valid email address.';
                    break;
            }

            return Promise.reject({ message: userMessage, code: error.code });
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