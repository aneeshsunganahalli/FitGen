// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "fitgen-b6379.firebaseapp.com",
  projectId: "fitgen-b6379",
  storageBucket: "fitgen-b6379.firebasestorage.app",
  messagingSenderId: "624656920580",
  appId: "1:624656920580:web:eb0f118f8941959da70551",
  measurementId: "G-1EHR3BXS81"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
