// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-2024.firebaseapp.com",
  projectId: "mern-estate-2024",
  storageBucket: "mern-estate-2024.appspot.com",
  messagingSenderId: "254332518406",
  appId: "1:254332518406:web:ed22b0caa05ffba9580387"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);