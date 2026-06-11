import { CityNotFoundError, Location, WeatherProviderError } from "./types";

const GEOCODING_ENDPOINT = "https://geocoding-api.open-meteo.com/v1/search";

interface GeocodingMatch {
  name: string;
  country?: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

interface GeocodingResponse {
  results?: GeocodingMatch[];
}

export async function geocodeCity(city: string): Promise<Location> {
  const query = city.trim();
  if (!query) {
    throw new CityNotFoundError(city);
  }

  const url = buildGeocodingUrl(query);
  const response = await fetch(url);
  if (!response.ok) {
    throw new WeatherProviderError(
      `Geocoding request failed with status ${response.status}.`,
    );
  }

  const { results }: GeocodingResponse = await response.json();
  const bestMatch = results?.[0];
  if (!bestMatch) {
    throw new CityNotFoundError(city);
  }

  return toLocation(bestMatch);
}

function buildGeocodingUrl(city: string): string {
  const params = new URLSearchParams({
    name: city,
    count: "1",
    language: "en",
    format: "json",
  });
  return `${GEOCODING_ENDPOINT}?${params}`;
}

function toLocation(match: GeocodingMatch): Location {
  return {
    name: match.name,
    country: match.country ?? "",
    latitude: match.latitude,
    longitude: match.longitude,
    timezone: match.timezone,
  };
}
