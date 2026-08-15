import React from "react";
import {
  GeoJSONSource,
  Layer,
} from "@maplibre/maplibre-react-native";

interface Props {
  latitude: number;
  longitude: number;
}

export default function DestinationMarker({
  latitude,
  longitude,
}: Props) {
  const destination = {
    type: "FeatureCollection" as const,
    features: [
      {
        type: "Feature" as const,
        geometry: {
          type: "Point" as const,
          coordinates: [longitude, latitude],
        },
        properties: {},
      },
    ],
  };

  return (
    <GeoJSONSource
      id="destination-source"
      data={destination}
    >
      <Layer
        id="destination-layer"
        type="circle"
        paint={{
          "circle-radius": 10,
          "circle-color": "#DC2626",
          "circle-stroke-width": 3,
          "circle-stroke-color": "#FFFFFF",
        }}
      />
    </GeoJSONSource>
  );
}