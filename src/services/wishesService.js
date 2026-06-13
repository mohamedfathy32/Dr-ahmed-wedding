import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const WISHES_COLLECTION = 'wishes';

export async function submitWish({ name, message }) {
  await addDoc(collection(db, WISHES_COLLECTION), {
    name: name.trim(),
    message: message.trim(),
    createdAt: serverTimestamp(),
  });
}

export async function fetchWishes() {
  const wishesQuery = query(
    collection(db, WISHES_COLLECTION),
    orderBy('createdAt', 'desc'),
  );
  const snapshot = await getDocs(wishesQuery);

  return snapshot.docs.map((wishDoc) => ({
    id: wishDoc.id,
    ...wishDoc.data(),
  }));
}

export async function deleteWish(wishId) {
  await deleteDoc(doc(db, WISHES_COLLECTION, wishId));
}
