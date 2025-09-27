//import * as firebase from 'firebase';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

const config = {
    apiKey: process.env.FIREBASE_API_KEY || "AIzaSyBJE9YYF0GdcJx3qYm5OQMKtgJ3v7Q5ZqU",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "navapk-af5b9.firebaseapp.com",
    databaseURL: process.env.FIREBASE_DATABASE_URL || "https://navapk-af5b9.firebaseio.com",
    projectId: process.env.FIREBASE_PROJECT_ID || "navapk-af5b9",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "navapk-af5b9.appspot.com",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "123456789"
};

if (process.env.NODE_ENV === 'development') {
    console.log('Firebase config:', config);
    console.log('Environment variables:', {
        FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
        FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
        FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL
    });
}

firebase.initializeApp(config);
const database = firebase.database();
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export { firebase, googleAuthProvider, database as default };                         