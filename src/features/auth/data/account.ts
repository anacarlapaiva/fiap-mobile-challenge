import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from '@react-native-firebase/auth';
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  query,
  where,
} from '@react-native-firebase/firestore';

import type { ResponsavelDto } from '@/shared/dto';
import { parseGuardian } from '@/shared/validation';

const GUARDIANS = 'responsaveis';

export function waitForAccount(): Promise<void> {
  return new Promise(resolve => {
    const unsubscribe = onAuthStateChanged(getAuth(), () => {
      Promise.resolve().then(() => {
        unsubscribe();
        resolve();
      });
    });
  });
}

export async function signInAccount(
  email: string,
  password: string,
): Promise<void> {
  await signInWithEmailAndPassword(getAuth(), email, password);
}

export function signOutAccount(): Promise<void> {
  return signOut(getAuth());
}

export async function readAccountGuardian(): Promise<ResponsavelDto | null> {
  const email = getAuth().currentUser?.email;
  if (!email) {
    return null;
  }
  const snapshot = await getDocs(
    query(
      collection(getFirestore(), GUARDIANS),
      where('email', '==', email),
      limit(1),
    ),
  );
  const raw = snapshot.docs[0]?.data();
  return raw ? parseGuardian(raw) : null;
}
