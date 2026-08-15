import React from "react";
import type { Feature, LineString } from "geojson";
import {
  GeoJSONSource,
  Layer,
} from "@maplibre/maplibre-react-native";

interface Props {
  coordinates: [number, number][] | null;
}

export default function RouteLine({
  coordinates,
}: Props) {
  // Route hasn't arrived yet
  if (!coordinates || coordinates.length < 2) {
    return null;
  }

  const routeGeoJSON: Feature<LineString> = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: coordinates,
    },
  };

  return (
    <GeoJSONSource
      id="route-source"
      data={routeGeoJSON}
    >
      <Layer
        id="route-line"
        type="line"
        layout={{
          "line-cap": "round",
          "line-join": "round",
        }}
        paint={{
          "line-color": "#2563EB",
          "line-width": 6,
          "line-opacity": 0.9,
        }}
      />
    </GeoJSONSource>
  );
}