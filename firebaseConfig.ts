
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

// --- PEGA AQUÍ LA CONFIGURACIÓN DE TU PROYECTO FIREBASE ---
// Reemplaza este objeto con la configuración que obtuviste de la consola de Firebase
// en el Paso 5 de las instrucciones.
// Ve a: Configuración del proyecto > General > Tus apps > Configuración del SDK > Config
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};
// ---------------------------------------------------------

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Initialize and export Firebase services
export const db = app.firestore();
export const auth = app.auth();
export const storage = app.storage();
export default app;