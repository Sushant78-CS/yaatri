import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

async function provisionSuperAdmin() {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error("Error: GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.");
    console.error("Please set it to point to your service-account JSON file.");
    process.exit(1);
  }

  console.log("Initializing Firebase Admin SDK using Application Default Credentials...");
  initializeApp();

  const auth = getAuth();
  const targetEmail = "admin01.yaatri.superadmin@gmail.com";

  try {
    console.log(`Looking up user by email: ${targetEmail}`);
    const userRecord = await auth.getUserByEmail(targetEmail);
    console.log(`Found user! UID: ${userRecord.uid}`);

    const currentClaims = userRecord.customClaims || {};
    console.log(`Current claims: ${JSON.stringify(currentClaims)}`);

    const newClaims = {
      ...currentClaims,
      role: "superadmin",
    };

    console.log(`Setting new claims...`);
    await auth.setCustomUserClaims(userRecord.uid, newClaims);

    console.log("Success! Custom claims have been updated.");
    console.log(`Resulting role: ${newClaims.role}`);
    
    process.exit(0);
  } catch (error) {
    console.error("Failed to provision superadmin:", error);
    process.exit(1);
  }
}

provisionSuperAdmin();
