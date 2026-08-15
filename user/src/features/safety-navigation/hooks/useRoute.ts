import { useEffect, useState } from "react";
import {
  getRoute,
  type RouteCoordinate,
  type RouteResult,
} from "../services/routing";

interface UseRouteResult {
  route: RouteResult | null;
  loading: boolean;
  error: string | null;
}

export default function useRoute(
  start: RouteCoordinate | null,
  destination: RouteCoordinate | null,
  isNavigating: boolean,
): UseRouteResult {
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  if (!start || !destination) {
    setRoute(null);
    return;
  }

  const fetchRoute = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(
  "🔥 ROUTING API CALLED",
  "START:",
  start,
  "DESTINATION:",
  destination
);
      const result = await getRoute(
        start,
        destination,
      );

      setRoute(result);
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

  fetchRoute();
}, [
  destination?.latitude,
  destination?.longitude,
]);

  return {
    route,
    loading,
    error,
  };
}