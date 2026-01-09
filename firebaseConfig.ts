import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { validateEnvironment, getFirebaseConfig } from "./utils/envValidator";

validateEnvironment();
const firebaseConfig = getFirebaseConfig();
const app = initializeApp(firebaseConfig);

// Note: AsyncStorage persistence requires additional setup with Firebase Admin SDK
// For now using standard getAuth
export const auth = getAuth(app);
export const db = getFirestore(app);
