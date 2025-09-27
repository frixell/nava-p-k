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
            // ...
        });
    };
};

export const login = (uid: string): LoginAction => ({
    type: LOGIN,
    uid
});

export const startLogin = (email: string, password: string) => {
    return (dispatch: Dispatch<AuthActionTypes>) => {
        console.log('startLogin called with email:', email);
        console.log('Firebase auth object:', firebase.auth());

        return firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Login successful
            console.log('Login successful:', userCredential.user?.uid);
            console.log('Full userCredential:', userCredential);

            // Dispatch the login action to store the user in Redux
            if (userCredential.user?.uid) {
                dispatch(login(userCredential.user.uid));
            }

            return userCredential; // Return success
        })
        .catch((error: firebase.auth.Error) => {
            // Handle Errors here.
            console.log('Login error details:');
            console.log('- Error code:', error.code);
            console.log('- Error message:', error.message);
            console.log('- Full error object:', error);
            return Promise.reject(error); // Properly reject on error
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