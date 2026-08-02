import type {
  Feature,
  FeatureCollection,
  Polygon,
} from "geojson";

import type {
  OverpassElement,
  OverpassResponse,
} from "@/features/safety-navigation/services/overpass";

export interface ProtectedAreaProperties {
  id: string;
  name: string;
  category: "WILDLIFE";
  source: string;
  osmType: string;
  osmId: number;
}

export function convertOverpassToGeoJSON(
  data: OverpassResponse,
): FeatureCollection<Polygon, ProtectedAreaProperties> {
  const features: Feature<
    Polygon,
    ProtectedAreaProperties
  >[] = [];

  for (const element of data.elements) {
    // For now only process OSM ways.
    // Relations require multipolygon handling.
    if (element.type !== "way") {
      continue;
    }

    if (!element.geometry || element.geometry.length < 4) {
      continue;
    }

    const coordinates = element.geometry.map((point) => [
      point.lon,
      point.lat,
    ]);

    // GeoJSON polygon must be closed.
    const first = coordinates[0];
    const last = coordinates[coordinates.length - 1];

    if (
      first[0] !== last[0] ||
      first[1] !== last[1]
    ) {
      coordinates.push([...first]);
    }

    features.push({
      type: "Feature",

      properties: {
        id: `osm-way-${element.id}`,
        name: element.tags?.name ?? "Protected Area",
        category: "WILDLIFE",
        source: "OpenStreetMap",
        osmType: element.type,
        osmId: element.id,
      },

      geometry: {
        type: "Polygon",
        coordinates: [coordinates],
      },
    });
  }

  return {
    type: "FeatureCollection",
    features,
  };
}