import type { FeatureCollection, Polygon } from "geojson";

export interface SafetyZoneProperties {
  id: string;
  name: string;

  category:
  | "FLOOD"
  | "LANDSLIDE"
  | "WILDLIFE"
  | "RESTRICTED"
  | "CRIME"
  | "OTHER";

  riskLevel: "LOW" | "MEDIUM" | "HIGH";

  description: string;
  source: string;
}

export const safetyZones: FeatureCollection<
  Polygon,
  SafetyZoneProperties
> = {
  type: "FeatureCollection",

  features: [
    {
      type: "Feature",

      // DEVELOPMENT ONLY — NOT A REAL SAFETY ZONE
      properties: {
        id: "demo-zone-1",
        name: "Demo Safety Zone",
        category: "OTHER",
        riskLevel: "HIGH",
        description:
          "Development-only zone used for testing YAATRI safety detection.",
        source: "YAATRI test data",
      },

      geometry: {
        type: "Polygon",

        coordinates: [
          [
            [72.8700, 19.0800],
            [72.8800, 19.0800],
            [72.8800, 19.0700],
            [72.8700, 19.0700],
            [72.8700, 19.0800],
          ],
        ],
      },
    },
  ],
};