import { DailyForecast, Location, WeatherProviderError } from "./types";

const FORECAST_ENDPOINT = "https://api.open-meteo.com/v1/forecast";

const DAILY_VARIABLES = [
  "temperature_2m_max",
  "temperature_2m_min",
  "apparent_temperature_max",
  "apparent_temperature_min",
  "precipitation_sum",
  "precipitation_probability_max",
  "rain_sum",
  "snowfall_sum",
  "wind_speed_10m_max",
  "wind_gusts_10m_max",
  "uv_index_max",
  "sunshine_duration",
  "weather_code",
] as const;

interface DailyResponse {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  precipitation_sum: number[];
  precipitation_probability_max: number[];
  rain_sum: number[];
  snowfall_sum: number[];
  wind_speed_10m_max: number[];
  wind_gusts_10m_max: number[];
  uv_index_max: number[];
  sunshine_duration: number[];
  weather_code: number[];
}

export async function fetchSevenDayForecast(
  location: Location,
): Promise<DailyForecast[]> {
  const url = buildForecastUrl(location);
  const response = await fetch(url);
  if (!response.ok) {
    throw new WeatherProviderError(
      `Forecast request failed with status ${response.status}.`,
    );
  }

  const { daily }: { daily: DailyResponse } = await response.json();
  return daily.time.map((date, day) => toDailyForecast(daily, date, day));
}

function buildForecastUrl(location: Location): string {
  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    timezone: location.timezone || "auto",
    forecast_days: "7",
    daily: DAILY_VARIABLES.join(","),
  });
  return `${FORECAST_ENDPOINT}?${params}`;
}

function toDailyForecast(
  daily: DailyResponse,
  date: string,
  day: number,
): DailyForecast {
  return {
    date,
    temperatureMaxC: daily.temperature_2m_max[day],
    temperatureMinC: daily.temperature_2m_min[day],
    apparentTemperatureMaxC: daily.apparent_temperature_max[day],
    apparentTemperatureMinC: daily.apparent_temperature_min[day],
    precipitationSumMm: daily.precipitation_sum[day],
    precipitationProbabilityMaxPercent:
      daily.precipitation_probability_max[day] ?? 0,
    rainSumMm: daily.rain_sum[day],
    snowfallSumCm: daily.snowfall_sum[day],
    windSpeedMaxKmh: daily.wind_speed_10m_max[day],
    windGustsMaxKmh: daily.wind_gusts_10m_max[day],
    uvIndexMax: daily.uv_index_max[day],
    sunshineDurationHours: secondsToHours(daily.sunshine_duration[day]),
    weatherCode: daily.weather_code[day],
  };
}

function secondsToHours(seconds: number): number {
  return Math.round((seconds / 3600) * 10) / 10;
}
