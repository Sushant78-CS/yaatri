import { safetyZones } from "@/features/safety-navigation/data/safetyZones";
import useLocationTracking from "@/features/safety-navigation/hooks/useLocationTracking";
import { checkSafetyZone } from "@/features/safety-navigation/utils/safetyZoneEngine";
import { getCitySafetyData } from "@/features/safety-navigation/data/cityData";
import { detectCity } from "@/features/safety-navigation/utils/cityDetector";
import emergencyServices from "@/features/safety-navigation/data/maharashtra/mumbai/emergencyServices.json";
import DestinationSearch from "./DestinationSearch";
import EmergencyCard from "./EmergencyCard";
import MapLegend from "./MapLegend";
import useRoute from "@/features/safety-navigation/hooks/useRoute";
import useRouteProgress from "@/features/safety-navigation/hooks/useRouteProgress";
import { getRemainingRoute } from "../utils/routeProgress";
import useArrivalDetection from "@/features/safety-navigation/hooks/useArrivalDetection";
import useNavigationInstruction from "@/features/safety-navigation/hooks/useNavigationInstruction";
import {
  Camera,
  GeoJSONSource,
  Layer,
  Map,
  UserLocation,
  Images,
} from "@maplibre/maplibre-react-native";

import React, { useRef } from "react";
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
  const cameraRef = useRef<any>(null);
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
  const { currentStep, stepDistance } = useNavigationInstruction(
    routeStart,
    route,
    isNavigating,
  );
  React.useEffect(() => {
    if (!currentStep || stepDistance === null) {
      return;
    }

    console.log(
      "🧭 NAVIGATION:",
      currentStep.instruction,
      Math.round(stepDistance),
      "meters",
    );
  }, [currentStep, stepDistance]);
  const hasArrived = useArrivalDetection(routeStart, destination, isNavigating);
  React.useEffect(() => {
    if (!hasArrived) return;

    console.log("🏁 NAVIGATION COMPLETED");

    setIsNavigating(false);
  }, [hasArrived]);
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
  const visibleRoute =
  isNavigating && route && routeStart
    ? getRemainingRoute(
        routeStart,
        route.coordinates,
      )
    : route?.coordinates ?? null;
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
          ref={cameraRef}
          initialViewState={{
            center: [location.longitude, location.latitude],
            zoom: 15,
          }}
          trackUserLocation={isNavigating ? "course" : undefined}
          zoom={16}
        />

       <RouteLine coordinates={visibleRoute} />
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
      <DestinationSearch
  latitude={location.latitude}
  longitude={location.longitude}
  onSelect={(place) => {
    setDestination({
      latitude: place.latitude,
      longitude: place.longitude,
    });

    cameraRef.current?.flyTo({
  center: [
    place.longitude,
    place.latitude,
  ],
  zoom: 15,
  duration: 1000,
});

    console.log(
      "📍 SEARCH DESTINATION:",
      place.name,
      place.latitude,
      place.longitude,
    );
  }}
/>
      <MapLegend />

      <EmergencyCard
        nearestHospital={nearestHospital}
        nearestPolice={nearestPolice}
      />

      {routeLoading && !isNavigating && (
        <View style={styles.routeLoadingCard}>
          <ActivityIndicator size="small" />

          <View style={styles.routeLoadingTextContainer}>
            <Text style={styles.routeLoadingTitle}>
              🛡️ Analyzing safe route...
            </Text>

            <Text style={styles.routeLoadingSubtitle}>
              Checking mapped safety zones
            </Text>
          </View>
        </View>
      )}

      {/* -----------------------------------------
    ROUTING ERROR
----------------------------------------- */}

      {routeError && !routeLoading && !isNavigating && (
        <View style={styles.routeErrorCard}>
          <Text style={styles.routeErrorTitle}>Unable to calculate route</Text>

          <Text style={styles.routeErrorText}>{routeError}</Text>
        </View>
      )}

      {/* -----------------------------------------
    ROUTE INFORMATION
----------------------------------------- */}

      {route && !routeLoading && !isNavigating && (
        <RouteInfoCard
          distanceMeters={route.distanceMeters}
          durationSeconds={route.durationSeconds}
          safetyAnalysis={route.safetyAnalysis}
          onStartNavigation={() => {
            setIsNavigating(true);
          }}
        />
      )}

      {hasArrived && (
        <View style={styles.arrivalCard}>
          <Text style={styles.arrivalTitle}>🎉 You have arrived</Text>

          <Text style={styles.arrivalText}>You reached your destination.</Text>
        </View>
      )}

      {route &&
        isNavigating &&
        remainingDistance !== null &&
        remainingDuration !== null && (
          <NavigationCard
            remainingDistance={remainingDistance}
            durationSeconds={remainingDuration}
            instruction={currentStep?.instruction}
            maneuverDistance={stepDistance}
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
  arrivalCard: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    padding: 18,
    borderRadius: 16,
    backgroundColor: "#DCFCE7",
    elevation: 5,
  },

  arrivalTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  arrivalText: {
    marginTop: 4,
    fontSize: 14,
  },
  routeLoadingCard: {
    position: "absolute",
    top: 120,
    left: 16,
    right: 16,

    backgroundColor: "#FFFFFF",

    borderRadius: 18,

    padding: 16,

    flexDirection: "row",
    alignItems: "center",

    elevation: 6,

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  routeLoadingTextContainer: {
    marginLeft: 12,
  },

  routeLoadingTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  routeLoadingSubtitle: {
    marginTop: 3,
    fontSize: 12,
    color: "#6B7280",
  },

  routeErrorCard: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 24,

    backgroundColor: "#FEF2F2",

    borderRadius: 16,

    padding: 16,

    elevation: 5,
  },

  routeErrorTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#B91C1C",
  },

  routeErrorText: {
    marginTop: 4,
    fontSize: 12,
    color: "#7F1D1D",
  },
});
