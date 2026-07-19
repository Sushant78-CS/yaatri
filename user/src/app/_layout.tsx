import useAuth from "@/hooks/useAuth";
import {
  initNearbyService,
  startAdvertise,
  startDiscovery,
  stopAdvertise,
  stopDiscovery,
} from "@/services/nearby";
import { requestNotificationPermissions } from "@/services/notification";
import useAuthStore from "@/store/authStore";
import * as Notifications from "expo-notifications";
import { router, Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Linking, StatusBar } from "react-native";
import SplashPreview from "./screens/splashscreen";

const RootLayout = () => {
  useAuth();
  return (
    <>
      <InitialRootLayout />
      <StatusBar barStyle="dark-content" />
    </>
  );
};

export default RootLayout;

let nearbyStarted = false;
function InitialRootLayout() {
  const router = useRouter();
  const { user, loading } = useAuthStore();

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const { latitude, longitude, name } = response.notification.request
          .content.data as {
          latitude: number;
          longitude: number;
          name: string;
        };

        router.push({
          pathname: "/screens/sosdetails",
          params: {
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            name: name,
          },
        });
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  useEffect(() => {
    async function init() {
      if (nearbyStarted) return;
      nearbyStarted = true;
      await stopAdvertise();
      await stopDiscovery();
      await initNearbyService();
      await startAdvertise();
      await startDiscovery();
      console.log("Nearby service initialized");
    }
    init();
  }, []);

  if (loading) {
    return <SplashPreview />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="screens" />
      </Stack.Protected>

      <Stack.Protected guard={!user}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}
