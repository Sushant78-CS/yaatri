import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SOSDetails() {
  const router = useRouter();

  const { name, latitude, longitude, address, bloodGroup, age } =
    useLocalSearchParams<{
      name: string;
      latitude: string;
      longitude: string;
      address: string;
      bloodGroup?: string;
      age?: string;
    }>();

  const openMaps = () => {
    Linking.openURL(`https://maps.google.com/?q=${latitude},${longitude}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color="#111827" />
      </TouchableOpacity>

      <View style={styles.iconContainer}>
        <Ionicons name="warning" size={42} color="#FFFFFF" />
      </View>

      <Text style={styles.title}>Emergency SOS</Text>

      <Text style={styles.name}>{name}</Text>

      <View style={styles.status}>
        <Text style={styles.statusText}>ACTIVE</Text>
      </View>

      <TouchableOpacity style={styles.mapButton} onPress={openMaps}>
        <Ionicons name="navigate" size={20} color="#FFF" />

        <Text style={styles.mapText}>Open in Google Maps</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.dismissButton}
        onPress={() => router.back()}
      >
        <Text style={styles.dismissText}>Dismiss</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 24,
    paddingTop: 20,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  iconContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#E53935",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 60,

    shadowColor: "#E53935",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 10,
  },

  title: {
    marginTop: 28,
    fontSize: 30,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },

  name: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
  },

  status: {
    alignSelf: "center",
    marginTop: 16,
    backgroundColor: "#FEE2E2",
    borderRadius: 50,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },

  statusText: {
    color: "#DC2626",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  mapButton: {
    marginTop: "auto",
    backgroundColor: "#E53935",
    height: 58,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",

    shadowColor: "#E53935",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },

  mapText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 10,
  },

  dismissButton: {
    marginTop: 16,
    marginBottom: 28,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  dismissText: {
    color: "#6B7280",
    fontSize: 15,
    fontWeight: "600",
  },
});
