import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface StatusCardProps {
  status: "SAFE" | "APPROACHING" | "INSIDE";
  zoneName?: string | null;
  distanceMeters?: number | null;
}

export default function StatusCard({
  status,
  zoneName,
  distanceMeters,
}: StatusCardProps) {
  const cardStyle =
    status === "INSIDE"
      ? styles.dangerCard
      : status === "APPROACHING"
        ? styles.warningCard
        : styles.safeCard;

  return (
    <View style={[styles.card, cardStyle]}>
      <Text style={styles.title}>
        {status === "INSIDE"
          ? "⚠ Inside Safety Zone"
          : status === "APPROACHING"
            ? "⚠ Approaching Safety Zone"
            : "✓ Safe Area"}
      </Text>

      {zoneName && (
        <Text style={styles.zone}>
          {zoneName}
        </Text>
      )}

      {status === "APPROACHING" &&
        distanceMeters != null && (
          <Text style={styles.distance}>
            Approximately {distanceMeters} m away
          </Text>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,

    padding: 14,

    borderRadius: 16,

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,

    elevation: 8,
  },

  safeCard: {
    backgroundColor: "#DCFCE7",
  },

  warningCard: {
    backgroundColor: "#FEF3C7",
  },

  dangerCard: {
    backgroundColor: "#FEE2E2",
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
  },

  zone: {
    marginTop: 4,
    fontSize: 13,
  },

  distance: {
    marginTop: 4,
    fontWeight: "600",
  },
});