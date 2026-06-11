import { DailyForecast } from "@/lib/open-meteo";
import { ActivityId, DailyScore, ScoringStrategy } from "../types";
import {
  combine,
  penalizeWhenAbove,
  rewardWithinRange,
  rewardWhenAbove,
} from "./scale";

const IDEAL_WIND_KMH = 25;
const WIND_TOLERANCE_KMH = 20;

export const surfingStrategy: ScoringStrategy = {
  id: ActivityId.Surfing,
  label: "Surfing",
  description: "Wind-driven swell, mild air and dry skies.",
  scoreDay(forecast: DailyForecast): DailyScore {
    const swell = rewardWithinRange(
      forecast.windSpeedMaxKmh,
      IDEAL_WIND_KMH,
      WIND_TOLERANCE_KMH,
      45,
    );
    const warmth = rewardWhenAbove(forecast.temperatureMaxC, 12, 2.5, 30);
    const stormPenalty = penalizeWhenAbove(forecast.windGustsMaxKmh, 55, 1.5, 30);
    const rainPenalty = penalizeWhenAbove(forecast.precipitationSumMm, 4, 3, 20);

    return {
      date: forecast.date,
      score: combine(15, swell, warmth, stormPenalty, rainPenalty),
      reason: describe(forecast),
    };
  },
};

function describe(forecast: DailyForecast): string {
  if (forecast.windGustsMaxKmh > 55) {
    return `Stormy gusts up to ${forecast.windGustsMaxKmh} km/h make it unsafe.`;
  }
  if (forecast.windSpeedMaxKmh < 8) {
    return `Flat conditions with only ${forecast.windSpeedMaxKmh} km/h of wind.`;
  }
  return `${forecast.windSpeedMaxKmh} km/h wind with a high of ${forecast.temperatureMaxC}°C.`;
}
