export interface RouteCoordinate {
  latitude: number;
  longitude: number;
}

export interface RouteResult {
  coordinates: [number, number][];
  distanceMeters: number;
  durationSeconds: number;
}

const OSRM_URL =
  "https://router.project-osrm.org/route/v1/driving";

export async function getRoute(
  start: RouteCoordinate,
  destination: RouteCoordinate,
): Promise<RouteResult> {
  const url =
    `${OSRM_URL}/` +
    `${start.longitude},${start.latitude};` +
    `${destination.longitude},${destination.latitude}` +
    `?overview=full&geometries=geojson`;

  console.log("🌐 ROUTING URL:", url);

  try {
    const response = await fetch(url);

    console.log("🌐 ROUTING STATUS:", response.status);

    const responseText = await response.text();

    console.log(
      "🌐 ROUTING RESPONSE:",
      responseText.substring(0, 500),
    );

    if (!response.ok) {
      throw new Error(
        `Routing request failed: ${response.status}`,
      );
    }

    const data = JSON.parse(responseText);

    if (
      !data.routes ||
      data.routes.length === 0
    ) {
      throw new Error("No route found.");
    }

    const route = data.routes[0];

    if (
      !route.geometry ||
      !route.geometry.coordinates ||
      route.geometry.coordinates.length < 2
    ) {
      throw new Error(
        "Route geometry is invalid.",
      );
    }

    return {
      coordinates: route.geometry.coordinates,
      distanceMeters: route.distance,
      durationSeconds: route.duration,
    };
  } catch (error) {
    console.error("❌ ROUTING SERVICE ERROR:", error);
    throw error;
  }
}