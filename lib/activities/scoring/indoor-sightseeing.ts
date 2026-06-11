import { DailyForecast } from "@/lib/open-meteo";
import { ActivityId, DailyScore, ScoringStrategy } from "../types";
import { combine, rewardWhenAbove } from "./scale";

export const indoorSightseeingStrategy: ScoringStrategy = {
  id: ActivityId.IndoorSightseeing,
  label: "Indoor sightseeing",
  description: "Museums and galleries shine when the weather does not.",
  scoreDay(forecast: DailyForecast): DailyScore {
    const rainDriven = rewardWhenAbove(forecast.precipitationSumMm, 1, 9, 45);
    const coldDriven = rewardWhenAbove(5 - forecast.apparentTemperatureMaxC, 0, 3, 25);
    const windDriven = rewardWhenAbove(forecast.windSpeedMaxKmh, 30, 1.2, 20);

    return {
      date: forecast.date,
      score: combine(20, rainDriven, coldDriven, windDriven),
      reason: describe(forecast),
    };
  },
};

function describe(forecast: DailyForecast): string {
  if (forecast.precipitationSumMm > 1) {
    return `${forecast.precipitationSumMm} mm of rain makes indoors the comfortable choice.`;
  }
  if (forecast.apparentTemperatureMaxC < 5) {
    return `A cold feels-like high of ${forecast.apparentTemperatureMaxC}°C favours staying in.`;
  }
  return "Pleasant outside, so indoor venues are optional.";
}
