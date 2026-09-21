import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "./firebase";

export const signUp = async (
  email: string,
  password: string,
  fullName: string,
) => {
  try {
    const cleanEmail = email.trim();

    console.log("Signup email:", JSON.stringify(cleanEmail));
    console.log("Email length:", cleanEmail.length);
    
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      cleanEmail,
      password,
    );

    await updateProfile(userCredentials.user, {
      displayName: fullName,
    });
    await userCredentials.user.reload();
    return userCredentials.user;
  } catch (err) {
    console.error("Error signing up:", err);
    throw err;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const cleanEmail = email.trim();

    console.log("Signup email:", JSON.stringify(cleanEmail));
    console.log("Email length:", cleanEmail.length);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      cleanEmail,
      password,
    );
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

export const getCurrentUser = () => {
  if (!auth) {
    return null;
  }
  return auth.currentUser;
};
