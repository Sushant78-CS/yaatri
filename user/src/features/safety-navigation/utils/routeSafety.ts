import { safetyZones } from "../data/safetyZones";
import militaryAreas from "../data/maharashtra/mumbai/militaryAreas.json";
import environmentalAreas from "../data/maharashtra/mumbai/environmentalAreas.json";

export type Coordinate = [number, number];

export type RouteZoneCategory =
  | "MILITARY"
  | "ENVIRONMENTAL"
  | "SAFETY";

export interface RouteZoneConflict {
  category: RouteZoneCategory;
  name: string;

  // Number of route coordinates inside the zone.
  points: number;

  // Actual route distance inside the zone.
  exposureMeters: number;
}

export type RouteRiskLevel =
  | "LOW"
  | "MEDIUM"
  | "HIGH";

export interface RouteSafetyAnalysis {
  // Backward-compatible point count.
  totalConflictPoints: number;

  militaryPoints: number;
  environmentalPoints: number;
  safetyPoints: number;

  militaryAreas: string[];
  environmentalAreas: string[];
  safetyAreas: string[];

  conflicts: RouteZoneConflict[];

  // Actual route exposure.
  totalExposureMeters: number;
  militaryExposureMeters: number;
  environmentalExposureMeters: number;
  safetyExposureMeters: number;

  // Safety metrics.
  exposureRatio: number;
  riskScore: number;
  safetyScore: number;
  riskLevel: RouteRiskLevel;
}

/* -------------------------------------------------------
   BASIC GEOMETRY
------------------------------------------------------- */

function pointInPolygon(
  point: Coordinate,
  polygon: Coordinate[],
): boolean {
  if (polygon.length < 3) {
    return false;
  }

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

function pointInPolygonWithHoles(
  point: Coordinate,
  rings: Coordinate[][],
): boolean {
  if (rings.length === 0) {
    return false;
  }

  // Must be inside outer ring.
  if (!pointInPolygon(point, rings[0])) {
    return false;
  }

  // Must NOT be inside any hole.
  for (let i = 1; i < rings.length; i++) {
    if (pointInPolygon(point, rings[i])) {
      return false;
    }
  }

  return true;
}

function pointInGeometry(
  point: Coordinate,
  geometry: any,
): boolean {
  if (!geometry) {
    return false;
  }

  if (geometry.type === "Polygon") {
    return pointInPolygonWithHoles(
      point,
      geometry.coordinates as Coordinate[][],
    );
  }

  if (geometry.type === "MultiPolygon") {
    for (const polygon of geometry.coordinates) {
      if (
        pointInPolygonWithHoles(
          point,
          polygon as Coordinate[][],
        )
      ) {
        return true;
      }
    }
  }

  return false;
}

/* -------------------------------------------------------
   DISTANCE
------------------------------------------------------- */

function haversineDistance(
  a: Coordinate,
  b: Coordinate,
): number {
  const R = 6371000;

  const lat1 = (a[1] * Math.PI) / 180;
  const lat2 = (b[1] * Math.PI) / 180;

  const dLat =
    ((b[1] - a[1]) * Math.PI) / 180;

  const dLon =
    ((b[0] - a[0]) * Math.PI) / 180;

  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);

  const value =
    sinLat * sinLat +
    Math.cos(lat1) *
      Math.cos(lat2) *
      sinLon *
      sinLon;

  return (
    2 *
    R *
    Math.atan2(
      Math.sqrt(value),
      Math.sqrt(1 - value),
    )
  );
}

/* -------------------------------------------------------
   LINE SEGMENT / POLYGON INTERSECTION
------------------------------------------------------- */

function cross(
  a: Coordinate,
  b: Coordinate,
  c: Coordinate,
): number {
  return (
    (b[0] - a[0]) * (c[1] - a[1]) -
    (b[1] - a[1]) * (c[0] - a[0])
  );
}

/**
 * Returns the position along segment AB where
 * the intersection occurs.
 *
 * t = 0 → A
 * t = 1 → B
 */
function segmentIntersectionParameter(
  a: Coordinate,
  b: Coordinate,
  c: Coordinate,
  d: Coordinate,
): number | null {
  const rX = b[0] - a[0];
  const rY = b[1] - a[1];

  const sX = d[0] - c[0];
  const sY = d[1] - c[1];

  const denominator =
    rX * sY - rY * sX;

  const qpx = c[0] - a[0];
  const qpy = c[1] - a[1];

  // Parallel or collinear.
  if (Math.abs(denominator) < 1e-12) {
    return null;
  }

  const t =
    (qpx * sY - qpy * sX) /
    denominator;

  const u =
    (qpx * rY - qpy * rX) /
    denominator;

  if (
    t >= 0 &&
    t <= 1 &&
    u >= 0 &&
    u <= 1
  ) {
    return t;
  }

  return null;
}

/**
 * Get all points where a route segment crosses
 * a polygon ring.
 */
function getIntersectionParameters(
  start: Coordinate,
  end: Coordinate,
  ring: Coordinate[],
): number[] {
  const parameters: number[] = [];

  for (let i = 0; i < ring.length - 1; i++) {
    const edgeStart = ring[i];
    const edgeEnd = ring[i + 1];

    const t =
      segmentIntersectionParameter(
        start,
        end,
        edgeStart,
        edgeEnd,
      );

    if (t !== null) {
      parameters.push(t);
    }
  }

  return parameters;
}

/* -------------------------------------------------------
   ROUTE EXPOSURE
------------------------------------------------------- */

/**
 * Calculate how many meters of a route segment
 * are actually inside a polygon.
 *
 * We split the route segment at every polygon
 * boundary crossing and test the midpoint of each
 * resulting piece.
 */
function calculateSegmentExposure(
  start: Coordinate,
  end: Coordinate,
  rings: Coordinate[][],
): number {
  const parameters: number[] = [0, 1];

  for (const ring of rings) {
    parameters.push(
      ...getIntersectionParameters(
        start,
        end,
        ring,
      ),
    );
  }

  // Sort and remove duplicate parameters.
  parameters.sort((a, b) => a - b);

  const uniqueParameters: number[] = [];

  for (const value of parameters) {
    if (
      uniqueParameters.length === 0 ||
      Math.abs(
        value -
          uniqueParameters[
            uniqueParameters.length - 1
          ],
      ) > 1e-10
    ) {
      uniqueParameters.push(value);
    }
  }

  let exposureMeters = 0;

  for (
    let i = 0;
    i < uniqueParameters.length - 1;
    i++
  ) {
    const t1 = uniqueParameters[i];
    const t2 = uniqueParameters[i + 1];

    if (t2 <= t1) {
      continue;
    }

    const startPiece: Coordinate = [
      start[0] +
        (end[0] - start[0]) * t1,
      start[1] +
        (end[1] - start[1]) * t1,
    ];

    const endPiece: Coordinate = [
      start[0] +
        (end[0] - start[0]) * t2,
      start[1] +
        (end[1] - start[1]) * t2,
    ];

    const midpoint: Coordinate = [
      (startPiece[0] + endPiece[0]) / 2,
      (startPiece[1] + endPiece[1]) / 2,
    ];

    if (
      pointInPolygonWithHoles(
        midpoint,
        rings,
      )
    ) {
      exposureMeters +=
        haversineDistance(
          startPiece,
          endPiece,
        );
    }
  }

  return exposureMeters;
}

/**
 * Calculate exposure against one geometry.
 */
function calculateGeometryExposure(
  routeCoordinates: Coordinate[],
  geometry: any,
): number {
  if (!geometry) {
    return 0;
  }

  if (geometry.type === "Polygon") {
    return calculatePolygonExposure(
      routeCoordinates,
      geometry.coordinates as Coordinate[][],
    );
  }

  if (geometry.type === "MultiPolygon") {
    let total = 0;

    for (const polygon of geometry.coordinates) {
      total += calculatePolygonExposure(
        routeCoordinates,
        polygon as Coordinate[][],
      );
    }

    return total;
  }

  return 0;
}

function calculatePolygonExposure(
  routeCoordinates: Coordinate[],
  rings: Coordinate[][],
): number {
  if (rings.length === 0) {
    return 0;
  }

  let total = 0;

  for (
    let i = 0;
    i < routeCoordinates.length - 1;
    i++
  ) {
    total += calculateSegmentExposure(
      routeCoordinates[i],
      routeCoordinates[i + 1],
      rings,
    );
  }

  return total;
}

/* -------------------------------------------------------
   FEATURE NAME
------------------------------------------------------- */

function getFeatureName(
  feature: any,
  fallback: string,
): string {
  return (
    feature?.properties?.name ??
    feature?.properties?.short_name ??
    feature?.properties?.protection_title ??
    feature?.properties?.military ??
    fallback
  );
}

/* -------------------------------------------------------
   MAIN ANALYSIS
------------------------------------------------------- */

export function analyzeRouteSafety(
  routeCoordinates: Coordinate[],
  routeDistanceMeters?: number,
): RouteSafetyAnalysis {
  let militaryPoints = 0;
  let environmentalPoints = 0;
  let safetyPoints = 0;

  let militaryExposureMeters = 0;
  let environmentalExposureMeters = 0;
  let safetyExposureMeters = 0;

  const militaryAreaCounts =
    new Map<string, number>();

  const environmentalAreaCounts =
    new Map<string, number>();

  const safetyAreaCounts =
    new Map<string, number>();

  const militaryAreaExposure =
    new Map<string, number>();

  const environmentalAreaExposure =
    new Map<string, number>();

  const safetyAreaExposure =
    new Map<string, number>();

  /* ---------------- MILITARY ---------------- */

  for (const feature of militaryAreas.features) {
    const name = getFeatureName(
      feature,
      "Military / Restricted Area",
    );

    let points = 0;

    for (const coordinate of routeCoordinates) {
      if (
        pointInGeometry(
          coordinate,
          feature.geometry,
        )
      ) {
        points++;
      }
    }

    const exposureMeters =
      calculateGeometryExposure(
        routeCoordinates,
        feature.geometry,
      );

    if (points > 0 || exposureMeters > 0) {
      militaryPoints += points;

      militaryExposureMeters +=
        exposureMeters;

      militaryAreaCounts.set(
        name,
        (militaryAreaCounts.get(name) ?? 0) +
          points,
      );

      militaryAreaExposure.set(
        name,
        (militaryAreaExposure.get(name) ?? 0) +
          exposureMeters,
      );
    }
  }

  /* ---------------- ENVIRONMENTAL ---------------- */

  for (const feature of environmentalAreas.features) {
    const name = getFeatureName(
      feature,
      "Environmental / Protected Area",
    );

    let points = 0;

    for (const coordinate of routeCoordinates) {
      if (
        pointInGeometry(
          coordinate,
          feature.geometry,
        )
      ) {
        points++;
      }
    }

    const exposureMeters =
      calculateGeometryExposure(
        routeCoordinates,
        feature.geometry,
      );

    if (points > 0 || exposureMeters > 0) {
      environmentalPoints += points;

      environmentalExposureMeters +=
        exposureMeters;

      environmentalAreaCounts.set(
        name,
        (environmentalAreaCounts.get(name) ?? 0) +
          points,
      );

      environmentalAreaExposure.set(
        name,
        (environmentalAreaExposure.get(name) ?? 0) +
          exposureMeters,
      );
    }
  }

  /* ---------------- SAFETY ZONES ---------------- */

  for (const feature of safetyZones.features) {
    const name = getFeatureName(
      feature,
      "Safety Zone",
    );

    let points = 0;

    for (const coordinate of routeCoordinates) {
      if (
        pointInGeometry(
          coordinate,
          feature.geometry,
        )
      ) {
        points++;
      }
    }

    const exposureMeters =
      calculateGeometryExposure(
        routeCoordinates,
        feature.geometry,
      );

    if (points > 0 || exposureMeters > 0) {
      safetyPoints += points;

      safetyExposureMeters +=
        exposureMeters;

      safetyAreaCounts.set(
        name,
        (safetyAreaCounts.get(name) ?? 0) +
          points,
      );

      safetyAreaExposure.set(
        name,
        (safetyAreaExposure.get(name) ?? 0) +
          exposureMeters,
      );
    }
  }

  /* ---------------- AREA NAMES ---------------- */

  const militaryAreasFound = [
    ...militaryAreaCounts.keys(),
  ];

  const environmentalAreasFound = [
    ...environmentalAreaCounts.keys(),
  ];

  const safetyAreasFound = [
    ...safetyAreaCounts.keys(),
  ];

  /* ---------------- CONFLICT DETAILS ---------------- */

  const conflicts: RouteZoneConflict[] = [];

  for (const [name, points] of militaryAreaCounts) {
    conflicts.push({
      category: "MILITARY",
      name,
      points,
      exposureMeters:
        militaryAreaExposure.get(name) ?? 0,
    });
  }

  for (const [name, points] of environmentalAreaCounts) {
    conflicts.push({
      category: "ENVIRONMENTAL",
      name,
      points,
      exposureMeters:
        environmentalAreaExposure.get(name) ?? 0,
    });
  }

  for (const [name, points] of safetyAreaCounts) {
    conflicts.push({
      category: "SAFETY",
      name,
      points,
      exposureMeters:
        safetyAreaExposure.get(name) ?? 0,
    });
  }

  const totalExposureMeters =
  militaryExposureMeters +
  environmentalExposureMeters +
  safetyExposureMeters;

/*
 * --------------------------------------------------
 * SAFETY METRICS
 * --------------------------------------------------
 *
 * exposureRatio:
 *
 *     total zone exposure
 *     -------------------
 *       total route distance
 *
 * Example:
 *
 * route = 10,000 m
 * exposure = 500 m
 *
 * ratio = 0.05
 */

let totalRouteDistanceMeters =
  routeDistanceMeters ?? 0;

if (
  totalRouteDistanceMeters <= 0 &&
  routeCoordinates.length >= 2
) {
  totalRouteDistanceMeters = 0;

  for (
    let i = 0;
    i < routeCoordinates.length - 1;
    i++
  ) {
    totalRouteDistanceMeters +=
      haversineDistance(
        routeCoordinates[i],
        routeCoordinates[i + 1],
      );
  }
}

const exposureRatio =
  totalRouteDistanceMeters > 0
    ? totalExposureMeters /
      totalRouteDistanceMeters
    : 0;

/*
 * Convert exposure ratio into a 0-100 risk score.
 */
const riskScore = Math.min(
  100,
  exposureRatio * 100,
);

const safetyScore = Math.max(
  0,
  100 - riskScore,
);

let riskLevel: RouteRiskLevel = "LOW";

if (riskScore >= 20) {
  riskLevel = "HIGH";
} else if (riskScore >= 5) {
  riskLevel = "MEDIUM";
}

return {
  totalConflictPoints:
    militaryPoints +
    environmentalPoints +
    safetyPoints,

  militaryPoints,
  environmentalPoints,
  safetyPoints,

  militaryAreas:
    militaryAreasFound,

  environmentalAreas:
    environmentalAreasFound,

  safetyAreas:
    safetyAreasFound,

  conflicts,

  totalExposureMeters,

  militaryExposureMeters,

  environmentalExposureMeters,

  safetyExposureMeters,

  // New safety metrics.
  exposureRatio,

  riskScore,

  safetyScore,

  riskLevel,
};
}

/* -------------------------------------------------------
   BACKWARD COMPATIBILITY
------------------------------------------------------- */

export function countUnsafeRoutePoints(
  routeCoordinates: Coordinate[],
): number {
  return analyzeRouteSafety(
    routeCoordinates,
  ).totalConflictPoints;
}