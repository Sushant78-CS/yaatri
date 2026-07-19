import { FONT_SIZE, ICON_SIZE, RADIUS, SPACING } from "@/constants/responsive";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const NearbyCard = () => {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.nearbyButton}
      onPress={() => router.push("/screens/nearby")}
    >
      <View style={styles.nearbyIconContainer}>
        <Ionicons name="radio-outline" size={ICON_SIZE.md} color="#E53935" />
      </View>

      <View style={styles.nearbyContent}>
        <Text style={styles.nearbyTitle}>Nearby Network</Text>
        <Text style={styles.nearbySubtitle}>Offline emergency network</Text>
      </View>

      <Ionicons name="chevron-forward" size={ICON_SIZE.md} color="#9CA3AF" />
    </TouchableOpacity>
  );
};

export default NearbyCard;

const styles = StyleSheet.create({
  nearbyButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginTop: SPACING.md,

    flexDirection: "row",
    alignItems: "center",

    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  nearbyIconContainer: {
    width: ICON_SIZE.xl + SPACING.xs,
    height: ICON_SIZE.xl + SPACING.xs,
    borderRadius: RADIUS.full,
    backgroundColor: "#FEE2E2",

    justifyContent: "center",
    alignItems: "center",
  },

  nearbyContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },

  nearbyTitle: {
    fontSize: FONT_SIZE.subtitle,
    fontWeight: "700",
    color: "#111827",
  },

  nearbySubtitle: {
    fontSize: FONT_SIZE.small,
    color: "#6B7280",
    marginTop: SPACING.xs,
    lineHeight: FONT_SIZE.small * 1.4,
  },
});
