import { safetyZones } from "@/features/safety-navigation/data/safetyZones";
import useLocationTracking from "@/features/safety-navigation/hooks/useLocationTracking";
import { checkSafetyZone } from "@/features/safety-navigation/utils/safetyZoneEngine";
import { fetchMumbaiProtectedAreas } from "@/features/safety-navigation/services/overpass";
import { convertOverpassToGeoJSON } from "@/features/safety-navigation/utils/overpassToGeojson";
import  { useEffect, useState } from "react";
import type {
  FeatureCollection,
  Polygon,
} from "geojson";
import {
  Camera,
  GeoJSONSource,
  Layer,
  Map,
  UserLocation,
} from "@maplibre/maplibre-react-native";

import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";


export default function SafetyMap() {
  const { location, loading, error } = useLocationTracking();
  const [protectedAreas, setProtectedAreas] =
  useState<FeatureCollection<Polygon> | null>(null);
  useEffect(() => {
  const loadProtectedAreas = async () => {
    try {
      const data = await fetchMumbaiProtectedAreas();

      console.log(
        "PROTECTED AREAS FOUND:",
        data.elements.length,
      );

      data.elements.forEach((element) => {
  console.log(
    "AREA:",
    element.tags?.name ?? "Unnamed",
    "TYPE:",
    element.type,
    "ID:",
    element.id,
  );
});

const geoJSON = convertOverpassToGeoJSON(data);

console.log(
  "CONVERTED POLYGONS:",
  geoJSON.features.length,
);

setProtectedAreas(geoJSON);
    } catch (error) {
      console.error(
        "Error loading protected areas:",
        error,
      );
    }
  };

  loadProtectedAreas();
}, []);
   // 1. Still waiting for GPS
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.message}>
          Getting your location...
        </Text>
      </View>
    );
  }

  // 2. GPS failed OR location doesn't exist
  if (error || !location) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>
          {error ?? "Location unavailable"}
        </Text>
      </View>
    );
  }
    
  // 3. From THIS POINT TypeScript knows location cannot be null
  const safetyResult = checkSafetyZone(
    location.latitude,
    location.longitude,
    safetyZones,
  );

  console.log(
    "USER:",
    location.latitude,
    location.longitude,
  );

  return (
    <View style={styles.container}>
     <Map
  style={styles.map}
  mapStyle="https://tiles.openfreemap.org/styles/liberty"
>
        <Camera
          initialViewState={{
            center: [
              location.longitude,
              location.latitude,
            ],
            zoom: 15,
          }}
        />

        <GeoJSONSource
          id="safety-zones"
          data={safetyZones}
        >
          <Layer
            id="safety-zones-fill"
            type="fill"
            paint={{
              "fill-color": "#EF4444",
              "fill-opacity": 0.35,
              "fill-outline-color": "#B91C1C",
            }}
          />
        </GeoJSONSource>
        {protectedAreas && (
  <GeoJSONSource
    id="protected-areas"
    data={protectedAreas}
  >
    <Layer
      id="protected-areas-fill"
      type="fill"
      paint={{
        "fill-color": "#F59E0B",
        "fill-opacity": 0.25,
        "fill-outline-color": "#D97706",
      }}
    />
  </GeoJSONSource>
)}

        <UserLocation />

      </Map>
      <View
  style={[
    styles.statusCard,

    safetyResult.status === "INSIDE"
      ? styles.dangerCard
      : safetyResult.status === "APPROACHING"
        ? styles.warningCard
        : styles.safeCard,
  ]}
>
  <Text style={styles.statusTitle}>
    {safetyResult.status === "INSIDE"
      ? "⚠ Inside Safety Zone"
      : safetyResult.status === "APPROACHING"
        ? "⚠ Approaching Safety Zone"
        : "✓ Safe Area"}
  </Text>

  {safetyResult.zoneName && (
    <Text style={styles.zoneName}>
      {safetyResult.zoneName}
    </Text>
  )}
  {safetyResult.status === "APPROACHING" &&
    safetyResult.distanceMeters !== null && (
      <Text style={styles.distanceText}>
        Approximately {safetyResult.distanceMeters} m away
      </Text>
    )}
</View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    flex: 1,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  message: {
    marginTop: 10,
  },
  statusCard: {
  position: "absolute",
  top: 50,
  left: 20,
  right: 20,
  padding: 14,
  borderRadius: 12,
},

safeCard: {
  backgroundColor: "#DCFCE7",
},

dangerCard: {
  backgroundColor: "#FEE2E2",
},

statusTitle: {
  fontSize: 16,
  fontWeight: "700",
},

zoneName: {
  marginTop: 4,
  fontSize: 13,
},
warningCard: {
  backgroundColor: "#FEF3C7",
},

distanceText: {
  marginTop: 4,
  fontSize: 13,
  fontWeight: "600",
},
});