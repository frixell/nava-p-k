import { firebase } from '../firebase/firebase';

export const signUpWithEmail = (email: string, password: string) =>
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .catch((error: any) => {
      let userMessage = 'Registration failed. Please try again.';

      switch (error.code) {
        case 'auth/email-already-in-use':
          userMessage = 'This email is already registered.';
          break;
        case 'auth/weak-password':
          userMessage = 'Password should be at least 6 characters.';
          break;
        case 'auth/invalid-email':
          userMessage = 'Please enter a valid email address.';
          break;
        default:
          break;
      }

      return Promise.reject({ message: userMessage, code: error.code });
    });

export const signInWithEmail = (email: string, password: string) =>
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .catch((error: any) => {
      let userMessage = 'Login failed. Please try again.';

      switch (error.code) {
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
        default:
          break;
      }

      return Promise.reject({ message: userMessage, code: error.code });
    });

export const signOut = () => firebase.auth().signOut();
