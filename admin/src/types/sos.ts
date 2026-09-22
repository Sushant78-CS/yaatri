export type SosStatus = "ACTIVE" | "RESOLVED";

export type FirestoreTimestampLike = {
  seconds: number;
  nanoseconds?: number;
};

export type SosTimestamp = Date | string | FirestoreTimestampLike | null;

export type EmergencyContact = {
  name?: string | null;
  relationship?: string | null;
  phone?: string | null;
};

export type SosAlert = {
  sosId: string;
  userId: string;
  name: string;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  locationName: string | null;
  bloodGroup: string | null;
  age: string | number | null;
  emergencyContacts: EmergencyContact[];
  status: SosStatus;
  createdAt: SosTimestamp;
};
