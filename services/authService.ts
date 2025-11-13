import { signInWithEmailAndPassword, createUserWithEmailAndPassword, AuthError } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

const getAuthErrorMessage = (error: any): string => {
  const errorCode = error?.code || '';
  
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'Invalid email address format.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please check your credentials.';

    case 'auth/email-already-in-use':
      return 'This email is already registered. Please login or use a different email.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use a stronger password.';
    
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/operation-not-allowed':
      return 'This authentication method is not enabled.';
    
    default:
      return 'Authentication failed. Please try again.';
  }
};

export const loginWithEmail = async (email: string, password: string) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    const userError = new Error(getAuthErrorMessage(error));
    (userError as any).code = error?.code;
    throw userError;
  }
};

export const registerWithEmail = async (email: string, password: string, name: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    await setDoc(doc(db, "users", user.uid), {
      email,
      displayName: name,
      createdAt: serverTimestamp(),
    });
    
    return user;
  } catch (error: any) {
    const userError = new Error(getAuthErrorMessage(error));
    (userError as any).code = error?.code;
    throw userError;
  }
};
