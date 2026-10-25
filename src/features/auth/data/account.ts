import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from '@react-native-firebase/auth';
import { doc, getDoc, getFirestore } from '@react-native-firebase/firestore';

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
  const uid = getAuth().currentUser?.uid;
  if (!uid) {
    return null;
  }
  const snapshot = await getDoc(doc(getFirestore(), GUARDIANS, uid));
  if (!snapshot.exists()) {
    return null;
  }
  return parseGuardian(snapshot.data());
}
