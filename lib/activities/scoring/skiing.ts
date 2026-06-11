import { DailyForecast } from "@/lib/open-meteo";
import { ActivityId, DailyScore, ScoringStrategy } from "../types";
import {
  combine,
  penalizeWhenAbove,
  rewardWhenAbove,
} from "./scale";

const FREEZING_C = 0;

export const skiingStrategy: ScoringStrategy = {
  id: ActivityId.Skiing,
  label: "Skiing",
  description: "Fresh snow, sub-zero temperatures and calm slopes.",
  scoreDay(forecast: DailyForecast): DailyScore {
    const freshSnow = rewardWhenAbove(forecast.snowfallSumCm, 0, 12, 45);
    const cold = rewardWhenAbove(FREEZING_C - forecast.temperatureMaxC, 0, 4, 30);
    const rainPenalty = penalizeWhenAbove(forecast.rainSumMm, 1, 6, 30);
    const windPenalty = penalizeWhenAbove(forecast.windGustsMaxKmh, 45, 1, 25);

    return {
      date: forecast.date,
      score: combine(15, freshSnow, cold, rainPenalty, windPenalty),
      reason: describe(forecast),
    };
  },
};

function describe(forecast: DailyForecast): string {
  if (forecast.snowfallSumCm > 0 && forecast.temperatureMaxC <= FREEZING_C) {
    return `${forecast.snowfallSumCm} cm of fresh snow with a high of ${forecast.temperatureMaxC}°C.`;
  }
  if (forecast.rainSumMm > 1) {
    return `Rain (${forecast.rainSumMm} mm) is melting the slopes.`;
  }
  if (forecast.temperatureMaxC > FREEZING_C) {
    return `Too mild for snow at ${forecast.temperatureMaxC}°C.`;
  }
  return "Cold but no fresh snowfall expected.";
}
