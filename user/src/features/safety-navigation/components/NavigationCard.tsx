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
  onStopNavigation: () => void;
}

export default function NavigationCard({
  distanceMeters,
  durationSeconds,
  onStopNavigation,
}: Props) {
  const distanceKm = (distanceMeters / 1000).toFixed(1);

  const durationMinutes = Math.ceil(
    durationSeconds / 60,
  );

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.navigationTitle}>
            Navigation
          </Text>

          <Text style={styles.subtitle}>
            Follow the blue route
          </Text>
        </View>

        <View style={styles.navigationIndicator}>
          <View style={styles.dot} />
          <Text style={styles.activeText}>
            ACTIVE
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={styles.value}>
            {distanceKm} km
          </Text>

          <Text style={styles.label}>
            Remaining
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoItem}>
          <Text style={styles.value}>
            {durationMinutes} min
          </Text>

          <Text style={styles.label}>
            Estimated
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.stopButton}
        onPress={onStopNavigation}
        activeOpacity={0.8}
      >
        <Text style={styles.stopText}>
          Stop Navigation
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

    elevation: 7,

    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowRadius: 9,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  navigationTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },

  subtitle: {
    marginTop: 3,
    fontSize: 12,
    color: "#6B7280",
  },

  navigationIndicator: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#DCFCE7",

    paddingHorizontal: 9,
    paddingVertical: 5,

    borderRadius: 20,
  },

  dot: {
    width: 7,
    height: 7,

    borderRadius: 4,

    backgroundColor: "#16A34A",

    marginRight: 5,
  },

  activeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#15803D",
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
    fontSize: 21,
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
    height: 38,
    backgroundColor: "#E5E7EB",
  },

  stopButton: {
    marginTop: 16,

    backgroundColor: "#FEE2E2",

    paddingVertical: 12,

    borderRadius: 12,

    alignItems: "center",
  },

  stopText: {
    color: "#DC2626",
    fontSize: 14,
    fontWeight: "700",
  },
});