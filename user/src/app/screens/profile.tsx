import InfoRow from "@/components/InfoRow";
import SettingRow from "@/components/SettingRow";
import {
  FONT_SIZE,
  ICON_SIZE,
  moderateScale,
  RADIUS,
  SPACING,
  verticalScale,
} from "@/constants/responsive";
import { signOut } from "@/firebase/auth";
import { saveProfile } from "@/firebase/profile";
import useAuthStore from "@/store/authStore";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AVATAR_SIZE = moderateScale(90);

export default function ProfileScreen() {
  const { user, profile, setProfile } = useAuthStore();
  const router = useRouter();
  console.log("profile profile", profile);
  console.log("user profile", user);

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState(profile?.phoneNumber || "");
  const [age, setAge] = useState(profile?.age || "");
  const [bloodGroup, setBloodGroup] = useState(profile?.bloodGroup || "");

  const handleLogout = async () => {
    await signOut();
  };

  const handleUpdate = async () => {
    setModalVisible(false);

    await saveProfile({
      phoneNumber,
      age,
      bloodGroup,
      emergencyContact: profile?.emergencyContact || [],
      profileComplete: true,
    });
    setProfile({
      phoneNumber,
      age,
      bloodGroup,
      emergencyContact: profile?.emergencyContact || [],
      profileComplete: true,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerBack}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={22} color="#111827" />
            </TouchableOpacity>
          </View>

          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.displayName?.charAt(0) || "S"}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="create-outline" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{user?.displayName || "-"}</Text>

          <Text style={styles.email}>{user?.email || "-"}</Text>
        </View>

        <View style={styles.quickRow}>
          <TouchableOpacity
            onPress={() => router.push("/screens/emergencycontacts")}
            style={styles.quickCard}
          >
            <Feather name="phone-call" size={24} color="#ef4444" />
            <Text style={styles.quickLabel}>Emergency Contacts</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/screens/soshistory")}
            style={styles.quickCard}
          >
            <MaterialIcons name="history" size={24} color="#ef4444" />
            <Text style={styles.quickLabel}>SOS History</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <InfoRow
            icon="user"
            label="Full Name"
            value={user?.displayName || "-"}
          />

          <InfoRow icon="mail" label="Email" value={user?.email || "-"} />

          <InfoRow
            icon="phone"
            label="Phone Number"
            value={profile?.phoneNumber || "-"}
          />

          <InfoRow
            icon="activity"
            label="Blood Group"
            value={profile?.bloodGroup || "-"}
          />

          <InfoRow
            icon="calendar"
            label="Age"
            value={profile?.age?.toString() || "-"}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contact</Text>
          {profile?.emergencyContact.length === 0 ? (
            <View>
              <InfoRow
                icon="user"
                label="Contact Name"
                value={profile?.emergencyContact[0]?.name || "-"}
              />
            </View>
          ) : (
            <View>
              <InfoRow
                icon="user"
                label="Contact Name"
                value={profile?.emergencyContact[0]?.name || "-"}
              />
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <SettingRow title="Notification Preferences" />
          <SettingRow title="Location Permissions" />
          <SettingRow title="Privacy & Security" />
          <SettingRow title="Terms & Conditions" />
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <MaterialIcons name="logout" size={18} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Safara v1.0.0</Text>
      </ScrollView>
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Update Profile</Text>

            {/* Phone Number */}
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />

            {/* Age */}
            <Text style={styles.label}>Age</Text>
            <TextInput style={styles.input} value={age} onChangeText={setAge} />

            {/* Blood Group */}
            <Text style={styles.label}>Blood Group</Text>
            <TextInput
              style={styles.input}
              value={bloodGroup}
              onChangeText={setBloodGroup}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
                <Text style={styles.updateText}>Update Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  avatarContainer: {
    position: "relative",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: SPACING.lg,
  },

  modalContainer: {
    backgroundColor: "#FFF",
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
  },

  modalTitle: {
    fontSize: FONT_SIZE.subtitle,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },

  modalSubtitle: {
    fontSize: FONT_SIZE.small,
    color: "#6B7280",
    marginTop: SPACING.xs,
    marginBottom: SPACING.lg,
  },

  label: {
    fontSize: FONT_SIZE.small,
    fontWeight: "600",
    color: "#374151",
    marginBottom: SPACING.xs,
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.md,
    color: "#111827",
    backgroundColor: "#F9FAFB",
  },

  buttonRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },

  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: "center",
  },

  cancelText: {
    color: "#374151",
    fontWeight: "600",
  },

  updateBtn: {
    flex: 1,
    backgroundColor: "#E53935",
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: "center",
  },

  updateText: {
    color: "#FFF",
    fontWeight: "700",
  },
  header: {
    alignItems: "center",
    paddingTop: verticalScale(42),
    paddingBottom: SPACING.xl,
    position: "relative",
  },

  headerBack: {
    position: "absolute",
    left: SPACING.lg,
    top: verticalScale(28),
    zIndex: 10,
  },

  backButton: {
    width: ICON_SIZE.xl + SPACING.sm,
    height: ICON_SIZE.xl + SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: "#EAEBEE",
    justifyContent: "center",
    alignItems: "center",
  },

  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: "#E53935",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: FONT_SIZE.heading,
    fontWeight: "700",
  },

  name: {
    color: "#111827",
    fontSize: FONT_SIZE.subtitle,
    fontWeight: "700",
    marginTop: SPACING.md,
  },

  email: {
    color: "#6B7280",
    marginTop: SPACING.xs,
    fontSize: FONT_SIZE.body,
  },

  quickRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },

  quickCard: {
    width: "42%",
    backgroundColor: "#FFFFFF",
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.xl,
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  quickLabel: {
    color: "#111827",
    marginTop: SPACING.sm,
    fontSize: FONT_SIZE.small,
    fontWeight: "500",
  },

  section: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    backgroundColor: "#FFFFFF",
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.sm,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  sectionTitle: {
    color: "#64748B",
    fontSize: FONT_SIZE.body,
    fontWeight: "700",
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },

  logoutBtn: {
    backgroundColor: "#E53935",
    marginHorizontal: SPACING.md,
    height: verticalScale(50),
    borderRadius: RADIUS.md,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: SPACING.sm,
  },

  logoutText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: FONT_SIZE.body,
  },

  version: {
    textAlign: "center",
    color: "#94A3B8",
    marginVertical: SPACING.lg,
    fontSize: FONT_SIZE.small,
  },

  editButton: {
    position: "absolute",
    right: 0,
    bottom: 0,

    width: 32,
    height: 32,
    borderRadius: 16,

    backgroundColor: "#E53935",

    justifyContent: "center",
    alignItems: "center",

    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
});
