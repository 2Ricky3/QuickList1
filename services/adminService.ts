import { db } from "../firebaseConfig";
import { 
  collection, 
  getDocs, 
  deleteDoc, 
  doc
} from "firebase/firestore";

// TEST ONLY - Admin credentials (remove before production)
const ADMIN_EMAIL = "admin@quicklist.test";
const ADMIN_PASSWORD = "AdminTest@2026";

/**
 * Check if user is admin
 * TEST ONLY - Remove before production
 */
export const isAdminUser = (email: string): boolean => {
  return email === ADMIN_EMAIL;
};

/**
 * Get all users from Firestore
 * TEST ONLY - Remove before production
 */
export const getAllUsers = async () => {
  try {
    const usersRef = collection(db, "users");
    const querySnapshot = await getDocs(usersRef);
    const users: any[] = [];
    
    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

/**
 * Delete individual user from Firestore and Authentication
 * TEST ONLY - Remove before production
 */
export const deleteIndividualUser = async (userId: string) => {
  try {
    // Delete from Firestore
    await deleteDoc(doc(db, "users", userId));
    
    // Note: To delete from Firebase Authentication, you would need:
    // 1. Firebase Admin SDK (server-side)
    // 2. Or use reauthenticate + deleteUser (only for current user)
    
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

/**
 * Delete all users from Firestore
 * TEST ONLY - Remove before production
 */
export const deleteAllUsersFromFirestore = async () => {
  try {
    const usersRef = collection(db, "users");
    const querySnapshot = await getDocs(usersRef);
    
    const deletePromises = querySnapshot.docs.map((doc) =>
      deleteDoc(doc.ref)
    );
    
    await Promise.all(deletePromises);
    
    return querySnapshot.size; // Return number of deleted users
  } catch (error) {
    console.error("Error deleting all users:", error);
    throw error;
  }
};

/**
 * Get admin credentials for testing
 * TEST ONLY - Remove before production
 */
export const getAdminCredentials = () => ({
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD
});
