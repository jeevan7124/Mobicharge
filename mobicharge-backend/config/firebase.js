// Import Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your Firebase Configuration (Replace with your actual config)
const firebaseConfig = {
    apiKey: "AIzaSyD6D_cZGVhD7dnxjhz5Zvx7yJivnSMxXDY",
    authDomain: "mobicharge-148a6.firebaseapp.com",
    projectId: "mobicharge-148a6",
    storageBucket: "mobicharge-148a6.firebasestorage.app",
    messagingSenderId: "1021715556868",
    appId: "1:1021715556868:web:e7a19d89c1793895ca6351",
    measurementId: "G-W98QF7ZMM5"
  };
  const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };

