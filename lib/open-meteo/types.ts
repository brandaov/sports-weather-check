export interface Location {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface DailyForecast {
  date: string;
  temperatureMaxC: number;
  temperatureMinC: number;
  apparentTemperatureMaxC: number;
  apparentTemperatureMinC: number;
  precipitationSumMm: number;
  precipitationProbabilityMaxPercent: number;
  rainSumMm: number;
  snowfallSumCm: number;
  windSpeedMaxKmh: number;
  windGustsMaxKmh: number;
  uvIndexMax: number;
  sunshineDurationHours: number;
  weatherCode: number;
}

export class CityNotFoundError extends Error {
  constructor(city: string) {
    super(`No location found for "${city}".`);
    this.name = "CityNotFoundError";
  }
}

export class WeatherProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WeatherProviderError";
  }
}
