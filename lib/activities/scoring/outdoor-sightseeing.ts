import { DailyForecast } from "@/lib/open-meteo";
import { ActivityId, DailyScore, ScoringStrategy } from "../types";
import {
  combine,
  penalizeWhenAbove,
  rewardWhenAbove,
  rewardWithinRange,
} from "./scale";

const IDEAL_TEMPERATURE_C = 21;
const TEMPERATURE_TOLERANCE_C = 14;

export const outdoorSightseeingStrategy: ScoringStrategy = {
  id: ActivityId.OutdoorSightseeing,
  label: "Outdoor sightseeing",
  description: "Mild, dry and sunny days for walking the city.",
  scoreDay(forecast: DailyForecast): DailyScore {
    const comfort = rewardWithinRange(
      forecast.apparentTemperatureMaxC,
      IDEAL_TEMPERATURE_C,
      TEMPERATURE_TOLERANCE_C,
      40,
    );
    const sunshine = rewardWhenAbove(forecast.sunshineDurationHours, 2, 4, 30);
    const rainPenalty = penalizeWhenAbove(forecast.precipitationSumMm, 1, 8, 35);
    const windPenalty = penalizeWhenAbove(forecast.windSpeedMaxKmh, 35, 1, 20);

    return {
      date: forecast.date,
      score: combine(20, comfort, sunshine, rainPenalty, windPenalty),
      reason: describe(forecast),
    };
  },
};

function describe(forecast: DailyForecast): string {
  if (forecast.precipitationSumMm > 1) {
    return `${forecast.precipitationSumMm} mm of rain expected — pack an umbrella.`;
  }
  if (forecast.sunshineDurationHours >= 6) {
    return `${forecast.sunshineDurationHours} h of sunshine at ${forecast.apparentTemperatureMaxC}°C.`;
  }
  return `Dry with a feels-like high of ${forecast.apparentTemperatureMaxC}°C.`;
}
