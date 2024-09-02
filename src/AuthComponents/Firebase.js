// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Add this line

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8uukafmG8R86J8J56_Iqwa9NfD4Qs2U8",
  authDomain: "takeuforward-clone.firebaseapp.com",
  projectId: "takeuforward-clone",
  storageBucket: "takeuforward-clone.appspot.com",
  messagingSenderId: "730411026956",
  appId: "1:730411026956:web:234e4f386e4f3da9477c29",
  measurementId: "G-HYJWF1TKK3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth();
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app); // Add this line
export default app;