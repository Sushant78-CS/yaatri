import { safetyZones } from "../data/safetyZones";

type Coordinate = [number, number];

function pointInPolygon(
  point: Coordinate,
  polygon: Coordinate[],
): boolean {
  const [x, y] = point;

  let inside = false;

  for (
    let i = 0, j = polygon.length - 1;
    i < polygon.length;
    j = i++
  ) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    const intersects =
      yi > y !== yj > y &&
      x <
        ((xj - xi) * (y - yi)) /
          (yj - yi) +
          xi;

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
}

export function countUnsafeRoutePoints(
  routeCoordinates: Coordinate[],
): number {
  let unsafePoints = 0;

  for (const coordinate of routeCoordinates) {
    for (const feature of safetyZones.features) {
      const polygon =
        feature.geometry.coordinates[0] as Coordinate[];

      if (pointInPolygon(coordinate, polygon)) {
        unsafePoints++;
        break;
      }
    }
  }

  return unsafePoints;
}