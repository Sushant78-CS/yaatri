import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

interface Props {
  onPress: () => void;
}

export default function LocateMeButton({
  onPress,
}: Props) {
  return (
    <Pressable
      style={styles.button}
      onPress={onPress}
    >
      <Text style={styles.icon}>◎</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",

    right: 18,

    bottom: 180,

    width: 56,

    height: 56,

    borderRadius: 28,

    backgroundColor: "#FFFFFF",

    justifyContent: "center",

    alignItems: "center",

    elevation: 8,
  },

  icon: {
    fontSize: 24,

    color: "#2563EB",
  },
});