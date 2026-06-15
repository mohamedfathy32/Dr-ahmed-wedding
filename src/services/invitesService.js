import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const INVITES_COLLECTION = 'invites';

export function validateSlug(slug) {
  const trimmed = slug.trim();
  if (!trimmed) return 'الرابط مطلوب';
  if (trimmed.length > 150) return 'الرابط طويل جداً (الحد الأقصى 150 حرف)';
  if (trimmed.includes('/')) return 'الرابط لا يمكن أن يحتوي على /';
  if (trimmed === '.' || trimmed === '..') return 'هذا الرابط غير مسموح';
  if (/^__.*__$/.test(trimmed)) return 'هذا الرابط غير مسموح';
  return null;
}

export function generateSlugFromName(name, existingSlugs = []) {
  const taken = new Set(existingSlugs.map((s) => s.trim()));

  let slug = name
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[/\\]+/g, '')
    .replace(/^\.+|\.+$/g, '')
    .slice(0, 120);

  if (!slug || slug === '.' || slug === '..') {
    slug = `invite-${Date.now().toString(36)}`;
  }

  let candidate = slug;
  let suffix = 2;
  while (taken.has(candidate)) {
    candidate = `${slug}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

export function buildInviteUrl(slug) {
  const base = typeof window !== 'undefined' ? window.location.origin : '';
  return `${base}/i/${encodeURIComponent(slug.trim())}`;
}

export async function fetchInviteBySlug(slug) {
  const inviteRef = doc(db, INVITES_COLLECTION, slug.trim());
  const snapshot = await getDoc(inviteRef);
  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    slug: snapshot.id,
    ...snapshot.data(),
  };
}

export async function fetchInvites() {
  const invitesQuery = query(
    collection(db, INVITES_COLLECTION),
    orderBy('createdAt', 'desc'),
  );
  const snapshot = await getDocs(invitesQuery);

  return snapshot.docs.map((inviteDoc) => ({
    id: inviteDoc.id,
    slug: inviteDoc.id,
    ...inviteDoc.data(),
  }));
}

export async function createInvite({ name, slug }) {
  const trimmedName = name.trim();
  const trimmedSlug = slug.trim();

  if (!trimmedName) throw new Error('اسم الضيف مطلوب');

  const slugError = validateSlug(trimmedSlug);
  if (slugError) throw new Error(slugError);

  const inviteRef = doc(db, INVITES_COLLECTION, trimmedSlug);
  const existing = await getDoc(inviteRef);
  if (existing.exists()) throw new Error('هذا الرابط مستخدم بالفعل');

  await setDoc(inviteRef, {
    name: trimmedName,
    createdAt: serverTimestamp(),
  });

  return { slug: trimmedSlug, name: trimmedName };
}

export async function updateInvite(oldSlug, { name, slug }) {
  const trimmedName = name.trim();
  const trimmedSlug = slug.trim();

  if (!trimmedName) throw new Error('اسم الضيف مطلوب');

  const slugError = validateSlug(trimmedSlug);
  if (slugError) throw new Error(slugError);

  const oldRef = doc(db, INVITES_COLLECTION, oldSlug.trim());
  const oldSnapshot = await getDoc(oldRef);
  if (!oldSnapshot.exists()) throw new Error('الدعوة غير موجودة');

  if (trimmedSlug === oldSlug.trim()) {
    await setDoc(
      oldRef,
      {
        name: trimmedName,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
    return { slug: trimmedSlug, name: trimmedName };
  }

  const newRef = doc(db, INVITES_COLLECTION, trimmedSlug);
  const existing = await getDoc(newRef);
  if (existing.exists()) throw new Error('هذا الرابط مستخدم بالفعل');

  const data = oldSnapshot.data();
  await setDoc(newRef, {
    ...data,
    name: trimmedName,
    updatedAt: serverTimestamp(),
  });
  await deleteDoc(oldRef);

  return { slug: trimmedSlug, name: trimmedName };
}

export async function deleteInvite(slug) {
  await deleteDoc(doc(db, INVITES_COLLECTION, slug.trim()));
}
