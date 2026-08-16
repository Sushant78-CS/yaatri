import type { RouteCoordinate } from "../services/routing";

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function distanceBetween(
  a: RouteCoordinate,
  b: RouteCoordinate,
): number {
  const R = 6371000;

  const lat1 = toRadians(a.latitude);
  const lat2 = toRadians(b.latitude);

  const deltaLat = toRadians(
    b.latitude - a.latitude,
  );

  const deltaLon = toRadians(
    b.longitude - a.longitude,
  );

  const x =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLon / 2) ** 2;

  const c =
    2 * Math.atan2(
      Math.sqrt(x),
      Math.sqrt(1 - x),
    );

  return R * c;
}

export function getRemainingDistance(
  currentLocation: RouteCoordinate,
  route: [number, number][],
): number {
  if (route.length < 2) {
    return 0;
  }

  let nearestIndex = 0;
  let nearestDistance = Infinity;

  for (let i = 0; i < route.length; i++) {
    const [longitude, latitude] = route[i];

    const distance = distanceBetween(
      currentLocation,
      {
        latitude,
        longitude,
      },
    );

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = i;
    }
  }

  let remainingDistance = nearestDistance;

  for (
    let i = nearestIndex;
    i < route.length - 1;
    i++
  ) {
    const [lon1, lat1] = route[i];
    const [lon2, lat2] = route[i + 1];

    remainingDistance += distanceBetween(
      {
        latitude: lat1,
        longitude: lon1,
      },
      {
        latitude: lat2,
        longitude: lon2,
      },
    );
  }

  return remainingDistance;
}