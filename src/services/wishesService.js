import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
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

export async function updateWish(wishId, { name, message }) {
  const trimmedName = name.trim();
  const trimmedMessage = message.trim();

  if (!trimmedName) throw new Error('الاسم مطلوب');
  if (!trimmedMessage) throw new Error('رسالة التهنئة مطلوبة');

  await updateDoc(doc(db, WISHES_COLLECTION, wishId), {
    name: trimmedName,
    message: trimmedMessage,
    updatedAt: serverTimestamp(),
  });
}
