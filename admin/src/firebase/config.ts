import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

type FirebaseEnvironment = {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
};

export type FirebaseClient = {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
};

const firebaseEnvironment: FirebaseEnvironment = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const requiredKeys: Array<keyof FirebaseEnvironment> = [
  "apiKey",
  "authDomain",
  "projectId",
  "storageBucket",
  "messagingSenderId",
  "appId",
];

let firebaseClient: FirebaseClient | null = null;

export const getMissingFirebaseConfigKeys = () =>
  requiredKeys.filter((key) => {
    const value = firebaseEnvironment[key];
    return !value || value.trim() === "";
  });

export const isFirebaseConfigured = () => getMissingFirebaseConfigKeys().length === 0;

export const getFirebaseClient = (): FirebaseClient | null => {
  if (!isFirebaseConfigured()) {
    return null;
  }

  if (firebaseClient) {
    return firebaseClient;
  }

  const app = initializeApp({
    apiKey: firebaseEnvironment.apiKey,
    authDomain: firebaseEnvironment.authDomain,
    projectId: firebaseEnvironment.projectId,
    storageBucket: firebaseEnvironment.storageBucket,
    messagingSenderId: firebaseEnvironment.messagingSenderId,
    appId: firebaseEnvironment.appId,
  });

  firebaseClient = {
    app,
    auth: getAuth(app),
    db: getFirestore(app),
  };

  return firebaseClient;
};
