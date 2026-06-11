import { DailyForecast } from "@/lib/open-meteo";
import { scoringStrategies } from "./registry";
import {
  ActivityRanking,
  DailyScore,
  Rating,
  ScoringStrategy,
} from "./types";

export function rankActivities(forecast: DailyForecast[]): ActivityRanking[] {
  return scoringStrategies
    .map((strategy) => rankActivity(strategy, forecast))
    .sort((a, b) => b.overallScore - a.overallScore);
}

function rankActivity(
  strategy: ScoringStrategy,
  forecast: DailyForecast[],
): ActivityRanking {
  const dailyScores = forecast.map((day) => strategy.scoreDay(day));
  const overallScore = averageScore(dailyScores);

  return {
    id: strategy.id,
    label: strategy.label,
    description: strategy.description,
    overallScore,
    rating: toRating(overallScore),
    bestDay: pickBestDay(dailyScores),
    dailyScores,
  };
}

function averageScore(scores: DailyScore[]): number {
  const total = scores.reduce((sum, day) => sum + day.score, 0);
  return Math.round(total / scores.length);
}

function pickBestDay(scores: DailyScore[]): DailyScore {
  return scores.reduce((best, day) => (day.score > best.score ? day : best));
}

function toRating(score: number): Rating {
  if (score >= 75) return "Excellent";
  if (score >= 55) return "Good";
  if (score >= 35) return "Fair";
  return "Poor";
}
