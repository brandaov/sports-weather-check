"use server";

import { headers } from "next/headers";
import {
  ActivityForecast,
  ForecastLocation,
  RankingState,
} from "./ranking";

const FORECAST_FIELDS = /* GraphQL */ `
  location {
    name
    country
    latitude
    longitude
    timezone
  }
  rankings {
    id
    label
    description
    overallScore
    rating
    bestDay {
      date
      score
      reason
    }
    dailyScores {
      date
      score
      reason
    }
  }
`;

const FORECAST_BY_CITY = /* GraphQL */ `
  query ActivityForecast($city: String!) {
    activityForecast(city: $city) { ${FORECAST_FIELDS} }
  }
`;

const FORECAST_BY_LOCATION = /* GraphQL */ `
  query ActivityForecastForLocation($location: LocationInput!) {
    activityForecastForLocation(location: $location) { ${FORECAST_FIELDS} }
  }
`;

export async function getActivityRanking(
  _previous: RankingState,
  formData: FormData,
): Promise<RankingState> {
  const city = String(formData.get("city") ?? "").trim();
  if (!city) {
    return { status: "error", city, error: "Enter a city to see the ranking." };
  }

  const location = parseSelectedLocation(formData.get("location"));

  try {
    const forecast = location
      ? await queryForecast(FORECAST_BY_LOCATION, { location }, "activityForecastForLocation")
      : await queryForecast(FORECAST_BY_CITY, { city }, "activityForecast");
    return { status: "success", city, forecast };
  } catch (error) {
    return { status: "error", city, error: toMessage(error) };
  }
}

function parseSelectedLocation(raw: FormDataEntryValue | null): ForecastLocation | null {
  if (typeof raw !== "string" || !raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as ForecastLocation;
  } catch {
    return null;
  }
}

async function queryForecast(
  query: string,
  variables: Record<string, unknown>,
  field: "activityForecast" | "activityForecastForLocation",
): Promise<ActivityForecast> {
  const response = await fetch(await resolveGraphqlEndpoint(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  const body = await response.json();
  if (body.errors?.length) {
    throw new Error(body.errors[0].message);
  }
  return body.data[field];
}

async function resolveGraphqlEndpoint(): Promise<string> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") || host.startsWith("127.")
    ? "http"
    : "https";
  return `${protocol}://${host}/api/graphql`;
}

function toMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Something went wrong while fetching the forecast.";
}
