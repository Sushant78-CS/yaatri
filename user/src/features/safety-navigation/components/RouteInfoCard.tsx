import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import type { RouteSafetyAnalysis } from "../utils/routeSafety";

interface Props {
  distanceMeters: number;
  durationSeconds: number;
  safetyAnalysis: RouteSafetyAnalysis;
  onStartNavigation?: () => void;
}

export default function RouteInfoCard({
  distanceMeters,
  durationSeconds,
  safetyAnalysis,
  onStartNavigation,
}: Props) {
  const distanceKm =
    (distanceMeters / 1000).toFixed(1);

  const formatDuration = (
  durationSeconds: number,
): string => {
  const totalMinutes = Math.ceil(
    durationSeconds / 60,
  );

  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }

  const hours = Math.floor(
    totalMinutes / 60,
  );

  const minutes = totalMinutes % 60;

  if (minutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${minutes} min`;
};

const durationText =
  formatDuration(durationSeconds);

  const safetyScore =
    Math.round(
      safetyAnalysis.safetyScore,
    );

  const exposureMeters =
    Math.round(
      safetyAnalysis.totalExposureMeters,
    );

  const getRiskBackground = () => {
    switch (safetyAnalysis.riskLevel) {
      case "HIGH":
        return "#FEE2E2";

      case "MEDIUM":
        return "#FEF3C7";

      case "LOW":
      default:
        return "#ECFDF5";
    }
  };

  const getRiskTextColor = () => {
    switch (safetyAnalysis.riskLevel) {
      case "HIGH":
        return "#B91C1C";

      case "MEDIUM":
        return "#B45309";

      case "LOW":
      default:
        return "#047857";
    }
  };

  const getRiskMessage = () => {
    if (
      safetyAnalysis.totalExposureMeters === 0
    ) {
      return "No mapped safety-zone exposure";
    }

    if (
      safetyAnalysis.riskLevel === "HIGH"
    ) {
      return "Higher mapped safety-zone exposure";
    }

    if (
      safetyAnalysis.riskLevel === "MEDIUM"
    ) {
      return "Some mapped safety-zone exposure";
    }

    return "Low mapped safety-zone exposure";
  };

  return (
    <View style={styles.card}>

      {/* -----------------------------------------
          SAFETY SUMMARY
      ----------------------------------------- */}

      <View
        style={[
          styles.safetyBadge,
          {
            backgroundColor:
              getRiskBackground(),
          },
        ]}
      >
        <View style={styles.safetyHeader}>
          <Text style={styles.safetyTitle}>
            🛡️ Safety-aware route
          </Text>

          <Text
            style={[
              styles.riskLevel,
              {
                color: getRiskTextColor(),
              },
            ]}
          >
            {safetyAnalysis.riskLevel}
          </Text>
        </View>

        <Text style={styles.safetySubtext}>
          {getRiskMessage()}
        </Text>

        <View style={styles.safetyStats}>
          <View style={styles.safetyStat}>
            <Text style={styles.safetyStatValue}>
              {safetyScore}
            </Text>

            <Text style={styles.safetyStatLabel}>
              Safety score
            </Text>
          </View>

          <View style={styles.safetyDivider} />

          <View style={styles.safetyStat}>
            <Text style={styles.safetyStatValue}>
              {exposureMeters} m
            </Text>

            <Text style={styles.safetyStatLabel}>
              Zone exposure
            </Text>
          </View>
        </View>
      </View>

      {/* -----------------------------------------
          ROUTE INFORMATION
      ----------------------------------------- */}

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
            {durationText}
          </Text>

          <Text style={styles.label}>
  Driving time
</Text>
        </View>

      </View>

      {/* -----------------------------------------
          ZONE DETAILS
      ----------------------------------------- */}

      {safetyAnalysis.conflicts.length > 0 && (
        <View style={styles.zoneSection}>

          <Text style={styles.zoneTitle}>
            Mapped zones on route
          </Text>

          {safetyAnalysis.conflicts
            .slice(0, 3)
            .map((conflict, index) => (
              <View
                key={`${conflict.name}-${index}`}
                style={styles.zoneRow}
              >
                <Text style={styles.zoneName}>
                  {conflict.name}
                </Text>

                <Text style={styles.zoneExposure}>
                  {Math.round(
                    conflict.exposureMeters,
                  )}{" "}
                  m
                </Text>
              </View>
            ))}
        </View>
      )}

      {/* -----------------------------------------
          START NAVIGATION
      ----------------------------------------- */}

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

  /* -----------------------------------------
     SAFETY
  ----------------------------------------- */

  safetyBadge: {
    marginBottom: 14,
    padding: 12,
    borderRadius: 12,
  },

  safetyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  safetyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },

  riskLevel: {
    fontSize: 12,
    fontWeight: "800",
  },

  safetySubtext: {
    marginTop: 4,
    fontSize: 12,
    color: "#4B5563",
  },

  safetyStats: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  safetyStat: {
    flex: 1,
    alignItems: "center",
  },

  safetyStatValue: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
  },

  safetyStatLabel: {
    marginTop: 2,
    fontSize: 11,
    color: "#6B7280",
  },

  safetyDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#D1D5DB",
  },

  /* -----------------------------------------
     ROUTE
  ----------------------------------------- */

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

  /* -----------------------------------------
     ZONES
  ----------------------------------------- */

  zoneSection: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  zoneTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 7,
  },

  zoneRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },

  zoneName: {
    flex: 1,
    fontSize: 12,
    color: "#4B5563",
    marginRight: 10,
  },

  zoneExposure: {
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
  },

  /* -----------------------------------------
     BUTTON
  ----------------------------------------- */

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