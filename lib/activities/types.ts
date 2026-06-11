import { DailyForecast } from "@/lib/open-meteo";

export enum ActivityId {
  Skiing = "SKIING",
  Surfing = "SURFING",
  OutdoorSightseeing = "OUTDOOR_SIGHTSEEING",
  IndoorSightseeing = "INDOOR_SIGHTSEEING",
}

export type Rating = "Excellent" | "Good" | "Fair" | "Poor";

export interface DailyScore {
  date: string;
  score: number;
  reason: string;
}

export interface ScoringStrategy {
  id: ActivityId;
  label: string;
  description: string;
  scoreDay(forecast: DailyForecast): DailyScore;
}

export interface ActivityRanking {
  id: ActivityId;
  label: string;
  description: string;
  overallScore: number;
  rating: Rating;
  bestDay: DailyScore;
  dailyScores: DailyScore[];
}
