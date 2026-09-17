import { countUnsafeRoutePoints } from "../utils/routeSafety";
export interface RouteCoordinate {
  latitude: number;
  longitude: number;
}

export interface RouteResult {
  coordinates: [number, number][];
  distanceMeters: number;
  durationSeconds: number;
  steps: RouteStep[];
  unsafePoints: number;
}
export interface RouteStep {
  distanceMeters: number;
  durationSeconds: number;
  instruction: string;
  maneuverType: string;
  maneuverModifier?: string;
  location: [number, number];
}
const OSRM_URL = "https://router.project-osrm.org/route/v1/driving";

export async function getRoute(
  start: RouteCoordinate,
  destination: RouteCoordinate,
): Promise<RouteResult> {
  const url =
    `${OSRM_URL}/` +
    `${start.longitude},${start.latitude};` +
    `${destination.longitude},${destination.latitude}` +
    `?overview=full&geometries=geojson&steps=true&alternatives=true`;

  console.log("🌐 ROUTING URL:", url);

  try {
    const response = await fetch(url);

    console.log("🌐 ROUTING STATUS:", response.status);

    const responseText = await response.text();

    console.log("🌐 ROUTING RESPONSE:", responseText.substring(0, 500));

    if (!response.ok) {
      throw new Error(`Routing request failed: ${response.status}`);
    }

    const data = JSON.parse(responseText);

    if (!data.routes || data.routes.length === 0) {
      throw new Error("No route found.");
    }

    const routes = data.routes;

    console.log("🛣️ ROUTES FOUND:", routes.length);
    let selectedRoute = routes[0];

    let bestUnsafePoints = countUnsafeRoutePoints(
      selectedRoute.geometry.coordinates,
    );

    for (let i = 1; i < routes.length; i++) {
      const unsafePoints = countUnsafeRoutePoints(
        routes[i].geometry.coordinates,
      );

      console.log(`🛡️ ROUTE ${i + 1} UNSAFE POINTS:`, unsafePoints);

      if (unsafePoints < bestUnsafePoints) {
        selectedRoute = routes[i];
        bestUnsafePoints = unsafePoints;
      } else if (
        unsafePoints === bestUnsafePoints &&
        routes[i].distance < selectedRoute.distance
      ) {
        selectedRoute = routes[i];
      }
    }

    console.log("🛡️ SELECTED ROUTE UNSAFE POINTS:", bestUnsafePoints);
    const route = selectedRoute;
    const steps: RouteStep[] = route.legs[0].steps.map((step: any) => {
      const type = step.maneuver?.type ?? "continue";
      const modifier = step.maneuver?.modifier ?? "";

      let instruction = "Continue";

      if (type === "depart") {
        instruction = "Start navigation";
      } else if (type === "arrive") {
        instruction = "Arrive at destination";
      } else if (type === "turn") {
        instruction =
          modifier === "left"
            ? "Turn left"
            : modifier === "right"
              ? "Turn right"
              : "Turn";
      } else if (type === "new name") {
        instruction = "Continue";
      } else if (type === "merge") {
        instruction = "Merge";
      } else if (type === "roundabout") {
        instruction = "Enter roundabout";
      } else if (type === "fork") {
        instruction =
          modifier === "left"
            ? "Keep left"
            : modifier === "right"
              ? "Keep right"
              : "Keep straight";
      } else if (type === "continue") {
        instruction = "Continue straight";
      }

      return {
        distanceMeters: step.distance,
        durationSeconds: step.duration,
        instruction,
        maneuverType: type,
        maneuverModifier: modifier,
        location: step.maneuver.location,
      };
    });

    if (
      !route.geometry ||
      !route.geometry.coordinates ||
      route.geometry.coordinates.length < 2
    ) {
      throw new Error("Route geometry is invalid.");
    }

    return {
  coordinates: route.geometry.coordinates,
  distanceMeters: route.distance,
  durationSeconds: route.duration,
  steps,
  unsafePoints: bestUnsafePoints,
};
  } catch (error) {
    console.error("❌ ROUTING SERVICE ERROR:", error);
    throw error;
  }
}
