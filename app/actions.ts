"use server";

import { headers } from "next/headers";
import { ActivityForecast, RankingState } from "./ranking";

const ACTIVITY_FORECAST_QUERY = /* GraphQL */ `
  query ActivityForecast($city: String!) {
    activityForecast(city: $city) {
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
    }
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

  try {
    const forecast = await queryActivityForecast(city);
    return { status: "success", city, forecast };
  } catch (error) {
    return { status: "error", city, error: toMessage(error) };
  }
}

async function queryActivityForecast(city: string): Promise<ActivityForecast> {
  const response = await fetch(await resolveGraphqlEndpoint(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: ACTIVITY_FORECAST_QUERY,
      variables: { city },
    }),
    cache: "no-store",
  });

  const body = await response.json();
  if (body.errors?.length) {
    throw new Error(body.errors[0].message);
  }
  return body.data.activityForecast;
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
