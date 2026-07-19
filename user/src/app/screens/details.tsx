import { BUTTON, FONT_SIZE, RADIUS, SPACING } from "@/constants/responsive";
import useAuthStore from "@/store/authStore";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Profile, saveProfile } from "../../firebase/profile";

export default function CompleteProfileScreen() {
  const router = useRouter();
  const { setProfile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Profile>({
    phoneNumber: "",
    age: "",
    bloodGroup: "",
    emergencyContact: [
      {
        name: "",
        relationship: "",
        phone: "",
      },
    ],
    profileComplete: true,
  });

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateEmergencyContact = (
    field: "name" | "relationship" | "phone",
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      emergencyContact: [
        {
          ...prev.emergencyContact[0],
          [field]: value,
        },
      ],
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await saveProfile(form);
      setProfile(form);
      router.replace("/screens/home");
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Complete Your Safety Profile</Text>

          <Text style={styles.subtitle}>
            This information helps emergency responders assist you faster during
            emergencies.
          </Text>

          <SectionTitle title="Personal Information" />

          <Input
            label="Phone Number *"
            value={form.phoneNumber}
            keyboardType="phone-pad"
            onChange={(text: string) => updateField("phoneNumber", text)}
          />

          <Input
            label="Age"
            value={form.age}
            keyboardType="numeric"
            onChange={(text: string) => updateField("age", text)}
          />

          <Input
            label="Blood Group"
            value={form.bloodGroup}
            onChange={(text: string) => updateField("bloodGroup", text)}
          />

          <SectionTitle title="Emergency Contact" />

          <Input
            label="Contact Name *"
            value={form.emergencyContact[0]?.name || ""}
            onChange={(text: string) => updateEmergencyContact("name", text)}
          />

          <Input
            label="Relationship *"
            value={form.emergencyContact[0]?.relationship || ""}
            onChange={(text: string) =>
              updateEmergencyContact("relationship", text)
            }
          />

          <Input
            label="Emergency Number *"
            value={form.emergencyContact[0]?.phone || ""}
            keyboardType="phone-pad"
            onChange={(text: string) => updateEmergencyContact("phone", text)}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Saving..." : "Save Profile"}
            </Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.section}>{title}</Text>;
}

function Input({
  label,
  value,
  onChange,
  keyboardType,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (text: string) => void;
  keyboardType?: TextInputProps["keyboardType"];
  multiline?: boolean;
}) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={[styles.input, multiline && { height: 90 }]}
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        multiline={multiline}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: SPACING.lg,
  },

  title: {
    fontSize: FONT_SIZE.heading,
    fontWeight: "700",
    marginTop: SPACING.lg,
    color: "#111827",
  },

  subtitle: {
    fontSize: FONT_SIZE.body,
    color: "#6B7280",
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
    lineHeight: FONT_SIZE.body * 1.5,
  },

  section: {
    fontSize: FONT_SIZE.subtitle,
    fontWeight: "700",
    marginBottom: SPACING.md,
    marginTop: SPACING.sm,
    color: "#111827",
  },

  label: {
    fontSize: FONT_SIZE.body,
    fontWeight: "600",
    marginBottom: SPACING.sm,
    color: "#374151",
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZE.body,
    backgroundColor: "#F9FAFB",
    color: "#000",
  },

  button: {
    backgroundColor: "#E53935",
    height: BUTTON.height,
    borderRadius: BUTTON.borderRadius,
    marginTop: SPACING.lg,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: FONT_SIZE.subtitle,
  },
});
