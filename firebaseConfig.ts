import { initializeApp } from 'firebase/app';
import { getFirestore, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

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
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export { Timestamp };
