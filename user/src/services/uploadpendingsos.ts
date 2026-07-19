import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { getPendingSOS } from "./offlinesos";
import createSOSAlert from "./sos";

const KEY = "pending_sos";

export const uploadPendingSOS = async () => {
  const alerts = await getPendingSOS();

  if (alerts.length === 0) return;

  const remaining: any[] = [];

  for (const alert of alerts) {
    try {
      const net = await NetInfo.fetch();
      if (net.isConnected) {
        await createSOSAlert(alert);
      } else {
        remaining.push(alert);
      }
    } catch (error) {
      console.error("Error uploading pending SOS:", error);
      remaining.push(alert);
    }
  }

  await AsyncStorage.setItem(KEY, JSON.stringify(remaining));
};
