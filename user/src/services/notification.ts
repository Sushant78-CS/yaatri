import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const sendSOSNotification = async (
  name: string,
  latitude: number,
  longitude: number,
) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🚨 SOS Alert",
      body: `${name} needs immediate assistance.`,
      sound: "default",
      priority: Notifications.AndroidNotificationPriority.MAX,
      data: {
        latitude,
        longitude,
        name,
      },
    },
    trigger: null,
  });
};
export const requestNotificationPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();

  if (status !== "granted") {
    throw new Error("Notification permission not granted");
  }
  return status;
};
