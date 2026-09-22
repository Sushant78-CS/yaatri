import { collection, onSnapshot, type DocumentData, type QueryDocumentSnapshot } from "firebase/firestore";
import { getFirebaseClient } from "../firebase/config";
import type { SystemAdministrator, SystemRole } from "../types/adminManagement";

const toStringOrNull = (value: unknown): string | null => {
  if (typeof value === "string") {
    return value;
  }
  return null;
};

const toSystemRole = (value: unknown): SystemRole => {
  return value === "superadmin" ? "superadmin" : "admin";
};

const mapAdminDocument = (documentSnapshot: QueryDocumentSnapshot<DocumentData>): SystemAdministrator => {
  const data = documentSnapshot.data();
  
  let createdAt: Date | string | null = null;
  if (data.createdAt?.toDate) {
    createdAt = data.createdAt.toDate();
  } else if (typeof data.createdAt === "string") {
    createdAt = data.createdAt;
  }

  return {
    uid: documentSnapshot.id,
    email: toStringOrNull(data.email) ?? "Unknown",
    role: toSystemRole(data.role),
    createdAt,
  };
};

export const subscribeToAdministrators = (
  onData: (admins: SystemAdministrator[]) => void,
  onError: (error: Error) => void,
) => {
  const client = getFirebaseClient();

  if (!client) {
    onError(new Error("Firebase configuration is missing."));
    return () => undefined;
  }

  return onSnapshot(
    collection(client.db, "administrators"),
    (snapshot) => {
      onData(snapshot.docs.map(mapAdminDocument));
    },
    (error) => {
      onError(error);
    },
  );
};
