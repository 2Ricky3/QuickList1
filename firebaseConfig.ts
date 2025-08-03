// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8bNskSloU8a4gq3giFBapQiSxRktoGeU",
  authDomain: "quicklist-4be2d.firebaseapp.com",
  projectId: "quicklist-4be2d",
  storageBucket: "quicklist-4be2d.firebasestorage.app",
  messagingSenderId: "161059913566",
  appId: "1:161059913566:web:917311743395d3651159cf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);