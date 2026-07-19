import * as Location from "expo-location";

export const getCurrentLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    console.log("Location permission denied");
    return;
  }
  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });

  let address = "Address unavailable";

  try {
    const res = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    if (res.length > 0) {
      const place = res[0];
      const formatted = `${place.name || ""}, ${place.street || ""}, ${place.city || ""}`;
      console.log(formatted);
      address = formatted;
    }
  } catch (error) {
    console.error("Error getting location:", error);
  }
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    address,
  };
};

export const getCurrentCoordinates = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    throw new Error("Location permission denied");
  }

  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Highest,
  });

  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
};

export { Location };
