import { collection, addDoc, Timestamp, doc, updateDoc, getDocs, query, where, limit, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
export const createList = async ({
  uid,
  title,
  items,
  tags,
  color,
  shareId,
  allowPublicEdit = false,
}: {
  uid: string;
  title: string;
  items: string[];
  tags: string[];
  color: string;
  shareId: string;
  allowPublicEdit?: boolean;
}) => {
  return await addDoc(collection(db, "lists"), {
    uid,
    title,
    items,
    tags,
    createdAt: Timestamp.now(),
    shareId,
    allowPublicEdit,
    color,
  });
};
export const updateList = async (
  listId: string,
  data: {
    title?: string;
    items?: string[];
    allowPublicEdit?: boolean;
    tags?: string[];
    color?: string;
  }
) => {
  const listRef = doc(db, "lists", listId);
  await updateDoc(listRef, data);
};
export const fetchUserLists = async (userId: string, max: number = 15) => {
  const q = query(
    collection(db, "lists"),
    where("uid", "==", userId),
    limit(max)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      createdAt: data.createdAt,
      items: data.items || [],
    };
  });
};
export const fetchListsByUser = async (uid: string) => {
  const q = query(collection(db, "lists"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
};
export const deleteListById = async (listId: string) => {
  await deleteDoc(doc(db, "lists", listId));
};
export const fetchListByShareCode = async (shareId: string) => {
  const q = query(
    collection(db, "lists"),
    where("shareId", "==", shareId),
    limit(1)
  );
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;
  const docSnap = querySnapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() };
};
