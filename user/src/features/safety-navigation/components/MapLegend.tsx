import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function MapLegend() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        style={styles.button}
        onPress={() => setOpen(!open)}
      >
        <Text style={styles.buttonText}>ⓘ</Text>
      </Pressable>

      {open && (
        <View style={styles.card}>
          <Text style={styles.title}>
            Map Legend
          </Text>

          <Text>🟨 Wildlife Area</Text>

          <Text>🟥 Military Area</Text>

          <Text>🏥 Hospital</Text>

          <Text>👮 Police Station</Text>

          <Text>🔵 Your Location</Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",

    top: 150,

    right: 18,

    width: 46,

    height: 46,

    borderRadius: 23,

    backgroundColor: "#FFFFFF",

    justifyContent: "center",

    alignItems: "center",

    elevation: 6,
  },

  buttonText: {
    fontSize: 22,

    fontWeight: "700",
  },

  card: {
    position: "absolute",

    top: 205,

    right: 18,

    width: 210,

    padding: 14,

    borderRadius: 16,

    backgroundColor: "#FFFFFF",

    elevation: 8,
  },

  title: {
    fontWeight: "700",

    marginBottom: 10,

    fontSize: 16,
  },
});