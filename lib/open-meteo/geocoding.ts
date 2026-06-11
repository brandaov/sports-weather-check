import {
  CityNotFoundError,
  CitySuggestion,
  Location,
  WeatherProviderError,
} from "./types";

const GEOCODING_ENDPOINT = "https://geocoding-api.open-meteo.com/v1/search";
const SUGGESTION_LIMIT = 5;

interface GeocodingMatch {
  id: number;
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

interface GeocodingResponse {
  results?: GeocodingMatch[];
}

export async function geocodeCity(city: string): Promise<Location> {
  const [bestMatch] = await requestMatches(city, 1);
  if (!bestMatch) {
    throw new CityNotFoundError(city);
  }
  return toSuggestion(bestMatch);
}

export async function searchCities(query: string): Promise<CitySuggestion[]> {
  const matches = await requestMatches(query, SUGGESTION_LIMIT);
  return matches.map(toSuggestion);
}

async function requestMatches(
  query: string,
  count: number,
): Promise<GeocodingMatch[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const response = await fetch(buildGeocodingUrl(trimmed, count));
  if (!response.ok) {
    throw new WeatherProviderError(
      `Geocoding request failed with status ${response.status}.`,
    );
  }

  const { results }: GeocodingResponse = await response.json();
  return results ?? [];
}

function buildGeocodingUrl(query: string, count: number): string {
  const params = new URLSearchParams({
    name: query,
    count: String(count),
    language: "en",
    format: "json",
  });
  return `${GEOCODING_ENDPOINT}?${params}`;
}

function toSuggestion(match: GeocodingMatch): CitySuggestion {
  return {
    id: match.id,
    name: match.name,
    region: match.admin1 ?? "",
    country: match.country ?? "",
    latitude: match.latitude,
    longitude: match.longitude,
    timezone: match.timezone,
  };
}
