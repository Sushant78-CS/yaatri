import { useEffect, useState } from "react";
import type { RouteCoordinate } from "../services/routing";

const ARRIVAL_THRESHOLD = 30; // meters
const ARRIVAL_MESSAGE_DURATION = 4000; // 4 seconds

function distanceBetweenPoints(
  a: RouteCoordinate,
  b: RouteCoordinate,
): number {
  const R = 6371000;

  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;

  const dLat =
    ((b.latitude - a.latitude) * Math.PI) / 180;

  const dLon =
    ((b.longitude - a.longitude) * Math.PI) / 180;

  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const y =
    2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));

  return R * y;
}

export default function useArrivalDetection(
  location: RouteCoordinate | null,
  destination: RouteCoordinate | null,
  isNavigating: boolean,
) {
  const [hasArrived, setHasArrived] = useState(false);

  // Detect arrival
  useEffect(() => {
    if (
      !isNavigating ||
      !location ||
      !destination ||
      hasArrived
    ) {
      return;
    }

    const distance = distanceBetweenPoints(
      location,
      destination,
    );

    console.log(
      "🎯 DISTANCE TO DESTINATION:",
      Math.round(distance),
      "meters",
    );

    if (distance <= ARRIVAL_THRESHOLD) {
      console.log("🎉 ARRIVED AT DESTINATION!");

      setHasArrived(true);
    }
  }, [
    location?.latitude,
    location?.longitude,
    destination?.latitude,
    destination?.longitude,
    isNavigating,
    hasArrived,
  ]);

  // Hide arrival message after 4 seconds
  useEffect(() => {
    if (!hasArrived) {
      return;
    }

    const timer = setTimeout(() => {
      console.log("⏱️ ARRIVAL MESSAGE HIDDEN");
      setHasArrived(false);
    }, ARRIVAL_MESSAGE_DURATION);

    return () => clearTimeout(timer);
  }, [hasArrived]);

  return hasArrived;
}