// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "mealmint-b8f5b.firebaseapp.com",
  projectId: "mealmint-b8f5b",
  storageBucket: "mealmint-b8f5b.firebasestorage.app",
  messagingSenderId: "712493552425",
  appId: "1:712493552425:web:6c3a9e44b00ab97e995d38"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth= getAuth(app)
export {app,auth}