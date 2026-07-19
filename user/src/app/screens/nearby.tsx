import {
  BUTTON,
  CARD,
  FONT_SIZE,
  ICON_SIZE,
  RADIUS,
  SPACING,
} from "@/constants/responsive";
import { getCurrentLocation } from "@/services/location";
import Nearby, {
  broadcastSOS,
  startAdvertise,
  startDiscovery,
  stopAdvertise,
  stopDiscovery,
} from "@/services/nearby";
import { SOSAlert } from "@/services/sos";
import useAuthStore from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const connectedPeers = new Set<string>();

function NearbyScreen() {
  const router = useRouter();
  const { user, profile } = useAuthStore();

  const [devices, setDevices] = useState<any[]>([]);
  const [discovering, setDiscovering] = useState<boolean>(false);
  const [advertising, setAdvertising] = useState<boolean>(false);
  const [sosLocation, setSosLocation] = useState<SOSAlert | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      Nearby.stopAdvertise();
      Nearby.stopDiscovery();
    };
  }, []);

  useEffect(() => {
    const unSubscribe = Nearby.onPeerFound((peer) => {
      console.log("Peer found:", peer);
      if (connectedPeers.has(peer.peerId)) return;

      Nearby.requestConnection(peer.peerId)
        .then(() => {
          console.log("Connection request successful", peer.peerId);
        })
        .catch((error) => {
          console.error("Connection request error:", error);
        });
    });

    const unsubdisConnected = Nearby.onDisconnected((peer) => {
      console.log("Disconnected from peer:", peer.peerId);
      connectedPeers.delete(peer.peerId);
      setDevices((prev) => prev.filter((d) => d.peerId !== peer.peerId));
    });

    const unsubConnected = Nearby.onConnected((peer) => {
      console.log("Connected to peer:", peer.peerId);
      connectedPeers.add(peer.peerId);
      setDevices((prev) => {
        const exists = prev.find((d) => d.peerId === peer.peerId);
        if (exists) return prev;
        return [...prev, peer];
      });
    });

    const unsubLost = Nearby.onPeerLost((peer) => {
      console.log("Peer lost:", peer.peerId);
    });
    return () => {
      unSubscribe();
      unsubLost();
      unsubdisConnected();
      unsubConnected();
    };
  }, []);

  useEffect(() => {
    const handleSOS = async () => {
      try {
        const location = await getCurrentLocation();
        setSosLocation({
          sosId: `${user?.uid}-${Date.now()}`,
          userId: user?.uid || "",
          address: location?.address || "Unknown",
          latitude: location?.latitude || 0,
          longitude: location?.longitude || 0,
          locationName: location?.address || "Unknown",
          name: user?.displayName || "",
          emergencyContacts: profile?.emergencyContact || [],
          status: "ACTIVE",
        });

        const net = await NetInfo.fetch();

        console.log("Wifi Enabled:", net.isWifiEnabled);
        console.log("Connected:", net.isConnected);
        console.log("Type:", net.type);
      } catch (error) {
        console.error("Error getting location:", error);
      }
    };
    handleSOS();
  }, []);

  const handleDiscovery = async () => {
    console.log("handleDiscovery", discovering);

    try {
      if (!discovering) {
        await startDiscovery();
        setDiscovering(true);
      } else {
        await stopDiscovery();
        setDiscovering(false);
      }
    } catch (error) {
      console.error("Discovery error:", error);
    }
  };

  const handleAdvertise = async () => {
    console.log("advertising", advertising);
    try {
      if (!advertising) {
        await startAdvertise();
        console.log("Advertising started");

        setAdvertising(true);
      }
    } catch (error) {
      console.error("Advertise error:", error);
      console.log("Advertising stopped");
    }
  };

  const handleStopAdvertise = async () => {
    try {
      console.log("handlestop advertising", advertising);
      if (advertising) {
        await stopAdvertise();
        setAdvertising(false);
      }
    } catch (error) {
      console.error("Stop advertise error:", error);
      console.log("Advertising stopped");
    }
  };

  const handleStopDiscovery = async () => {
    try {
      if (discovering) {
        await stopDiscovery();
        setDiscovering(false);
      }
    } catch (error) {
      console.error("Stop discovery error:", error);
      console.log("Discovery stopped");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.screenTitle}>Nearby Network</Text>
      </View>

      <View style={styles.statusCard}>
        <View style={styles.statusRow}>
          <View style={styles.greenDot} />

          <View style={{ flex: 1 }}>
            <Text style={styles.statusTitle}>Nearby Service Active</Text>

            <Text style={styles.statusDescription}>
              Relay SOS alerts even without internet.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{devices.length}</Text>
          <Text style={styles.statLabel}>Devices</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{discovering ? "ON" : "OFF"}</Text>
          <Text style={styles.statLabel}>Discovery</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{advertising ? "ON" : "OFF"}</Text>
          <Text style={styles.statLabel}>Advertise</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.actionButton,
          discovering && advertising && styles.stopButton,
        ]}
        onPress={() => {
          if (discovering) {
            handleStopDiscovery();
            handleStopAdvertise();
          } else {
            handleDiscovery();
            handleAdvertise();
          }
        }}
      >
        <Ionicons
          name={discovering && advertising ? "close-circle" : "radio-outline"}
          size={20}
          color="#FFF"
        />

        <Text style={styles.actionButtonText}>
          {discovering && advertising
            ? "Stop Nearby Service"
            : "Start Nearby Service"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Nearby Devices</Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {devices.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="radio-outline" size={60} color="#D1D5DB" />

            <Text style={styles.emptyTitle}>No Devices Found</Text>

            <Text style={styles.emptySubtitle}>
              Nearby Safara users will appear here automatically.
            </Text>
          </View>
        ) : (
          devices.map((device, index) => (
            <View key={index} style={styles.deviceCard}>
              <View style={styles.deviceRow}>
                <View style={styles.deviceIcon}>
                  <Ionicons name="phone-portrait" size={20} color="#E53935" />
                </View>
                <View style={styles.deviceInfo}>
                  <Text style={styles.deviceName}>
                    {device.name || device.endpointName || "Unknown Device"}
                  </Text>

                  <View style={styles.connectedRow}>
                    <View style={styles.connectedDot} />
                    <Text style={styles.connectedText}>Connected</Text>
                  </View>
                </View>

                <Ionicons name="checkmark-circle" size={22} color="#22C55E" />
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.actionButton,
          devices.length === 0 && styles.disabledButton,
        ]}
        disabled={devices.length === 0}
        onPress={() => {
          if (!sosLocation) return;

          broadcastSOS({
            type: "SOS",
            userId: sosLocation.userId,
            latitude: sosLocation.latitude,
            longitude: sosLocation.longitude,
            address: sosLocation.address,
            locationName: sosLocation.locationName,
            name: sosLocation.name,
            emergencyContacts: sosLocation.emergencyContacts,
            hopCount: 0,
            status: "ACTIVE",
          });
        }}
      >
        <Ionicons
          name={devices.length > 0 ? "send" : undefined}
          size={20}
          color="#FFF"
        />

        <Text style={styles.actionButtonText}>
          {devices.length > 0
            ? `Broadcast SOS (${devices.length})`
            : "Waiting for Devices"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default NearbyScreen;

const styles = StyleSheet.create({
  disabledButton: {
    backgroundColor: "#9CA3AF",
  },

  connectedRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  connectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22C55E",
    marginRight: 6,
  },

  connectedText: {
    fontSize: 13,
    color: "#22C55E",
    fontWeight: "600",
  },

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: SPACING.md,
  },

  actionButton: {
    backgroundColor: "#E53935",

    height: BUTTON.height,
    borderRadius: BUTTON.borderRadius,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    marginBottom: SPACING.lg,
  },

  actionButtonText: {
    color: "#FFFFFF",
    fontSize: FONT_SIZE.body,
    fontWeight: "700",
    marginLeft: SPACING.sm,
  },

  stopButton: {
    backgroundColor: "#6B7280",
  },

  deviceCard: {
    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#E5E7EB",

    borderRadius: CARD.borderRadius,

    padding: CARD.padding,

    marginBottom: SPACING.sm,
  },

  deviceRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  deviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,

    backgroundColor: "#FEE2E2",

    justifyContent: "center",
    alignItems: "center",
  },

  deviceInfo: {
    flex: 1,
    marginLeft: SPACING.sm,
  },

  deviceName: {
    fontSize: FONT_SIZE.body,
    fontWeight: "700",
    color: "#111827",
  },

  deviceStatus: {
    marginTop: 2,
    fontSize: FONT_SIZE.small,
    color: "#10B981",
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: SPACING.xl * 2,
  },

  emptyTitle: {
    marginTop: SPACING.sm,
    fontSize: FONT_SIZE.subtitle,
    fontWeight: "700",
    color: "#111827",
  },

  emptySubtitle: {
    marginTop: SPACING.xs,
    fontSize: FONT_SIZE.body,
    color: "#6B7280",
    textAlign: "center",
    paddingHorizontal: SPACING.lg,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: SPACING.lg,
    height: BUTTON.height,
  },

  backButton: {
    position: "absolute",
    left: 0,

    width: ICON_SIZE.xl,
    height: ICON_SIZE.xl,

    borderRadius: RADIUS.full,

    backgroundColor: "#F3F4F6",

    justifyContent: "center",
    alignItems: "center",
  },

  screenTitle: {
    fontSize: FONT_SIZE.title,
    fontWeight: "700",
    color: "#111827",
  },

  statusCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: CARD.borderRadius,
    padding: CARD.padding,

    borderWidth: 1,
    borderColor: "#E5E7EB",

    marginBottom: SPACING.md,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  greenDot: {
    width: SPACING.sm,
    height: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: "#10B981",
    marginRight: SPACING.sm,
  },

  statusTitle: {
    fontSize: FONT_SIZE.body,
    fontWeight: "700",
    color: "#111827",
  },

  statusDescription: {
    marginTop: SPACING.xs,
    fontSize: FONT_SIZE.small,
    color: "#6B7280",
    lineHeight: 18,
  },

  statsContainer: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },

  statCard: {
    flex: 1,

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#E5E7EB",

    borderRadius: CARD.borderRadius,

    paddingVertical: SPACING.md,

    alignItems: "center",
  },

  statNumber: {
    fontSize: FONT_SIZE.subtitle,
    fontWeight: "700",
    color: "#E53935",
  },

  statLabel: {
    marginTop: SPACING.xs,
    fontSize: FONT_SIZE.small,
    color: "#6B7280",
  },

  primaryButton: {
    height: BUTTON.height,

    backgroundColor: "#E53935",

    borderRadius: BUTTON.borderRadius,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    marginBottom: SPACING.sm,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: FONT_SIZE.body,
    fontWeight: "700",
    marginLeft: SPACING.sm,
  },

  sectionTitle: {
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,

    fontSize: FONT_SIZE.subtitle,
    fontWeight: "700",
    color: "#111827",
  },
});
