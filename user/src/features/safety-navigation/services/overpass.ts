export interface OverpassGeometryPoint {
  lat: number;
  lon: number;
}

export interface OverpassElement {
  type: "node" | "way" | "relation";
  id: number;

  tags?: {
    name?: string;
    boundary?: string;
    leisure?: string;
    protect_class?: string;
    protection_title?: string;

    [key: string]: string | undefined;
  };

  geometry?: OverpassGeometryPoint[];
}

export interface OverpassResponse {
  elements: OverpassElement[];
}

const OVERPASS_URL =
  "https://overpass.kumi.systems/api/interpreter";

export async function fetchMumbaiProtectedAreas(): Promise<OverpassResponse> {
  const query = `
[out:json][timeout:30];

(
  way["boundary"="protected_area"](18.85,72.75,19.35,73.05);
  relation["boundary"="protected_area"](18.85,72.75,19.35,73.05);

  way["leisure"="nature_reserve"](18.85,72.75,19.35,73.05);
  relation["leisure"="nature_reserve"](18.85,72.75,19.35,73.05);
);

out geom;
`;

  const response = await fetch(OVERPASS_URL, {
    method: "POST",
    body: "data=" + encodeURIComponent(query),
  });

  if (!response.ok) {
    const errorText = await response.text();

    console.error(
      "OVERPASS ERROR:",
      response.status,
      errorText,
    );

    throw new Error(
      `Overpass request failed: ${response.status}`,
    );
  }

  const data: OverpassResponse =
    await response.json();

  return data;
}