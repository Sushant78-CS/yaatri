import { useEffect, useState } from "react";
import type {
  RouteCoordinate,
  RouteResult,
  RouteStep,
} from "../services/routing";

const MANEUVER_REACHED_THRESHOLD = 25; // meters

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
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(dLon / 2) ** 2;

  const y =
    2 * Math.atan2(
      Math.sqrt(x),
      Math.sqrt(1 - x),
    );

  return R * y;
}

export default function useNavigationInstruction(
  location: RouteCoordinate | null,
  route: RouteResult | null,
  isNavigating: boolean,
) {
  const [currentStepIndex, setCurrentStepIndex] =
    useState(0);

  const [stepDistance, setStepDistance] =
    useState<number | null>(null);

  // Reset instructions whenever a new route is created
  useEffect(() => {
    setCurrentStepIndex(0);
  }, [route]);

  useEffect(() => {
    if (
      !isNavigating ||
      !location ||
      !route ||
      route.steps.length === 0
    ) {
      setStepDistance(null);
      return;
    }

    const step = route.steps[currentStepIndex];

    if (!step) {
      return;
    }

    const maneuverLocation: RouteCoordinate = {
      longitude: step.location[0],
      latitude: step.location[1],
    };

    const distance = distanceBetweenPoints(
      location,
      maneuverLocation,
    );

    setStepDistance(distance);

    console.log(
      "🧭 CURRENT INSTRUCTION:",
      step.instruction,
    );

    console.log(
      "📍 DISTANCE TO MANEUVER:",
      Math.round(distance),
      "meters",
    );

    // Maneuver reached → move to next instruction
    if (
      distance <= MANEUVER_REACHED_THRESHOLD &&
      currentStepIndex < route.steps.length - 1
    ) {
      console.log(
        "➡️ MOVING TO NEXT INSTRUCTION",
      );

      setCurrentStepIndex(
        (previousIndex) => previousIndex + 1,
      );
    }
  }, [
    location?.latitude,
    location?.longitude,
    route,
    isNavigating,
    currentStepIndex,
  ]);

  const currentStep: RouteStep | null =
    route?.steps[currentStepIndex] ?? null;

  return {
    currentStep,
    stepDistance,
  };
}