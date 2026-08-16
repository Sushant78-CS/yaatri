import { safetyZones } from "@/features/safety-navigation/data/safetyZones";
import useLocationTracking from "@/features/safety-navigation/hooks/useLocationTracking";
import { checkSafetyZone } from "@/features/safety-navigation/utils/safetyZoneEngine";
import { getCitySafetyData } from "@/features/safety-navigation/data/cityData";
import { detectCity } from "@/features/safety-navigation/utils/cityDetector";
import emergencyServices from "@/features/safety-navigation/data/maharashtra/mumbai/emergencyServices.json";
import StatusCard from "./StatusCard";
import EmergencyCard from "./EmergencyCard";
import MapLegend from "./MapLegend";
import useRoute from "@/features/safety-navigation/hooks/useRoute";
import useRouteProgress from "@/features/safety-navigation/hooks/useRouteProgress";
import { distanceToRoute } from "../utils/distanceToRoute";
import {
  Camera,
  GeoJSONSource,
  Layer,
  Map,
  UserLocation,
  Images,
} from "@maplibre/maplibre-react-native";

import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { findNearestAmenity } from "../utils/nearestEmergency";
import RouteLine from "./RouteLine";
import DestinationMarker from "./DestinationMarker";
import RouteInfoCard from "./RouteInfoCard";
import NavigationCard from "./NavigationCard";
export default function SafetyMap() {
  const { location, loading, error } = useLocationTracking();
  const [destination, setDestination] = React.useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isNavigating, setIsNavigating] = React.useState(false);
  React.useEffect(() => {
    console.log("NAVIGATION MODE CHANGED:", isNavigating);
  }, [isNavigating]);
  React.useEffect(() => {
    if (!location) return;

    console.log("GPS UPDATE:", location.latitude, location.longitude);
  }, [location]);

  const routeStart = location
    ? {
        latitude: location.latitude,
        longitude: location.longitude,
      }
    : null;

  const {
    route,
    loading: routeLoading,
    error: routeError,
  } = useRoute(routeStart, destination, isNavigating);
  const { remainingDistance, remainingDuration } = useRouteProgress(
    routeStart,
    route,
    isNavigating,
  );
  React.useEffect(() => {
    if (remainingDistance === null) return;

    console.log("🚗 LIVE REMAINING:", Math.round(remainingDistance), "meters");
  }, [remainingDistance]);
  if (route) {
    console.log("ROUTE DISTANCE:", route.distanceMeters, "meters");

    console.log("ROUTE DURATION:", route.durationSeconds, "seconds");

    console.log("ROUTE COORDINATES:", route.coordinates.length);
  }
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.message}>Getting your location...</Text>
      </View>
    );
  }

  // 2. GPS failed OR location doesn't exist
  if (error || !location) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>{error ?? "Location unavailable"}</Text>
      </View>
    );
  }

  // 3. From THIS POINT TypeScript knows location cannot be null
  const safetyResult = checkSafetyZone(
    location.latitude,
    location.longitude,
    safetyZones,
  );
  const detectedCity = detectCity(location.latitude, location.longitude);
  const nearestHospital = findNearestAmenity(
    location.latitude,
    location.longitude,
    emergencyServices.features,
    "hospital",
  );

  const nearestPolice = findNearestAmenity(
    location.latitude,
    location.longitude,
    emergencyServices.features,
    "police",
  );
  const cityData = detectedCity ? getCitySafetyData(detectedCity) : null;

  return (
    <View style={styles.container}>
      <Map
        style={styles.map}
        mapStyle="https://tiles.openfreemap.org/styles/liberty"
        onPress={(event) => {
          const { lngLat } = event.nativeEvent;

          const [longitude, latitude] = lngLat;

          setDestination({
            latitude,
            longitude,
          });

          console.log("DESTINATION:", latitude, longitude);
        }}
      >
        <Camera
          initialViewState={{
            center: [location.longitude, location.latitude],
            zoom: 15,
          }}
          trackUserLocation={isNavigating ? "course" : undefined}
          zoom={16}
        />

        <RouteLine coordinates={route?.coordinates ?? null} />
        {destination && (
          <DestinationMarker
            latitude={destination.latitude}
            longitude={destination.longitude}
          />
        )}
        <Images
          images={{
            hospital: require("../assets/hospital.png"),
            police: require("../assets/police.png"),
          }}
        />
        <GeoJSONSource id="safety-zones" data={safetyZones}>
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
        {cityData && (
          <GeoJSONSource
            id="environmental-areas"
            data={cityData.environmentalAreas}
          >
            <Layer
              id="environmental-areas-fill"
              type="fill"
              paint={{
                "fill-color": "#F59E0B",
                "fill-opacity": 0.25,
                "fill-outline-color": "#D97706",
              }}
            />
          </GeoJSONSource>
        )}
        {cityData && (
          <GeoJSONSource id="military-areas" data={cityData.militaryAreas}>
            <Layer
              id="military-areas-fill"
              type="fill"
              paint={{
                "fill-color": "#DC2626",
                "fill-opacity": 0.3,
                "fill-outline-color": "#991B1B",
              }}
            />
          </GeoJSONSource>
        )}
        {cityData && (
          <GeoJSONSource
            id="emergency-services"
            data={cityData.emergencyServices}
          >
            <Layer
              id="hospital-icons"
              type="symbol"
              minzoom={12}
              filter={["==", ["get", "amenity"], "hospital"]}
              layout={{
                "icon-image": "hospital",
                "icon-size": 0.07,
                "icon-allow-overlap": true,
              }}
            />

            <Layer
              id="police-icons"
              type="symbol"
              minzoom={12}
              filter={["==", ["get", "amenity"], "police"]}
              layout={{
                "icon-image": "police",
                "icon-size": 0.02,
                "icon-allow-overlap": true,
              }}
            />
          </GeoJSONSource>
        )}
        <UserLocation />
      </Map>

      <MapLegend />
      <StatusCard
        status={safetyResult.status}
        zoneName={safetyResult.zoneName}
        distanceMeters={safetyResult.distanceMeters}
      />

      <EmergencyCard
        nearestHospital={nearestHospital}
        nearestPolice={nearestPolice}
      />
      {route && !isNavigating && (
        <RouteInfoCard
          distanceMeters={route.distanceMeters}
          durationSeconds={route.durationSeconds}
          onStartNavigation={() => {
            setIsNavigating(true);
          }}
        />
      )}

      {route &&
        isNavigating &&
        remainingDistance !== null &&
        remainingDuration !== null && (
          <NavigationCard
            remainingDistance={remainingDistance}
            durationSeconds={remainingDuration}
            onStopNavigation={() => {
              setIsNavigating(false);
            }}
          />
        )}
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
