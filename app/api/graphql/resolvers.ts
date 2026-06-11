import { GraphQLError } from "graphql";
import { rankActivities } from "@/lib/activities";
import {
  CityNotFoundError,
  Location,
  fetchSevenDayForecast,
  geocodeCity,
  searchCities,
} from "@/lib/open-meteo";

export const resolvers = {
  Query: {
    citySuggestions: (_parent: unknown, args: { query: string }) =>
      searchCities(args.query),

    activityForecast: async (_parent: unknown, args: { city: string }) => {
      const location = await resolveLocation(args.city);
      return buildForecast(location);
    },

    activityForecastForLocation: (
      _parent: unknown,
      args: { location: Location },
    ) => buildForecast(args.location),
  },
};

async function buildForecast(location: Location) {
  const forecast = await fetchSevenDayForecast(location);
  return {
    location,
    rankings: rankActivities(forecast),
  };
}

async function resolveLocation(city: string): Promise<Location> {
  try {
    return await geocodeCity(city);
  } catch (error) {
    if (error instanceof CityNotFoundError) {
      throw new GraphQLError(error.message, {
        extensions: { code: "CITY_NOT_FOUND" },
      });
    }
    throw error;
  }
}
