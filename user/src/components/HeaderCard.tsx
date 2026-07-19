import { FONT_SIZE, ICON_SIZE, RADIUS, SPACING } from "@/constants/responsive";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { User as FirebaseUser } from "firebase/auth";
import { User } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HeaderCard({
  user,
  location,
  loading,
  onRefresh,
}: {
  user: FirebaseUser;
  location: string;
  loading: boolean;
  onRefresh: () => void;
}) {
  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        <Text style={styles.name}>{user?.displayName || "User"}</Text>

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.locationRow}
          onPress={onRefresh}
        >
          <Ionicons name="location-sharp" size={ICON_SIZE.sm} color="#E53935" />

          <Text numberOfLines={1} style={styles.location}>
            {loading ? "Fetching location..." : location}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.profileBtn}
        onPress={() => router.push("/screens/profile")}
      >
        <User size={ICON_SIZE.md} color="#111827" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  leftContainer: {
    flex: 1,
  },
  name: {
    fontSize: FONT_SIZE.heading,
    fontWeight: "700",
    color: "#111827",
    marginTop: SPACING.xs / 2,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  location: {
    fontSize: FONT_SIZE.small,
    color: "#6B7280",
    flex: 1,
  },
  profileBtn: {
    width: ICON_SIZE.xl + SPACING.xs,
    height: ICON_SIZE.xl + SPACING.xs,
    borderRadius: RADIUS.full,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
});
