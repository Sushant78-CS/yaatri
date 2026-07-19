import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, Vibration } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export default function SosButton({
  handleSOS,
  cancelSOS,
  countDown,
}: {
  handleSOS: () => void;
  cancelSOS: () => void;
  countDown: number | null;
}) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (countDown !== null) {
      Vibration.vibrate(200);
      scale.value = withSequence(
        withTiming(1.25, { duration: 250 }),
        withTiming(1, { duration: 250 }),
      );
    }
  }, [countDown]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  return (
    <TouchableOpacity
      style={[styles.sosContainer, countDown !== null && styles.activeSOS]}
      onPress={countDown == null ? handleSOS : cancelSOS}
    >
      <Animated.Text style={[styles.sosText, animatedStyle]}>
        {countDown !== null ? countDown : "SOS"}
      </Animated.Text>
      <Text style={styles.sosSubText}>
        {countDown !== null ? "STOP" : "Emergency Assistance"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  sosContainer: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#E53935",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 35,
  },

  sosText: {
    color: "#FFF",
    fontSize: 42,
    fontWeight: "800",
  },

  sosSubText: {
    color: "#FFF",
    marginTop: 6,
    fontSize: 13,
  },
  activeSOS: {
    backgroundColor: "#B91C1C",
  },
});
