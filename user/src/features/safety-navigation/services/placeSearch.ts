export interface PlaceSearchResult {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

const API_KEY =
  process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY;

export async function searchPlaces(
  text: string,
  latitude?: number,
  longitude?: number,
): Promise<PlaceSearchResult[]> {
  if (!API_KEY) {
    throw new Error(
      "Geoapify API key is missing.",
    );
  }

  if (text.trim().length < 2) {
    return [];
  }

  let url =
    "https://api.geoapify.com/v1/geocode/autocomplete" +
    `?text=${encodeURIComponent(text)}` +
    "&format=json" +
    "&limit=6" +
    "&filter=countrycode:in" +
    `&apiKey=${API_KEY}`;

  // Bias results toward the user's current location.
  if (
    latitude !== undefined &&
    longitude !== undefined
  ) {
    url +=
      `&bias=proximity:${longitude},${latitude}`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Place search failed: ${response.status}`,
    );
  }

  const data = await response.json();

  return (data.results ?? []).map(
    (item: any, index: number) => ({
      id:
        item.place_id ??
        `${item.lat}-${item.lon}-${index}`,

      name:
        item.name ??
        item.address_line1 ??
        item.formatted ??
        "Unknown place",

      address:
        item.address_line2 ??
        item.formatted ??
        "",

      latitude: Number(item.lat),
      longitude: Number(item.lon),
    }),
  );
}