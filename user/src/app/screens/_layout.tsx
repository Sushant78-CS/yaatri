import { Stack } from "expo-router";
import React from "react";

const ScreenLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
      <Stack.Screen name="details" />
    </Stack>
  );
};

export default ScreenLayout;
