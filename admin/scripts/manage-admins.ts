import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

async function manageAdmins() {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error("Error: GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.");
    process.exit(1);
  }

  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log("Usage:");
    console.log("  bun run manage-admins.ts add <email> <password> [admin|superadmin]");
    console.log("  bun run manage-admins.ts remove <email>");
    process.exit(1);
  }

  const command = args[0];
  initializeApp();
  const auth = getAuth();
  const db = getFirestore();

  try {
    if (command === "add") {
      const email = args[1];
      const password = args[2];
      const role = args[3] || "admin";

      if (!email || !password || (role !== "admin" && role !== "superadmin")) {
        console.error("Invalid arguments. Provide email, password, and role (admin or superadmin).");
        process.exit(1);
      }

      console.log(`Creating/updating Auth user for ${email}...`);
      let userRecord;
      try {
        userRecord = await auth.getUserByEmail(email);
        console.log(`User already exists (UID: ${userRecord.uid}). Updating password...`);
        await auth.updateUser(userRecord.uid, { password });
      } catch (err: unknown) {
        const error = err as Error & { code?: string };
        if (error.code === "auth/user-not-found") {
          userRecord = await auth.createUser({ email, password });
          console.log(`User created (UID: ${userRecord.uid}).`);
        } else {
          throw err;
        }
      }

      const currentClaims = userRecord.customClaims || {};
      const newClaims = { ...currentClaims, role };
      await auth.setCustomUserClaims(userRecord.uid, newClaims);
      console.log(`Custom claims set: role = ${role}`);

      console.log(`Saving to administrators collection...`);
      await db.collection("administrators").doc(userRecord.uid).set({
        email: userRecord.email,
        role: role,
        createdAt: FieldValue.serverTimestamp(),
      }, { merge: true });

      console.log("Success! Administrator added.");
      
    } else if (command === "remove") {
      const email = args[1];
      if (!email) {
        console.error("Invalid arguments. Provide email to remove.");
        process.exit(1);
      }

      console.log(`Looking up Auth user for ${email}...`);
      const userRecord = await auth.getUserByEmail(email);

      if (userRecord.customClaims?.role === "superadmin") {
        console.warn(`WARNING: ${email} is a superadmin. You cannot remove superadmins through this command for safety.`);
        console.warn("If you must remove them, do it manually via Firebase Console.");
        process.exit(1);
      }

      console.log(`Revoking admin access for Auth user (UID: ${userRecord.uid})...`);
      const currentClaims = userRecord.customClaims || {};
      const newClaims = { ...currentClaims };
      delete newClaims.role;
      await auth.setCustomUserClaims(userRecord.uid, newClaims);

      console.log(`Removing from administrators collection...`);
      await db.collection("administrators").doc(userRecord.uid).delete();

      console.log("Success! Administrator removed.");
    } else {
      console.error(`Unknown command: ${command}`);
      process.exit(1);
    }
  } catch (error) {
    console.error("Operation failed:", error);
    process.exit(1);
  }
}

manageAdmins();
