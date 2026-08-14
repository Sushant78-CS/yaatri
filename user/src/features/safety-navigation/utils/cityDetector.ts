import type { SupportedCity } from "../data/cityData";

interface CityBounds {
  city: SupportedCity;
  minLatitude: number;
  maxLatitude: number;
  minLongitude: number;
  maxLongitude: number;
}

const cityBounds: CityBounds[] = [
  {
    city: "mumbai",

    minLatitude: 18.85,
    maxLatitude: 19.35,

    minLongitude: 72.75,
    maxLongitude: 73.05,
  },

  {
    city: "pune",

    minLatitude: 18.40,
    maxLatitude: 18.70,

    minLongitude: 73.70,
    maxLongitude: 74.05,
  },
];

export function detectCity(
  latitude: number,
  longitude: number,
): SupportedCity | null {
  const result = cityBounds.find(
    (bounds) =>
      latitude >= bounds.minLatitude &&
      latitude <= bounds.maxLatitude &&
      longitude >= bounds.minLongitude &&
      longitude <= bounds.maxLongitude,
  );

  return result?.city ?? null;
}