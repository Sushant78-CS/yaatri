import { FONT_SIZE, ICON_SIZE, RADIUS, SPACING } from "@/constants/responsive";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const SMSCard = () => {
  return (
    <TouchableOpacity
      style={styles.smsButton}
      onPress={() => router.push("/screens/sms")}
    >
      <View style={styles.smsIconContainer}>
        <Ionicons name="chatbox-outline" size={ICON_SIZE.md} color="#E53935" />
      </View>

      <View style={styles.smsContent}>
        <Text style={styles.smsTitle}>SMS</Text>
        <Text style={styles.smsSubtitle}>Send an emergency SMS</Text>
      </View>

      <Ionicons name="chevron-forward" size={ICON_SIZE.md} color="#9CA3AF" />
    </TouchableOpacity>
  );
};

export default SMSCard;

const styles = StyleSheet.create({
  smsButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginTop: SPACING.md,

    flexDirection: "row",
    alignItems: "center",

    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  smsIconContainer: {
    width: ICON_SIZE.xl + SPACING.xs,
    height: ICON_SIZE.xl + SPACING.xs,
    borderRadius: RADIUS.full,
    backgroundColor: "#FEE2E2",

    justifyContent: "center",
    alignItems: "center",
  },

  smsContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },

  smsTitle: {
    fontSize: FONT_SIZE.subtitle,
    fontWeight: "700",
    color: "#111827",
  },

  smsSubtitle: {
    fontSize: FONT_SIZE.small,
    color: "#6B7280",
    marginTop: SPACING.xs,
    lineHeight: FONT_SIZE.small * 1.4,
  },
});
