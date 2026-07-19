import { db } from "@/firebase/firebase";
import { Ionicons } from "@expo/vector-icons";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface SOSAlert {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  bloodGroup?: string;
  age?: string;
  status: string;
  createdAt?: any;
}

export default function Admin() {
  const [alerts, setAlerts] = useState<SOSAlert[]>([]);

  useEffect(() => {
    const q = query(collection(db, "sosAlerts"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAlerts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<SOSAlert, "id">),
        })),
      );
    });

    return unsubscribe;
  }, []);

  const openMaps = (latitude: number, longitude: number) => {
    Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
    );
  };

  const renderItem = ({ item }: { item: SOSAlert }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Ionicons name="person-circle" size={28} color="#E53935" />
        <Text style={styles.name}>{item.name}</Text>
      </View>

      <Text style={styles.info}>📍 {item.address}</Text>

      <Text style={styles.info}>🩸 Blood Group: {item.bloodGroup || "-"}</Text>

      <Text style={styles.info}>🎂 Age: {item.age || "-"}</Text>

      <Text
        style={[
          styles.status,
          {
            color: item.status === "ACTIVE" ? "#16A34A" : "#6B7280",
          },
        ]}
      >
        {item.status}
      </Text>

      <TouchableOpacity
        style={styles.mapButton}
        onPress={() => openMaps(item.latitude, item.longitude)}
      >
        <Ionicons name="navigate" size={20} color="#FFF" />
        <Text style={styles.mapText}>Open in Google Maps</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergency Dashboard</Text>

      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>No active emergency alerts.</Text>
        }
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
    color: "#111827",
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 3,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  name: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  info: {
    fontSize: 14,
    color: "#4B5563",
    marginTop: 6,
  },

  status: {
    marginTop: 12,
    fontWeight: "700",
    fontSize: 15,
  },

  mapButton: {
    marginTop: 16,
    backgroundColor: "#E53935",
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  mapText: {
    color: "#FFF",
    fontWeight: "700",
    marginLeft: 8,
    fontSize: 15,
  },

  empty: {
    textAlign: "center",
    marginTop: 80,
    color: "#6B7280",
    fontSize: 16,
  },
});
