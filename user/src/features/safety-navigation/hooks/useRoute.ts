import { useEffect, useRef, useState } from "react";
import {
  getRoute,
  type RouteCoordinate,
  type RouteResult,
} from "../services/routing";
import { distanceToRoute } from "../utils/distanceToRoute";

interface UseRouteResult {
  route: RouteResult | null;
  loading: boolean;
  error: string | null;
}

const OFF_ROUTE_THRESHOLD = 40;
const REROUTE_COOLDOWN = 10000;

export default function useRoute(
  start: RouteCoordinate | null,
  destination: RouteCoordinate | null,
  isNavigating: boolean,
): UseRouteResult {
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lastRerouteTime = useRef(0);

  // --------------------------------
  // 1. CREATE INITIAL ROUTE
  // --------------------------------

  useEffect(() => {
    if (!start || !destination) {
      setRoute(null);
      return;
    }

    const fetchInitialRoute = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await getRoute(
          start,
          destination,
        );

        setRoute(result);

        console.log("🗺️ ROUTE CREATED");
      } catch (err) {
        console.error("ROUTING ERROR:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to calculate route.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInitialRoute();
  }, [
    destination?.latitude,
    destination?.longitude,
  ]);

  // --------------------------------
  // 2. OFF-ROUTE DETECTION
  // --------------------------------

  useEffect(() => {
    if (
      !isNavigating ||
      !start ||
      !destination ||
      !route
    ) {
      return;
    }

    const distance = distanceToRoute(
      start,
      route.coordinates,
    );

    console.log(
      "📏 DISTANCE FROM ROUTE:",
      Math.round(distance),
      "meters",
    );

    // User is still close to route
    if (distance <= OFF_ROUTE_THRESHOLD) {
      return;
    }

    // Prevent repeated API calls
    const now = Date.now();

    if (
      now - lastRerouteTime.current <
      REROUTE_COOLDOWN
    ) {
      console.log("⏳ REROUTE COOLDOWN");
      return;
    }

    lastRerouteTime.current = now;

    console.log("🚨 OFF ROUTE!");
    console.log("🔄 REROUTING...");

    const reroute = async () => {
      try {
        setLoading(true);

        const newRoute = await getRoute(
          start,
          destination,
        );

        setRoute(newRoute);

        console.log("✅ REROUTE COMPLETE");
      } catch (err) {
        console.error("❌ REROUTING ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    reroute();
  }, [
    start?.latitude,
    start?.longitude,
    destination?.latitude,
    destination?.longitude,
    isNavigating,
    route,
  ]);

  return {
    route,
    loading,
    error,
  };
}