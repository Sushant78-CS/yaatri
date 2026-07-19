import {
  BUTTON,
  FONT_SIZE,
  ICON_SIZE,
  RADIUS,
  SPACING,
} from "@/constants/responsive";
import { Profile, saveProfile } from "@/firebase/profile";
import useAuthStore from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EmergencyContactsScreen() {
  const router = useRouter();
  const { profile, setProfile } = useAuthStore();
  console.log("profile emergency", profile);

  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "",
    relationship: "",
    phone: "",
  });
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const checkOnlineStatus = async () => {
      const state = await NetInfo.fetch();
      setIsOnline(
        state.isConnected === true && state.isInternetReachable === true,
      );
    };
    checkOnlineStatus();
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(
        state.isConnected === true && state.isInternetReachable === true,
      );
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setProfileData(profile);
  }, [profile]);

  const showOfflineToast = (message?: string) => {
    ToastAndroid.show(message ?? "No internet connection", ToastAndroid.SHORT);
  };
  const addEmergencyContact = async (contact: {
    name: string;
    relationship: string;
    phone: string;
  }) => {
    if (!isOnline) {
      showOfflineToast("Internet required to add contacts");
      return;
    }
    if (
      !contact.name.trim() ||
      !contact.phone.trim() ||
      !contact.relationship.trim()
    ) {
      return;
    }
    if (!profileData) return;

    if (profileData.emergencyContact.length >= 3) {
      return;
    }

    const updatedProfile = {
      ...profileData,
      emergencyContact: [...profileData.emergencyContact, contact],
    };

    setProfileData(updatedProfile);
    await saveProfile(updatedProfile);
    setProfile(updatedProfile);
  };

  const deleteEmergencyContact = async (index: number) => {
    if (!profileData) return;

    const updatedProfile = {
      ...profileData,
      emergencyContact: profileData.emergencyContact.filter(
        (_, i) => i !== index,
      ),
    };

    setProfileData(updatedProfile);
    await saveProfile(updatedProfile);
    setProfile(updatedProfile);
  };

  const confirmDelete = (index: number) => {
    if (!profileData) return;
    if (profileData.emergencyContact.length === 1) {
      Alert.alert("At least one emergency contact is required");
      return;
    }
    if (!isOnline) {
      showOfflineToast("Internet required to delete contacts");
      return;
    }
    Alert.alert(
      "Delete Contact",
      "Are you sure you want to remove this emergency contact?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteEmergencyContact(index),
        },
      ],
    );
  };

  const handleModal = () => {
    if (!isOnline) {
      showOfflineToast("Internet required to manage contacts");
      return;
    }
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={ICON_SIZE.sm} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.title}>Emergency Contacts</Text>

        <View style={{ width: 44 }} />
      </View>

      <FlatList
        data={profileData?.emergencyContact || []}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            <Text style={styles.subtitle}>
              These contacts can be notified during emergencies.
            </Text>

            <Text style={styles.contactLimit}>
              {profileData?.emergencyContact.length || 0}/3 Emergency Contacts
            </Text>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={60} color="#CBD5E1" />

            <Text style={styles.emptyTitle}>No Emergency Contacts</Text>

            <Text style={styles.emptySubtitle}>
              Add a trusted contact who can be notified during emergencies.
            </Text>
          </View>
        }
        renderItem={({ item: contact, index }) => (
          <View style={styles.contactCard}>
            <View style={styles.contactHeader}>
              <Ionicons name="person-circle" size={42} color="#E53935" />

              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>

                <Text style={styles.contactPhone}>+91 {contact.phone}</Text>

                <Text style={styles.contactRelation}>
                  {contact.relationship}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => confirmDelete(index)}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity
        style={[
          styles.addButton,
          profileData?.emergencyContact.length == 3 && styles.addButtonDisabled,
        ]}
        onPress={handleModal}
        disabled={profileData?.emergencyContact.length == 3}
      >
        {profileData?.emergencyContact.length == 3 ? (
          <Text style={styles.addText}>Maximum Contacts Added</Text>
        ) : (
          <>
            <Ionicons name="add" size={22} color="#FFF" />
            <Text style={styles.addText}>Add Contact</Text>
          </>
        )}
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Emergency Contact</Text>

            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#6B7280" />

              <TextInput
                style={styles.input}
                placeholder="Contact Name"
                placeholderTextColor="#9CA3AF"
                value={newContact.name}
                onChangeText={(text) =>
                  setNewContact((prev) => ({
                    ...prev,
                    name: text,
                  }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="people-outline" size={20} color="#6B7280" />

              <TextInput
                style={styles.input}
                placeholder="Relationship"
                placeholderTextColor="#9CA3AF"
                value={newContact.relationship}
                onChangeText={(text) =>
                  setNewContact((prev) => ({
                    ...prev,
                    relationship: text,
                  }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color="#6B7280" />

              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                value={newContact.phone}
                onChangeText={(text) =>
                  setNewContact((prev) => ({
                    ...prev,
                    phone: text,
                  }))
                }
              />
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={() => {
                  addEmergencyContact(newContact);

                  setNewContact({
                    name: "",
                    relationship: "",
                    phone: "",
                  });

                  setModalVisible(false);
                }}
              >
                <Text style={{ color: "#fff" }}>Save</Text>
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
    backgroundColor: "#FFF",
    padding: SPACING.md,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: BUTTON.height * 0.8,
    height: BUTTON.height * 0.8,
    borderRadius: RADIUS.full,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: FONT_SIZE.title,
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    marginTop: SPACING.md,
    color: "#6B7280",
    fontSize: FONT_SIZE.body,
    lineHeight: FONT_SIZE.body * 1.5,
    marginBottom: SPACING.lg,
  },

  contactLimit: {
    fontSize: FONT_SIZE.body,
    fontWeight: "600",
    color: "#E53935",
    marginBottom: SPACING.md,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.xl * 2,
  },

  emptyTitle: {
    fontSize: FONT_SIZE.subtitle,
    fontWeight: "700",
    color: "#111827",
    marginTop: SPACING.md,
  },

  emptySubtitle: {
    marginTop: SPACING.sm,
    textAlign: "center",
    color: "#64748B",
    fontSize: FONT_SIZE.body,
    lineHeight: FONT_SIZE.body * 1.5,
    paddingHorizontal: SPACING.lg,
  },

  contactCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  contactHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  contactInfo: {
    marginLeft: SPACING.md,
    flex: 1,
  },

  contactName: {
    fontSize: FONT_SIZE.subtitle,
    fontWeight: "700",
    color: "#111827",
  },

  contactPhone: {
    marginTop: SPACING.xs,
    fontSize: FONT_SIZE.body,
    color: "#374151",
  },

  contactRelation: {
    marginTop: SPACING.xs / 2,
    fontSize: FONT_SIZE.small,
    color: "#6B7280",
  },

  deleteButton: {
    marginTop: SPACING.md,
    alignSelf: "flex-end",
  },

  deleteText: {
    color: "#E53935",
    fontSize: FONT_SIZE.body,
    fontWeight: "600",
  },

  editButton: {
    marginTop: SPACING.md,
    alignSelf: "flex-end",
  },

  editText: {
    color: "#1565C0",
    fontSize: FONT_SIZE.body,
    fontWeight: "600",
  },

  addButton: {
    backgroundColor: "#E53935",
    height: BUTTON.height,
    borderRadius: BUTTON.borderRadius,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },

  addButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },

  addText: {
    color: "#FFF",
    fontSize: FONT_SIZE.subtitle,
    fontWeight: "700",
  },

  disabledButton: {
    backgroundColor: "#9CA3AF",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: SPACING.md,
  },

  modalContainer: {
    backgroundColor: "#FFF",
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
  },

  modalTitle: {
    fontSize: FONT_SIZE.subtitle,
    fontWeight: "700",
    color: "#111827",
    marginBottom: SPACING.md,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: BUTTON.height,
    marginBottom: SPACING.md,
  },

  input: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZE.body,
    color: "#111827",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: SPACING.md,
  },

  cancelBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },

  saveBtn: {
    backgroundColor: "#E53935",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
  },
});
