import { getDistanceMeters } from "./distance";

export function findNearestAmenity(
  latitude: number,
  longitude: number,
  features: any[],
  amenity: string,
) {
  let nearest = null;
  let minDistance = Number.MAX_VALUE;

  for (const feature of features) {
    if (
      feature.properties?.amenity !== amenity
    ) {
      continue;
    }

    const coordinates =
      feature.geometry.coordinates;

    const distance =
      getDistanceMeters(
        latitude,
        longitude,
        coordinates[1],
        coordinates[0],
      );

    if (distance < minDistance) {
      minDistance = distance;
      nearest = {
        ...feature,
        distance,
      };
    }
  }

  return nearest;
}