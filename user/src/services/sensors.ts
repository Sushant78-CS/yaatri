import { Accelerometer } from "expo-sensors";
import { getCurrentCoordinates } from "./location";

let subscription: any = null;

export const startCrashDetector = async (onCrashDetected: () => void) => {
  stopCrashDetector();
  console.log("Crash detector started");
  Accelerometer.setUpdateInterval(100);

  let checkingCrash = false;

  subscription = Accelerometer.addListener(async (data) => {
    // console.log(data);
    const { x, y, z } = data;

    const magnitude = Math.sqrt(x * x + y * y + z * z);

    // console.log("Magnitude:", magnitude);

    if (magnitude > 8 && !checkingCrash) {
      console.log("Possible crash detected", magnitude);
      checkingCrash = true;
      const before = await getCurrentCoordinates();

      setTimeout(async () => {
        try {
          const after = await getCurrentCoordinates();

          const distance = calculateDistance(
            { latitude: before.latitude, longitude: before.longitude },
            { latitude: after.latitude, longitude: after.longitude },
          );
          console.log("Distance:", distance);

          if (distance < 3) {
            onCrashDetected();
          }
        } catch (err) {
          console.log("Error calculating distance:", err);
        } finally {
          checkingCrash = false;
        }
      }, 10000);
      console.log("Possible crash detected");
    }
  });
};

export const stopCrashDetector = () => {
  if (subscription) {
    subscription.remove();
    subscription = null;
  }
};

const calculateDistance = (
  before: { latitude: number; longitude: number },
  after: { latitude: number; longitude: number },
) => {
  const R = 6371000; // Earth radius in meters

  const lat1 = (before.latitude * Math.PI) / 180;
  const lat2 = (after.latitude * Math.PI) / 180;

  const dLat = ((after.latitude - before.latitude) * Math.PI) / 180;

  const dLon = ((after.longitude - before.longitude) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};
