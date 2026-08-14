import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import pointToLineDistance from "@turf/point-to-line-distance";
import { lineString, point } from "@turf/helpers";
import type {
  FeatureCollection,
  MultiPolygon,
  Polygon,
} from "geojson";

export type SafetyStatus =
  | "SAFE"
  | "APPROACHING"
  | "INSIDE";

export interface SafetyResult {
  status: SafetyStatus;
  zoneName: string | null;
  distanceMeters: number | null;
}

const WARNING_DISTANCE_METERS = 500;

export function checkSafetyZone(
  latitude: number,
  longitude: number,
  zones: FeatureCollection<Polygon | MultiPolygon>,
): SafetyResult {
  const userPoint = point([longitude, latitude]);

  // -----------------------------
  // 1. Check INSIDE first
  // -----------------------------

  for (const zone of zones.features) {
    if (booleanPointInPolygon(userPoint, zone)) {
      return {
        status: "INSIDE",
        zoneName: zone.properties?.name ?? "Unknown Zone",
        distanceMeters: 0,
      };
    }
  }

  // -----------------------------
  // 2. Find nearest zone boundary
  // -----------------------------

  let nearestDistance = Infinity;
  let nearestZoneName: string | null = null;

  for (const zone of zones.features) {
    if (zone.geometry.type !== "Polygon") {
      continue;
    }

    const outerBoundary = zone.geometry.coordinates[0];

    const boundaryLine = lineString(outerBoundary);

    const distanceKm = pointToLineDistance(
      userPoint,
      boundaryLine,
      {
        units: "kilometers",
      },
    );

    const distanceMeters = distanceKm * 1000;

    if (distanceMeters < nearestDistance) {
      nearestDistance = distanceMeters;

      nearestZoneName =
        zone.properties?.name ?? "Unknown Zone";
    }
  }

  // -----------------------------
  // 3. APPROACHING
  // -----------------------------

  if (nearestDistance <= WARNING_DISTANCE_METERS) {
    return {
      status: "APPROACHING",
      zoneName: nearestZoneName,
      distanceMeters: Math.round(nearestDistance),
    };
  }

  // -----------------------------
  // 4. SAFE
  // -----------------------------

  return {
    status: "SAFE",
    zoneName: null,
    distanceMeters:
      nearestDistance === Infinity
        ? null
        : Math.round(nearestDistance),
  };
}