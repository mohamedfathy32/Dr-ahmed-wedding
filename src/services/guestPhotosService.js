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

const GUEST_PHOTOS_COLLECTION = 'guestPhotos';

export async function submitGuestPhoto({ caption, imageUrl, publicId }) {
  const trimmedCaption = caption.trim();
  if (!trimmedCaption) throw new Error('يرجى كتابة اسم أو رسالة مع الصورة');
  if (!imageUrl) throw new Error('الصورة مطلوبة');

  await addDoc(collection(db, GUEST_PHOTOS_COLLECTION), {
    caption: trimmedCaption,
    imageUrl,
    publicId: publicId || '',
    visible: true,
    createdAt: serverTimestamp(),
  });
}

export async function fetchGuestPhotos({ visibleOnly = false } = {}) {
  const photosQuery = query(
    collection(db, GUEST_PHOTOS_COLLECTION),
    orderBy('createdAt', 'desc'),
  );
  const snapshot = await getDocs(photosQuery);

  const photos = snapshot.docs.map((photoDoc) => ({
    id: photoDoc.id,
    ...photoDoc.data(),
  }));

  if (visibleOnly) {
    return photos.filter((photo) => photo.visible !== false);
  }

  return photos;
}

export async function toggleGuestPhotoVisibility(photoId, visible) {
  await updateDoc(doc(db, GUEST_PHOTOS_COLLECTION, photoId), { visible });
}

export async function deleteGuestPhoto(photoId) {
  await deleteDoc(doc(db, GUEST_PHOTOS_COLLECTION, photoId));
}

export async function updateGuestPhotoCaption(photoId, caption) {
  const trimmedCaption = caption.trim();
  if (!trimmedCaption) throw new Error('النص مطلوب');

  await updateDoc(doc(db, GUEST_PHOTOS_COLLECTION, photoId), {
    caption: trimmedCaption,
    updatedAt: serverTimestamp(),
  });
}
