import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
  type Unsubscribe,
} from "firebase/auth";
import { getFirebaseClient } from "../firebase/config";

export const subscribeToAuthUser = (callback: (user: User | null) => void): Unsubscribe => {
  const client = getFirebaseClient();

  if (!client) {
    callback(null);
    return () => undefined;
  }

  return onAuthStateChanged(client.auth, callback);
};

export const signInAdminUser = async (email: string, password: string) => {
  const client = getFirebaseClient();

  if (!client) {
    throw new Error("Firebase configuration is missing.");
  }

  return signInWithEmailAndPassword(client.auth, email, password);
};

export const signOutAdminUser = async () => {
  const client = getFirebaseClient();

  if (!client) {
    return;
  }

  await firebaseSignOut(client.auth);
};
