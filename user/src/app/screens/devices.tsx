import { connectToDevice, scanBluetoothDevices } from "@/services/ble";
import requestBluetoothPermissions from "@/services/bluepermission";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Device } from "react-native-ble-plx";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DevicesScreen() {
  const router = useRouter();
  const [devices, setDevices] = useState<any[]>([]);
  const [scanning, setScanning] = useState<boolean>(false);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

  const startScan = async () => {
    const granted = await requestBluetoothPermissions();

    if (!granted) return;
    setScanning(true);
    setDevices([]);

    const found = new Map();

    scanBluetoothDevices(
      (devices) => {
        if (!found.has(devices.id)) {
          found.set(devices.id, devices);

          setDevices(Array.from(found.values()));
        }
      },
      (error) => {
        console.error("Scan error:", error);
      },
      () => {
        setScanning(false);
      },
    );
  };

  const connectDevice = async (device: Device) => {
    const connected = await connectToDevice(device);
    if (!connected) return;
    const isConnected = await connected?.isConnected();
    if (isConnected) {
      setConnectedDevice(connected);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.title}>Nearby Devices</Text>

        <View style={{ width: 44 }} />
      </View>

      <TouchableOpacity style={styles.scanButton} onPress={startScan}>
        <Text style={styles.scanText}>
          {scanning ? "Scanning..." : "Start Scan"}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.deviceCard}>
            <Text style={styles.deviceName}>
              {item.name || item.localName || "Unknown Device"}
            </Text>
            <TouchableOpacity
              style={styles.connectButton}
              onPress={() => connectDevice(item)}
            >
              <Text style={styles.connectText}>
                {connectedDevice?.id === item.id
                  ? "🟢 Connected"
                  : "⚪ Not Connected"}
              </Text>
            </TouchableOpacity>

            <Text style={styles.deviceId}>{item.id}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  topSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  titleContainer: {
    marginBottom: 20,
    alignItems: "center",
  },

  scanButton: {
    backgroundColor: "#E53935",
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
  },

  scanText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },

  deviceCard: {
    backgroundColor: "#F8F9FA",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },

  deviceName: {
    fontSize: 16,
    fontWeight: "600",
  },

  deviceId: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  connectButton: {
    backgroundColor: "#E53935",
    width: 120,
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  connectText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});
