import AsyncStorage from "@react-native-async-storage/async-storage";
import { SOSAlert } from "./sos";

const KEY = "pending_sos";

export const savePendingSOS = async (alert: SOSAlert) => {
  const existing = await AsyncStorage.getItem(KEY);

  const alerts = existing ? JSON.parse(existing) : [];

  alerts.push(alert);

  await AsyncStorage.setItem(KEY, JSON.stringify(alerts));
};

export const getPendingSOS = async () => {
  const existing = await AsyncStorage.getItem(KEY);
  return existing ? JSON.parse(existing) : [];
};

export const clearPendingSOS = async () => {
  await AsyncStorage.removeItem(KEY);
};
