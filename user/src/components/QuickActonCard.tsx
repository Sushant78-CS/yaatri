import { CARD, FONT_SIZE, SPACING } from "@/constants/responsive";
import { handleShareLocation } from "@/services/share";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function QuickActionCard() {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);

  const handleShare = async () => {
    setLoading(true);
    await handleShareLocation();
    setLoading(false);
  };
  return (
    <>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsRow}>
        <ActionCard
          onPress={() => router.push("/screens/emergencycontacts")}
          icon="phone-call"
          label="Contacts"
          loading={false}
        />

        <ActionCard
          onPress={handleShare}
          icon="share-2"
          label={loading ? "Sharing..." : "Share"}
          loading={loading}
        />

        <ActionCard
          onPress={() => router.push("/screens/soshistory")}
          icon="clock"
          label="History"
          loading={false}
        />
      </View>
    </>
  );
}

export function ActionCard({
  onPress,
  icon,
  label,
  loading,
}: {
  onPress: () => void;
  icon: any;
  label: string;
  loading: boolean;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.actionCard}>
      {loading ? (
        <ActivityIndicator size="small" color="#1565C0" />
      ) : (
        <Feather name={icon} size={20} color="#1565C0" />
      )}
      <Text style={styles.actionText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: FONT_SIZE.subtitle,
    fontWeight: "700",
    color: "#111827",
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },

  actionsRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },

  actionCard: {
    flex: 1,

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#E5E7EB",

    borderRadius: CARD.borderRadius,
    paddingVertical: SPACING.md,

    justifyContent: "center",
    alignItems: "center",
  },

  actionText: {
    marginTop: SPACING.xs,
    fontSize: FONT_SIZE.small,
    color: "#1565C0",
    fontWeight: "600",
  },
});
