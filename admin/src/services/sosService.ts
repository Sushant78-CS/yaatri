import { collection, onSnapshot, orderBy, query, doc, updateDoc, type DocumentData, type QueryDocumentSnapshot } from "firebase/firestore";
import { getFirebaseClient } from "../firebase/config";
import type { EmergencyContact, SosAlert, SosStatus, SosTimestamp } from "../types/sos";

const toStringOrNull = (value: unknown): string | null => {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return null;
};

const toNumberOrNull = (value: unknown): number | null => {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
};

const toStatus = (value: unknown): SosStatus => (value === "RESOLVED" ? "RESOLVED" : "ACTIVE");

const toEmergencyContacts = (value: unknown): EmergencyContact[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((contact) => {
    const record = typeof contact === "object" && contact !== null ? (contact as Record<string, unknown>) : {};

    return {
      name: toStringOrNull(record.name),
      relationship: toStringOrNull(record.relationship),
      phone: toStringOrNull(record.phone),
    };
  });
};

const toTimestamp = (value: unknown): SosTimestamp => {
  if (!value) {
    return null;
  }

  if (value instanceof Date || typeof value === "string") {
    return value;
  }

  if (typeof value === "object" && "seconds" in value && typeof (value as { seconds: unknown }).seconds === "number") {
    const timestamp = value as { seconds: number; nanoseconds?: number };
    return {
      seconds: timestamp.seconds,
      nanoseconds: timestamp.nanoseconds,
    };
  }

  return null;
};

const mapSosDocument = (documentSnapshot: QueryDocumentSnapshot<DocumentData>): SosAlert => {
  const data = documentSnapshot.data();

  return {
    sosId: toStringOrNull(data.sosId) ?? documentSnapshot.id,
    userId: toStringOrNull(data.userId) ?? "",
    name: toStringOrNull(data.name) ?? "Unknown user",
    latitude: toNumberOrNull(data.latitude),
    longitude: toNumberOrNull(data.longitude),
    address: toStringOrNull(data.address),
    locationName: toStringOrNull(data.locationName),
    bloodGroup: toStringOrNull(data.bloodGroup),
    age: toStringOrNull(data.age),
    emergencyContacts: toEmergencyContacts(data.emergencyContacts),
    status: toStatus(data.status),
    createdAt: toTimestamp(data.createdAt),
  };
};

export const subscribeToSosAlerts = (
  onData: (alerts: SosAlert[]) => void,
  onError: (error: Error) => void,
) => {
  const client = getFirebaseClient();

  if (!client) {
    onError(new Error("Firebase configuration is missing."));
    return () => undefined;
  }

  const sosQuery = query(collection(client.db, "sosAlerts"), orderBy("createdAt", "desc"));

  return onSnapshot(
    sosQuery,
    (snapshot) => {
      onData(snapshot.docs.map(mapSosDocument));
    },
    (error) => {
      onError(error);
    },
  );
};

export const resolveSosAlert = async (sosId: string): Promise<void> => {
  const client = getFirebaseClient();
  if (!client) {
    throw new Error("Firebase configuration is missing.");
  }

  const sosRef = doc(client.db, "sosAlerts", sosId);
  await updateDoc(sosRef, { status: "RESOLVED" });
};
