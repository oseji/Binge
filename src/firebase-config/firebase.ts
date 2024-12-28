import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBuGgLCIEtIjfYUFq2WFqN6DSjAvAUkGoI",
  authDomain: "binge-fcd4d.firebaseapp.com",
  databaseURL: "https://binge-fcd4d-default-rtdb.firebaseio.com",
  projectId: "binge-fcd4d",
  storageBucket: "binge-fcd4d.firebasestorage.app",
  messagingSenderId: "107307628408",
  appId: "1:107307628408:web:c5aeee4ebd092699973a8d",
  measurementId: "G-Z1Z88BDJ3Z",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
