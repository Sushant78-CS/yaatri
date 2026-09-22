import { collection, onSnapshot, type DocumentData, type QueryDocumentSnapshot } from "firebase/firestore";
import { getFirebaseClient } from "../firebase/config";
import type { AdminUser, UserProfileStatus } from "../types/user";

const toStringOrNull = (value: unknown): string | null => {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return null;
};

const toProfileStatus = (value: unknown): UserProfileStatus => (value === true ? "COMPLETE" : "INCOMPLETE");

const mapUserDocument = (documentSnapshot: QueryDocumentSnapshot<DocumentData>): AdminUser => {
  const data = documentSnapshot.data();
  const email = toStringOrNull(data.email);
  const phoneNumber = toStringOrNull(data.phoneNumber);

  return {
    userId: documentSnapshot.id,
    name: email ?? phoneNumber ?? documentSnapshot.id,
    age: toStringOrNull(data.age),
    profileStatus: toProfileStatus(data.profileComplete),
  };
};

export const subscribeToUsers = (onData: (users: AdminUser[]) => void, onError: (error: Error) => void) => {
  const client = getFirebaseClient();

  if (!client) {
    onError(new Error("Firebase configuration is missing."));
    return () => undefined;
  }

  return onSnapshot(
    collection(client.db, "users"),
    (snapshot) => {
      onData(snapshot.docs.map(mapUserDocument));
    },
    (error) => {
      onError(error);
    },
  );
};
