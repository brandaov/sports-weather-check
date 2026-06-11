import { ActivityRanking } from "@/lib/activities";

export interface ForecastLocation {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface ActivityForecast {
  location: ForecastLocation;
  rankings: ActivityRanking[];
}

export interface RankingState {
  status: "idle" | "success" | "error";
  city: string;
  forecast?: ActivityForecast;
  error?: string;
}

export const initialRankingState: RankingState = { status: "idle", city: "" };
