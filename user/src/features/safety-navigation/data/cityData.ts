import type {
  FeatureCollection,
  Geometry,
} from "geojson";

import mumbaiEnvironmentalData from "./maharashtra/mumbai/environmentalAreas.json";
import mumbaiMilitaryData from "./maharashtra/mumbai/militaryAreas.json";
import mumbaiEmergencyData from "./maharashtra/mumbai/emergencyServices.json";

import puneEnvironmentalData from "./maharashtra/pune/environmentalAreas.json";
import puneMilitaryData from "./maharashtra/pune/militaryAreas.json";
import puneEmergencyData from "./maharashtra/pune/emergencyServices.json";

export type SupportedCity = "mumbai" | "pune";

export interface CitySafetyData {
  environmentalAreas: FeatureCollection<Geometry>;
  militaryAreas: FeatureCollection<Geometry>;
  emergencyServices: FeatureCollection<Geometry>;
}

const cityData: Record<SupportedCity, CitySafetyData> = {
  mumbai: {
    environmentalAreas:
      mumbaiEnvironmentalData as FeatureCollection<Geometry>,

    militaryAreas:
      mumbaiMilitaryData as FeatureCollection<Geometry>,

    emergencyServices:
      mumbaiEmergencyData as FeatureCollection<Geometry>,
  },

  pune: {
    environmentalAreas:
      puneEnvironmentalData as FeatureCollection<Geometry>,

    militaryAreas:
      puneMilitaryData as FeatureCollection<Geometry>,

    emergencyServices:
      puneEmergencyData as FeatureCollection<Geometry>,
  },
};

export function getCitySafetyData(
  city: SupportedCity,
): CitySafetyData {
  return cityData[city];
}