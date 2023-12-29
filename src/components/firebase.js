// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzL3X6dOYLZ7WlcsBs2WOMp5KnC7e8c8A",
  authDomain: "sign-in-fe78f.firebaseapp.com",
  projectId: "sign-in-fe78f",
  storageBucket: "sign-in-fe78f.appspot.com",
  messagingSenderId: "120582573435",
  appId: "1:120582573435:web:e9b4a137bbd69ead3c01de"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(); 
