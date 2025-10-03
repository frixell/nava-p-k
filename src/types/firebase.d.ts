import firebaseNamespace = require('firebase');

declare module 'firebase/app' {
  export = firebaseNamespace;
}

declare module 'firebase/database';
