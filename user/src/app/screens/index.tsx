import useAuthStore from "@/store/authStore";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function ScreenIndex() {
  const { isProfileCompleted } = useAuthStore();

  if (isProfileCompleted == null) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size={"large"} color={"#000"} />
      </View>
    );
  }

  if (isProfileCompleted) {
    return <Redirect href="/screens/home" />;
  }

  return <Redirect href="/screens/details" />;
}
