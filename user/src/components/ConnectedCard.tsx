import { FONT_SIZE, RADIUS, SPACING } from "@/constants/responsive";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const ConnectedCard = (devices: { devices: any[] }) => {
  return (
    <View style={styles.nearbyCard}>
      <View style={styles.header}>
        <Ionicons name="radio-outline" size={18} color="#2563EB" />

        <Text style={styles.title}>Emergency Relay Network</Text>
      </View>

      <View style={styles.statusRow}>
        <View
          style={[
            styles.statusDot,
            {
              backgroundColor:
                devices.devices.length > 0 ? "#10B981" : "#EF4444",
            },
          ]}
        />

        <Text style={styles.statusText}>
          {devices.devices.length > 0
            ? `${devices.devices.length} connected`
            : "No devices connected"}
        </Text>
      </View>

      <Text style={styles.subtitle}>
        {devices.devices.length > 0
          ? "Offline SOS available"
          : "Waiting for nearby users"}
      </Text>
    </View>
  );
};

export default ConnectedCard;

const styles = StyleSheet.create({
  nearbyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
  },

  title: {
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZE.body,
    fontWeight: "600",
    color: "#111827",
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.sm,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },

  statusText: {
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZE.body,
    fontWeight: "600",
    color: "#111827",
  },

  subtitle: {
    marginTop: SPACING.xs,
    marginLeft: 16,
    fontSize: FONT_SIZE.small,
    color: "#6B7280",
  },
});
