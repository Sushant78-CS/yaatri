import SafetyMap from "@/features/safety-navigation/components/SafetyMap";
import React from "react";
import { StyleSheet, View } from "react-native";

const SafetyNavigationScreen = () => {
  return (
    <View style={styles.container}>
      <SafetyMap />
    </View>
  );
};

export default SafetyNavigationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});