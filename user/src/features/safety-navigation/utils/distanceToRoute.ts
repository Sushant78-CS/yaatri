import type { RouteCoordinate } from "../services/routing";

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

  const y = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));

  return R * y;
}

export function distanceToRoute(
  userLocation: RouteCoordinate,
  routeCoordinates: [number, number][],
): number {
  if (routeCoordinates.length === 0) {
    return Infinity;
  }

  let minimumDistance = Infinity;

  for (const coordinate of routeCoordinates) {
    const routePoint: RouteCoordinate = {
      longitude: coordinate[0],
      latitude: coordinate[1],
    };

    const distance = distanceBetweenPoints(
      userLocation,
      routePoint,
    );

    minimumDistance = Math.min(
      minimumDistance,
      distance,
    );
  }

  return minimumDistance;
}