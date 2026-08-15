import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  distanceMeters: number;
  durationSeconds: number;
  onStartNavigation?: () => void;
}

export default function RouteInfoCard({
  distanceMeters,
  durationSeconds,
  onStartNavigation,
}: Props) {
  const distanceKm = (distanceMeters / 1000).toFixed(1);

  const durationMinutes = Math.ceil(
    durationSeconds / 60,
  );

  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        📍 Route to destination
      </Text>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={styles.value}>
            {distanceKm} km
          </Text>

          <Text style={styles.label}>
            Distance
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoItem}>
          <Text style={styles.value}>
            {durationMinutes} min
          </Text>

          <Text style={styles.label}>
            Estimated time
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.navigationButton}
        onPress={onStartNavigation}
        activeOpacity={0.8}
      >
        <Text style={styles.navigationText}>
          Start Navigation →
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 24,

    backgroundColor: "#FFFFFF",

    borderRadius: 18,

    padding: 16,

    elevation: 6,

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 14,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  infoItem: {
    flex: 1,
    alignItems: "center",
  },

  value: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },

  label: {
    marginTop: 3,
    fontSize: 12,
    color: "#6B7280",
  },

  divider: {
    width: 1,
    height: 35,
    backgroundColor: "#E5E7EB",
  },

  navigationButton: {
    marginTop: 16,

    backgroundColor: "#2563EB",

    paddingVertical: 13,

    borderRadius: 12,

    alignItems: "center",
  },

  navigationText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});