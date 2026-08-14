import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  nearestHospital: any;
  nearestPolice: any;
}

export default function EmergencyCard({
  nearestHospital,
  nearestPolice,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Nearby Emergency Services
      </Text>

      <View style={styles.item}>
        <Text style={styles.icon}>🏥</Text>

        <View style={styles.info}>
          <Text style={styles.name}>
            {nearestHospital?.properties?.name ??
              "Unknown Hospital"}
          </Text>

          <Text style={styles.distance}>
            {nearestHospital
              ? `${nearestHospital.distance} m away`
              : "Unavailable"}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.item}>
        <Text style={styles.icon}>👮</Text>

        <View style={styles.info}>
          <Text style={styles.name}>
            {nearestPolice?.properties?.name ??
              "Unknown Police Station"}
          </Text>

          <Text style={styles.distance}>
            {nearestPolice
              ? `${nearestPolice.distance} m away`
              : "Unavailable"}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 25,
    left: 20,
    right: 20,

    backgroundColor: "#FFFFFF",

    borderRadius: 16,

    padding: 14,

    shadowColor: "#000",

    shadowOpacity: 0.18,

    shadowRadius: 8,

    elevation: 8,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",

    marginBottom: 10,
  },

  item: {
    flexDirection: "row",

    alignItems: "center",
  },

  icon: {
    fontSize: 24,

    marginRight: 12,
  },

  info: {
    flex: 1,
  },

  name: {
    fontWeight: "700",

    fontSize: 14,
  },

  distance: {
    color: "#6B7280",

    marginTop: 2,
  },

  divider: {
    height: 1,

    backgroundColor: "#E5E7EB",

    marginVertical: 10,
  },
});