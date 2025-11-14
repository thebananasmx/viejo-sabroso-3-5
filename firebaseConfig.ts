// FIX: Use Firebase v8 compatible imports for their side-effects.
import 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// HACK: The UMD build of firebase-compat creates a global `firebase` object.
// The module import system in this environment doesn't correctly wrap the UMD
// export, so we grab it from the window object to get a reliable reference.
const firebase = (window as any).firebase;


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDobGt-oJ8eByqoozG0cFOnsO_minqHRqQ",
  authDomain: "viejo-sabroso3-5.firebaseapp.com",
  projectId: "viejo-sabroso3-5",
  storageBucket: "viejo-sabroso3-5.firebasestorage.app",
  messagingSenderId: "81579391231",
  appId: "1:81579391231:web:d8faf16a989ef5773f34ca",
  measurementId: "G-KNYVZD3S9Z"
};

// Initialize Firebase
// DEFINITIVE FIX: Use the global `firebase` object. This now works correctly.
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Initialize and export Firebase services using the global object.
export const db = firebase.firestore();
export const auth = firebase.auth();
export const Timestamp = firebase.firestore.Timestamp;