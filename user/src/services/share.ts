import { Share } from "react-native";
import { getCurrentCoordinates } from "./location";

export const handleShareLocation = async () => {
  const coords = await getCurrentCoordinates();
  if (coords) {
    await Share.share({
      message: `My location: https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`,
    });
  }
};
