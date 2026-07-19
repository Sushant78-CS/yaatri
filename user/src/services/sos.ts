import { EmergencyContact } from "@/firebase/profile";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

export interface SOSAlert {
  sosId: string;
  userId: string;
  latitude: number;
  longitude: number;
  address: string;
  locationName: string;
  name: string;
  bloodGroup?: string;
  age?: number;
  emergencyContacts: EmergencyContact[];
  status: "ACTIVE" | "RESOLVED";
}

const createSOSAlert = async (payload: SOSAlert) => {
  await setDoc(
    doc(db, "sosAlerts", payload.sosId),
    {
      sosId: payload.sosId,
      userId: payload.userId,
      name: payload.name,
      latitude: payload.latitude,
      longitude: payload.longitude,
      address: payload.address,
      locationName: payload.locationName,
      bloodGroup: payload.bloodGroup || "",
      age: payload.age || "",
      emergencyContacts: payload.emergencyContacts,
      status: "ACTIVE",
      createdAt: serverTimestamp(),
    },
    {
      merge: true,
    },
  );
  return payload.sosId;
};

export const subscribeSOSHistory = (callback: (alerts: any[]) => void) => {
  if (!auth.currentUser) return () => {};

  const q = query(
    collection(db, "sosAlerts"),
    where("userId", "==", auth.currentUser.uid),
    orderBy("createdAt", "desc"),
  );

  return onSnapshot(q, (snapshot) => {
    callback(
      snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })),
    );
  });
};

export default createSOSAlert;
