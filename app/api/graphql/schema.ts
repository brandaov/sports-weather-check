import { createSchema } from "graphql-yoga";
import { resolvers } from "./resolvers";

const typeDefs = /* GraphQL */ `
  enum ActivityId {
    SKIING
    SURFING
    OUTDOOR_SIGHTSEEING
    INDOOR_SIGHTSEEING
  }

  enum Rating {
    Excellent
    Good
    Fair
    Poor
  }

  type Location {
    name: String!
    country: String!
    latitude: Float!
    longitude: Float!
    timezone: String!
  }

  type CitySuggestion {
    id: Int!
    name: String!
    region: String!
    country: String!
    latitude: Float!
    longitude: Float!
    timezone: String!
  }

  input LocationInput {
    name: String!
    country: String!
    latitude: Float!
    longitude: Float!
    timezone: String!
  }

  type DailyScore {
    date: String!
    score: Int!
    reason: String!
  }

  type ActivityRanking {
    id: ActivityId!
    label: String!
    description: String!
    overallScore: Int!
    rating: Rating!
    bestDay: DailyScore!
    dailyScores: [DailyScore!]!
  }

  type ActivityForecast {
    location: Location!
    rankings: [ActivityRanking!]!
  }

  type Query {
    citySuggestions(query: String!): [CitySuggestion!]!
    activityForecast(city: String!): ActivityForecast!
    activityForecastForLocation(location: LocationInput!): ActivityForecast!
  }
`;

export const schema = createSchema({ typeDefs, resolvers });
