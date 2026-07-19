import {
  HeaderCard,
  NearbyCard,
  QuickActionCard,
  SMSCard,
  SosButton,
} from "@/components";
import ConnectedCard from "@/components/ConnectedCard";
import { getCurrentCoordinates, getCurrentLocation } from "@/services/location";
import { broadcastSOS } from "@/services/nearby";
import { savePendingSOS } from "@/services/offlinesos";
import { startCrashDetector, stopCrashDetector } from "@/services/sensors";
import createSOSAlert, { SOSAlert } from "@/services/sos";
import { uploadPendingSOS } from "@/services/uploadpendingsos";
import useAuthStore from "@/store/authStore";
import { useNearbyStore } from "@/store/nearbyStore";
import NetInfo from "@react-native-community/netinfo";
import React, { useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { user, profile } = useAuthStore();
  const { devices } = useNearbyStore();

  const [location, setLocation] = useState<string | null>(null);
  const [sosLocation, setSosLocation] = useState<SOSAlert | null>(null);
  const [countDown, setCountDown] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [locationLoading, setLocationLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user) {
      return;
    }

    loadLocation();
  }, [user]);

  useEffect(() => {
    startCrashDetector(() => {
      console.log("CRASH DETECTED");

      if (countDown == null) {
        handleSOS();
      }
    });

    return () => {
      stopCrashDetector();
    };
  }, []);

  useEffect(() => {
    const sendSosAsync = async () => {
      if (countDown == null) return;
      if (countDown === 0) {
        await sendSOS();
        setCountDown(null);
        return;
      }

      const timer = setTimeout(() => {
        setCountDown((prev) => (prev ? prev - 1 : null));
      }, 1000);
      return () => clearTimeout(timer);
    };
    sendSosAsync();
  }, [countDown]);

  useEffect(() => {
    const unSubscribe = NetInfo.addEventListener(async (state) => {
      if (state.isConnected) {
        await uploadPendingSOS();
      }
    });

    return unSubscribe;
  }, []);

  const handleSOS = async () => {
    if (countDown !== null) return;
    console.log("handleSOS called");

    setCountDown(5);
    try {
      const location = await getCurrentCoordinates();
      setSosLocation({
        sosId: `${user?.uid}-${Date.now()}`,
        userId: user?.uid || "",
        address: "Unknown",
        latitude: location?.latitude || 0,
        longitude: location?.longitude || 0,
        locationName: "Unknown",
        name: user?.displayName || "",
        emergencyContacts: profile?.emergencyContact || [],
        status: "ACTIVE",
      });
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  const cancelSOS = () => {
    setCountDown(null);
    setSosLocation(null);
  };

  const sendSOS = async () => {
    if (!sosLocation) return;
    const state = await NetInfo.fetch();

    const message = `
🚨 EMERGENCY SOS

Name: ${sosLocation.name}

📍 Address:
${sosLocation.address}

🗺️ Live Location:
https://maps.google.com/?q=${sosLocation.latitude},${sosLocation.longitude}

⏰ Time:
${new Date().toLocaleString()}

This alert was sent from Safara.
Please contact or assist immediately.
`;

    try {
      if (!state.isConnected) {
        const payload = {
          sosId: sosLocation.sosId,
          type: "SOS",
          userId: sosLocation.userId,
          latitude: sosLocation.latitude,
          longitude: sosLocation.longitude,
          address: "Unknown",
          locationName: "Unknown",
          name: sosLocation.name,
          emergencyContacts: sosLocation.emergencyContacts,
          status: "ACTIVE" as const,
        };
        await savePendingSOS(payload);
        await broadcastSOS(payload);

        console.log("BroadCasting Completed");

        const phoneNumber = profile?.emergencyContact.map((c) => c.phone) || [];
        console.log("Phone numbers:", phoneNumber);

        // await sendEmergencySMS(phoneNumber, message);

        console.log("SOS saved offline + broadcasted");
        return;
      }

      await createSOSAlert({
        sosId: sosLocation.sosId,
        userId: sosLocation.userId,
        latitude: sosLocation.latitude,
        longitude: sosLocation.longitude,
        address: "Unknown",
        locationName: "Unknown",
        name: sosLocation.name,
        emergencyContacts: sosLocation.emergencyContacts,
        status: "ACTIVE",
      });

      // await sendEmergencySMS(
      //   profile?.emergencyContact.map((c) => c.phone) || [],
      //   message,
      // );

      console.log("Connected:", state.isConnected);
      console.log("SOS Location:", sosLocation);
      return;
    } catch (err) {
      console.error("Error saving SOS:", err);
    } finally {
      // TODO: Send SMS here
    }
  };

  const loadLocation = async () => {
    try {
      setLocationLoading(true);

      const loc = await getCurrentLocation();
      setLocation(loc?.address || "Not Found");
    } catch (err) {
      console.error("Error loading location:", err);
      setLocation("Not Found");
    } finally {
      setLocationLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLocation();
    setRefreshing(false);
  };

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <HeaderCard
          user={user}
          location={location || "Not Found"}
          loading={locationLoading}
          onRefresh={loadLocation}
        />
        <SosButton
          handleSOS={handleSOS}
          cancelSOS={cancelSOS}
          countDown={countDown}
        />
        <NearbyCard />
        <SMSCard />
        <QuickActionCard />
        <ConnectedCard devices={devices} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  scrollContent: {
    paddingBottom: 20,
  },
});

{
  /* <TouchableOpacity
        style={{
          padding: 10,
          backgroundColor: "#f0f0f0",
          borderRadius: 5,
          marginTop: 10,
        }}
        onPress={() => router.push("/screens/devices")}
      >
        <Text>Bluetooth</Text>
      </TouchableOpacity> */
}
