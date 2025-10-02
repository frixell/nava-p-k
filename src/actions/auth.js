//import { firebase } from '../firebase/firebase';
var firebase = require("firebase/app");
require("firebase/auth");

export const signin = ( email, password ) => {
    return () => {
        return firebase.auth().createUserWithEmailAndPassword( email, password )
        .catch(function( error ) {
        // Handle Errors here.
        console.log(error);
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        });
    };
};

export const login = (uid) => ({
    type: 'LOGIN',
    uid
});

export const startLogin = ( email, password ) => {
    return () => {
        return firebase.auth().signInWithEmailAndPassword( email, password )
        .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        });
    };
};

export const logout = () => ({
    type: 'LOGOUT'
});

export const startLogout = () => {
    return () => {
        return firebase.auth().signOut();
    }
}