// import {
//   CARD,
//   FONT_SIZE,
//   ICON_SIZE,
//   RADIUS,
//   SPACING,
// } from "@/constants/responsive";
// import { Ionicons } from "@expo/vector-icons";
// import React, { useEffect } from "react";
// import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import Animated, {
//   useAnimatedStyle,
//   useSharedValue,
//   withRepeat,
//   withTiming,
// } from "react-native-reanimated";

// export default function LocationCard({
//   location,
//   loading,
//   onRefresh,
// }: {
//   location: string;
//   loading: boolean;
//   onRefresh: () => void;
// }) {
//   const rotation = useSharedValue(0);

//   useEffect(() => {
//     if (loading) {
//       rotation.value = withRepeat(
//         withTiming(360, { duration: 1000 }),
//         -1,
//         false,
//       );
//     } else {
//       rotation.value = withTiming(0);
//     }
//   }, [loading]);

//   const animatedStyle = useAnimatedStyle(() => {
//     return {
//       transform: [
//         {
//           rotate: `${rotation.value}deg`,
//         },
//       ],
//     };
//   });

//   return (
//     <View style={styles.locationContent}>
//       <Ionicons name="location" size={ICON_SIZE.md} color="#E53935" />

//       <View style={styles.locationTextContainer}>
//         <Text style={styles.locationLabel}>Current Location</Text>

//         {loading ? (
//           <>
//             <View style={styles.skeletonLineLarge} />
//             <View style={styles.skeletonLineSmall} />
//           </>
//         ) : (
//           <Text style={styles.locationText}>{location}</Text>
//         )}
//       </View>

//       <TouchableOpacity
//         style={styles.refreshButton}
//         activeOpacity={0.7}
//         disabled={loading}
//         onPress={onRefresh}
//       >
//         <Animated.View style={animatedStyle}>
//           <Ionicons
//             name={loading ? "sync" : "refresh"}
//             size={ICON_SIZE.md}
//             color="#E53935"
//           />
//         </Animated.View>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: CARD.borderRadius,
//     padding: CARD.padding,

//     borderWidth: 1,
//     borderColor: "#E5E7EB",

//     marginTop: SPACING.md,
//   },

//   locationContent: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//   },

//   locationTextContainer: {
//     flex: 1,
//     marginLeft: SPACING.md,
//   },

//   locationLabel: {
//     fontSize: FONT_SIZE.small,
//     color: "#6B7280",
//     marginBottom: SPACING.xs,
//   },

//   locationText: {
//     fontSize: FONT_SIZE.body,
//     color: "#111827",
//     fontWeight: "600",
//     lineHeight: FONT_SIZE.body * 1.5,
//   },

//   skeletonLineLarge: {
//     height: FONT_SIZE.body,
//     width: "90%",
//     backgroundColor: "#E5E7EB",
//     borderRadius: RADIUS.full,
//     marginBottom: SPACING.xs,
//   },

//   skeletonLineSmall: {
//     height: FONT_SIZE.body,
//     width: "60%",
//     backgroundColor: "#E5E7EB",
//     borderRadius: RADIUS.full,
//   },

//   refreshButton: {
//     width: 38,
//     height: 38,
//     borderRadius: RADIUS.full,
//     backgroundColor: "#FEF2F2",
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#FECACA",
//   },
// });
