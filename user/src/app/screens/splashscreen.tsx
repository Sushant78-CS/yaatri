import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function SplashPreview() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Ionicons name="shield-checkmark" size={70} color="#FFFFFF" />
        </View>

        <Text style={styles.title}>Yaatri</Text>

        <Text style={styles.subtitle}>Stay Safe. Stay Connected.</Text>
      </View>

      <Text style={styles.footer}>Emergency Safety Network</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 120,
  },

  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },

  logoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#E53935",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#E53935",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },

  title: {
    marginTop: 28,
    fontSize: 38,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: 1,
  },

  subtitle: {
    marginTop: 10,
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },

  footer: {
    fontSize: 13,
    color: "#9CA3AF",
    letterSpacing: 0.5,
  },
});
