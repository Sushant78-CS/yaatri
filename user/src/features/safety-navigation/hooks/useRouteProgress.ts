import { useEffect, useState } from "react";
import type {
  RouteCoordinate,
  RouteResult,
} from "../services/routing";
import { getRemainingDistance } from "../utils/routeProgress";

interface RouteProgressResult {
  remainingDistance: number | null;
  remainingDuration: number | null;
}

export default function useRouteProgress(
  location: RouteCoordinate | null,
  route: RouteResult | null,
  isNavigating: boolean,
): RouteProgressResult {
  const [remainingDistance, setRemainingDistance] =
    useState<number | null>(null);

  const [remainingDuration, setRemainingDuration] =
    useState<number | null>(null);

  useEffect(() => {
    if (!isNavigating || !location || !route) {
      setRemainingDistance(null);
      setRemainingDuration(null);
      return;
    }

    const distance = getRemainingDistance(
      location,
      route.coordinates,
    );

    // Original route's average speed
    const averageSpeed =
      route.distanceMeters / route.durationSeconds;

    // Estimate remaining time
    const duration =
      averageSpeed > 0
        ? distance / averageSpeed
        : null;

    setRemainingDistance(distance);
    setRemainingDuration(duration);

    console.log(
      "📍 REMAINING DISTANCE:",
      Math.round(distance),
      "meters",
    );

    if (duration !== null) {
      console.log(
        "⏱️ REMAINING DURATION:",
        Math.ceil(duration),
        "seconds",
      );
    }
  }, [
    location?.latitude,
    location?.longitude,
    route,
    isNavigating,
  ]);

  return {
    remainingDistance,
    remainingDuration,
  };
}