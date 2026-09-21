import React, {
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  searchPlaces,
  type PlaceSearchResult,
} from "../services/placeSearch";

interface Props {
  latitude: number;
  longitude: number;

  onSelect: (
    place: PlaceSearchResult,
  ) => void;
}

export default function DestinationSearch({
  latitude,
  longitude,
  onSelect,
}: Props) {
  const [query, setQuery] =
    useState("");

  const [results, setResults] =
    useState<PlaceSearchResult[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setError(null);
      return;
    }

    const timer = setTimeout(
      async () => {
        try {
          setLoading(true);
          setError(null);

          const places =
            await searchPlaces(
              query,
              latitude,
              longitude,
            );

          setResults(places);
        } catch (err) {
          console.error(
            "PLACE SEARCH ERROR:",
            err,
          );

          setError(
            "Unable to search places.",
          );

          setResults([]);
        } finally {
          setLoading(false);
        }
      },
      350,
    );

    return () => {
      clearTimeout(timer);
    };
  }, [
    query,
    latitude,
    longitude,
  ]);

  const handleSelect = (
    place: PlaceSearchResult,
  ) => {
    setQuery(place.name);
    setResults([]);
    setError(null);

    onSelect(place);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>
          🔍
        </Text>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search destination..."
          placeholderTextColor="#6B7280"
          style={styles.input}
          returnKeyType="search"
        />

        {loading && (
          <ActivityIndicator
            size="small"
          />
        )}

        {!loading &&
          query.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setQuery("");
                setResults([]);
              }}
            >
              <Text style={styles.clear}>
                ×
              </Text>
            </TouchableOpacity>
          )}
      </View>

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>
            {error}
          </Text>
        </View>
      )}

      {results.length > 0 && (
        <View style={styles.resultsContainer}>
          <FlatList
            data={results}
            keyExtractor={(item, index) =>
  `${item.id}-${index}`
}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() =>
                  handleSelect(item)
                }
                activeOpacity={0.7}
              >
                <View
                  style={styles.locationIcon}
                >
                  <Text>📍</Text>
                </View>

                <View
                  style={styles.resultText}
                >
                  <Text
                    style={styles.resultName}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>

                  <Text
                    style={styles.resultAddress}
                    numberOfLines={2}
                  >
                    {item.address}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: 16,
    right: 16,
    zIndex: 100,
  },

  searchBox: {
    height: 54,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 16,

    elevation: 7,

    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  searchIcon: {
    fontSize: 19,
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },

  clear: {
    fontSize: 28,
    color: "#6B7280",
    lineHeight: 28,
  },

  resultsContainer: {
    marginTop: 8,

    backgroundColor: "#FFFFFF",

    borderRadius: 16,

    maxHeight: 320,

    elevation: 8,

    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  resultItem: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 14,
    paddingVertical: 13,

    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  locationIcon: {
    width: 36,
    height: 36,

    borderRadius: 18,

    backgroundColor: "#EFF6FF",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 12,
  },

  resultText: {
    flex: 1,
  },

  resultName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  resultAddress: {
    marginTop: 3,
    fontSize: 12,
    color: "#6B7280",
  },

  errorBox: {
    marginTop: 8,
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    padding: 12,
  },

  errorText: {
    color: "#B91C1C",
    fontSize: 13,
  },
});