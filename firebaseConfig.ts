import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

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

// Initialize Firebase for Singleton pattern
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

// Initialize and export Firebase services
export const db = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();
export const Timestamp = firebase.firestore.Timestamp;
