import {
  analyzeRouteSafety,
  type RouteSafetyAnalysis,
} from "../utils/routeSafety";

export interface RouteCoordinate {
  latitude: number;
  longitude: number;
}

export interface RouteStep {
  distanceMeters: number;
  durationSeconds: number;
  instruction: string;
  maneuverType: string;
  maneuverModifier?: string;
  location: [number, number];
}

export interface RouteResult {
  coordinates: [number, number][];
  distanceMeters: number;
  durationSeconds: number;
  steps: RouteStep[];

  // Kept for backward compatibility.
  unsafePoints: number;

  // Complete safety analysis of selected route.
  safetyAnalysis: RouteSafetyAnalysis;
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
    `?overview=full&geometries=geojson&steps=true&alternatives=true`;

  console.log("🌐 ROUTING URL:", url);

  try {
    /*
     * --------------------------------------------------
     * REQUEST ROUTE FROM OSRM
     * --------------------------------------------------
     */

    const response = await fetch(url);

    console.log(
      "🌐 ROUTING STATUS:",
      response.status,
    );

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

    const routes = data.routes;

    console.log(
      "🛣️ ROUTES FOUND:",
      routes.length,
    );

    /*
     * --------------------------------------------------
     * ANALYZE FIRST ROUTE
     * --------------------------------------------------
     *
     * OSRM provides distance in meters.
     *
     * We pass that distance into the safety engine
     * so exposure ratio can be calculated correctly.
     */

    let selectedRoute = routes[0];

    let bestSafetyAnalysis =
      analyzeRouteSafety(
        selectedRoute.geometry.coordinates,
        selectedRoute.distance,
      );

    /*
     * --------------------------------------------------
     * COMPARE ALTERNATIVE ROUTES
     * --------------------------------------------------
     *
     * Primary criterion:
     *
     *     Lower mapped-zone exposure
     *
     * Tie-breaker:
     *
     *     Shorter route
     *
     * We intentionally do NOT use conflict-point count
     * for route selection anymore.
     */

    for (let i = 1; i < routes.length; i++) {
      const candidate = routes[i];

      const safetyAnalysis =
        analyzeRouteSafety(
          candidate.geometry.coordinates,
          candidate.distance,
        );

      console.log(
        `🛡️ ROUTE ${i + 1} SAFETY:`,
        {
          /*
           * Legacy point-based information.
           */
          total:
            safetyAnalysis.totalConflictPoints,

          military:
            safetyAnalysis.militaryPoints,

          environmental:
            safetyAnalysis.environmentalPoints,

          safety:
            safetyAnalysis.safetyPoints,

          /*
           * Actual route exposure.
           */
          militaryExposureMeters:
            Math.round(
              safetyAnalysis.militaryExposureMeters,
            ),

          environmentalExposureMeters:
            Math.round(
              safetyAnalysis.environmentalExposureMeters,
            ),

          safetyExposureMeters:
            Math.round(
              safetyAnalysis.safetyExposureMeters,
            ),

          totalExposureMeters:
            Math.round(
              safetyAnalysis.totalExposureMeters,
            ),

          /*
           * Exposure ratio and scores.
           */
          exposureRatio:
            Math.round(
              safetyAnalysis.exposureRatio * 10000,
            ) / 10000,

          riskScore:
            Math.round(
              safetyAnalysis.riskScore * 100,
            ) / 100,

          safetyScore:
            Math.round(
              safetyAnalysis.safetyScore * 100,
            ) / 100,

          riskLevel:
            safetyAnalysis.riskLevel,

          /*
           * Zones involved.
           */
          militaryAreas:
            safetyAnalysis.militaryAreas,

          environmentalAreas:
            safetyAnalysis.environmentalAreas,

          safetyAreas:
            safetyAnalysis.safetyAreas,
        },
      );

      /*
       * ------------------------------------------------
       * ROUTE SELECTION
       * ------------------------------------------------
       *
       * 1. Lower total exposure wins.
       *
       * 2. If exposure is equal, shorter route wins.
       */

      if (
        safetyAnalysis.totalExposureMeters <
        bestSafetyAnalysis.totalExposureMeters
      ) {
        selectedRoute = candidate;

        bestSafetyAnalysis =
          safetyAnalysis;
      } else if (
        safetyAnalysis.totalExposureMeters ===
          bestSafetyAnalysis.totalExposureMeters &&
        candidate.distance <
          selectedRoute.distance
      ) {
        selectedRoute = candidate;

        bestSafetyAnalysis =
          safetyAnalysis;
      }
    }

    /*
     * --------------------------------------------------
     * SELECTED ROUTE SAFETY
     * --------------------------------------------------
     */

    console.log(
      "🛡️ SELECTED ROUTE SAFETY:",
      {
        /*
         * Legacy conflict information.
         */
        total:
          bestSafetyAnalysis.totalConflictPoints,

        military:
          bestSafetyAnalysis.militaryPoints,

        environmental:
          bestSafetyAnalysis.environmentalPoints,

        safety:
          bestSafetyAnalysis.safetyPoints,

        /*
         * Actual exposure.
         */
        militaryExposureMeters:
          Math.round(
            bestSafetyAnalysis.militaryExposureMeters,
          ),

        environmentalExposureMeters:
          Math.round(
            bestSafetyAnalysis.environmentalExposureMeters,
          ),

        safetyExposureMeters:
          Math.round(
            bestSafetyAnalysis.safetyExposureMeters,
          ),

        totalExposureMeters:
          Math.round(
            bestSafetyAnalysis.totalExposureMeters,
          ),

        /*
         * Safety metrics.
         */
        exposureRatio:
          Math.round(
            bestSafetyAnalysis.exposureRatio * 10000,
          ) / 10000,

        riskScore:
          Math.round(
            bestSafetyAnalysis.riskScore * 100,
          ) / 100,

        safetyScore:
          Math.round(
            bestSafetyAnalysis.safetyScore * 100,
          ) / 100,

        riskLevel:
          bestSafetyAnalysis.riskLevel,

        /*
         * Areas involved.
         */
        militaryAreas:
          bestSafetyAnalysis.militaryAreas,

        environmentalAreas:
          bestSafetyAnalysis.environmentalAreas,

        safetyAreas:
          bestSafetyAnalysis.safetyAreas,
      },
    );

    /*
     * --------------------------------------------------
     * FINAL SELECTED ROUTE
     * --------------------------------------------------
     */

    const route = selectedRoute;

    /*
     * --------------------------------------------------
     * VALIDATE ROUTE GEOMETRY
     * --------------------------------------------------
     */

    if (
      !route.geometry ||
      !route.geometry.coordinates ||
      route.geometry.coordinates.length < 2
    ) {
      throw new Error(
        "Route geometry is invalid.",
      );
    }

    /*
     * --------------------------------------------------
     * CONVERT OSRM STEPS
     * --------------------------------------------------
     */

    const steps: RouteStep[] =
      route.legs[0].steps.map(
        (step: any) => {
          const type =
            step.maneuver?.type ??
            "continue";

          const modifier =
            step.maneuver?.modifier ??
            "";

          let instruction =
            "Continue";

          if (type === "depart") {
            instruction =
              "Start navigation";
          } else if (
            type === "arrive"
          ) {
            instruction =
              "Arrive at destination";
          } else if (
            type === "turn"
          ) {
            instruction =
              modifier === "left"
                ? "Turn left"
                : modifier === "right"
                  ? "Turn right"
                  : "Turn";
          } else if (
            type === "new name"
          ) {
            instruction =
              "Continue";
          } else if (
            type === "merge"
          ) {
            instruction =
              "Merge";
          } else if (
            type === "roundabout"
          ) {
            instruction =
              "Enter roundabout";
          } else if (
            type === "fork"
          ) {
            instruction =
              modifier === "left"
                ? "Keep left"
                : modifier === "right"
                  ? "Keep right"
                  : "Keep straight";
          } else if (
            type === "continue"
          ) {
            instruction =
              "Continue straight";
          }

          return {
            distanceMeters:
              step.distance,

            durationSeconds:
              step.duration,

            instruction,

            maneuverType:
              type,

            maneuverModifier:
              modifier,

            location:
              step.maneuver.location,
          };
        },
      );

    /*
     * --------------------------------------------------
     * RETURN APPLICATION ROUTE
     * --------------------------------------------------
     */

    return {
      coordinates:
        route.geometry.coordinates,

      distanceMeters:
        route.distance,

      durationSeconds:
        route.duration,

      steps,

      /*
       * Backward compatibility.
       */
      unsafePoints:
        bestSafetyAnalysis.totalConflictPoints,

      /*
       * New safety analysis.
       */
      safetyAnalysis:
        bestSafetyAnalysis,
    };
  } catch (error) {
    console.error(
      "❌ ROUTING SERVICE ERROR:",
      error,
    );

    throw error;
  }
}