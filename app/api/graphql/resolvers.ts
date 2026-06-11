import { GraphQLError } from "graphql";
import { rankActivities } from "@/lib/activities";
import {
  CityNotFoundError,
  fetchSevenDayForecast,
  geocodeCity,
} from "@/lib/open-meteo";

export const resolvers = {
  Query: {
    activityForecast: async (_parent: unknown, args: { city: string }) => {
      const location = await resolveLocation(args.city);
      const forecast = await fetchSevenDayForecast(location);
      return {
        location,
        rankings: rankActivities(forecast),
      };
    },
  },
};

async function resolveLocation(city: string) {
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
