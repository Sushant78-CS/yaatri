import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface Profile {
  phoneNumber: string;
  age: string;
  bloodGroup: string;
  emergencyContact: EmergencyContact[];
  profileComplete: boolean;
}

export const saveProfile = async (profile: Profile) => {
  try {
    if (!auth.currentUser) {
      throw new Error("User not authenticated");
    }
    await setDoc(
      doc(db, "users", auth.currentUser.uid),
      {
        ...profile,
        email: auth.currentUser.email || "",
        updatedAt: new Date(),
        profileComplete: true,
      },
      { merge: true },
    );
    return true;
  } catch (error) {
    console.error("Error saving profile:", error);
    throw error;
  }
};

export const getProfile = async (): Promise<Profile | null> => {
  try {
    if (!auth.currentUser) {
      throw new Error("User not authenticated");
    }

    const snapshot = await getDoc(doc(db, "users", auth.currentUser.uid));

    if (!snapshot.exists()) {
      return null;
    }
    return snapshot.data() as Profile;
  } catch (error) {
    console.error("Error getting profile:", error);
    return null;
  }
};
