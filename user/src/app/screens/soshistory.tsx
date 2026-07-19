import {
  CARD,
  FONT_SIZE,
  ICON_SIZE,
  RADIUS,
  SPACING,
  verticalScale,
} from "@/constants/responsive";
import { subscribeSOSHistory } from "@/services/sos";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SOSHistory = () => {
  const router = useRouter();

  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = subscribeSOSHistory(setAlerts);
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.title}>SOS History</Text>
      </View>

      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{alerts.length}</Text>
                <Text style={styles.statLabel}>Total SOS</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  {alerts.filter((alert) => alert.status === "ACTIVE").length}
                </Text>
                <Text style={styles.statLabel}>Active</Text>
              </View>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="time-outline" size={64} color="#D1D5DB" />

            <Text style={styles.emptyTitle}>No SOS History</Text>

            <Text style={styles.emptySubtitle}>
              Your emergency alerts will appear here once an SOS is triggered.
            </Text>
          </View>
        }
        renderItem={({ item: alert }) => (
          <TouchableOpacity style={styles.historyCard}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 1 }}>
                <View style={styles.cardHeader}>
                  <View
                    style={[
                      styles.statusDot,
                      {
                        backgroundColor:
                          alert.status === "ACTIVE" ? "#10B981" : "#EF4444",
                      },
                    ]}
                  />

                  <Text style={styles.statusText}>{alert.status}</Text>
                </View>

                <Text style={styles.location}>{alert.locationName}</Text>

                <Text style={styles.time}>
                  {alert.createdAt?.toDate().toLocaleString("en-IN")}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default SOSHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: SPACING.lg,
  },

  header: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.lg,
    height: verticalScale(40),
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(80),
  },

  emptyTitle: {
    fontSize: FONT_SIZE.subtitle,
    fontWeight: "700",
    color: "#111827",
    marginTop: SPACING.md,
  },

  emptySubtitle: {
    fontSize: FONT_SIZE.body,
    color: "#6B7280",
    textAlign: "center",
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    lineHeight: FONT_SIZE.body * 1.5,
  },

  backButton: {
    position: "absolute",
    left: 0,
    width: ICON_SIZE.xl + SPACING.sm,
    height: ICON_SIZE.xl + SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: FONT_SIZE.title,
    fontWeight: "700",
    color: "#111827",
  },

  historyCard: {
    backgroundColor: "#F3F4F6",
    borderRadius: RADIUS.md,
    padding: CARD.padding,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.xs,
  },

  statusText: {
    fontSize: FONT_SIZE.small,
    fontWeight: "600",
  },

  location: {
    fontSize: FONT_SIZE.body,
    fontWeight: "600",
    color: "#111827",
  },

  time: {
    marginTop: SPACING.xs / 2,
    fontSize: FONT_SIZE.small,
    color: "#6B7280",
  },

  statsContainer: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  statNumber: {
    fontSize: FONT_SIZE.title,
    fontWeight: "700",
    color: "#E53935",
  },

  statLabel: {
    marginTop: SPACING.xs / 2,
    fontSize: FONT_SIZE.small,
    color: "#6B7280",
  },
});
