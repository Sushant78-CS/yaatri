import * as Location from "expo-location";
import { useEffect, useState } from "react";

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export default function useLocationTracking() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const startTracking = async () => {
      try {
        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setError("Location permission denied");
          setLoading(false);
          return;
        }

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 10,
            timeInterval: 5000,
          },
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });

            setLoading(false);
          },
        );
      } catch (err) {
        console.error("Location tracking error:", err);

        setError("Unable to get current location");
        setLoading(false);
      }
    };

    startTracking();

    return () => {
      subscription?.remove();
    };
  }, []);

  return {
    location,
    loading,
    error,
  };
}