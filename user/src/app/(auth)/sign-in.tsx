import { BUTTON, FONT_SIZE, RADIUS, SPACING } from "@/constants/responsive";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signIn } from "../../firebase/auth";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      const user = await signIn(email, password);
      console.log("User signed in:", user);
    } catch (error) {
      console.error("Error handling sign in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} style={[styles.mainContainer]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.container]}>
            <View style={[styles.content]}>
              <Text style={styles.title}>Welcome, Sign In</Text>
            </View>
            <View style={[styles.inputContainer]}>
              <TextInput
                placeholder="Email"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                placeholderTextColor="#999"
              />
              <TextInput
                placeholder="Password"
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                secureTextEntry
                placeholderTextColor="#999"
              />
              <TouchableOpacity
                style={[styles.button]}
                onPress={handleSignIn}
                disabled={isLoading}
              >
                <Text style={[styles.buttonText]}>Sign In</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.bottomSection]}>
              <Text style={styles.bottomText}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/sign-up")}>
                <Text style={styles.signUpText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignInPage;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },

  container: {
    alignItems: "center",
    paddingTop: SPACING.xl * 3,
    width: "100%",
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
  },

  content: {
    marginBottom: SPACING.xl,
  },

  inputContainer: {
    width: "88%",
    maxWidth: 340,
  },

  title: {
    fontSize: FONT_SIZE.heading,
    fontWeight: "700",
    color: "#111827",
  },

  input: {
    width: "100%",
    height: BUTTON.height,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    fontSize: FONT_SIZE.body,
    color: "#000",
    backgroundColor: "#FFFFFF",
  },

  button: {
    width: "100%",
    backgroundColor: "#000",
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    marginTop: SPACING.lg,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: FONT_SIZE.subtitle,
    textAlign: "center",
  },

  bottomSection: {
    flexDirection: "row",
    marginTop: SPACING.lg,
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
  },

  bottomText: {
    fontSize: FONT_SIZE.body,
    color: "#4E5152",
  },

  signUpText: {
    fontSize: FONT_SIZE.body,
    fontWeight: "700",
    color: "#000",
    marginLeft: SPACING.xs,
  },
});
