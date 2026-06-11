import { indoorSightseeingStrategy } from "./scoring/indoor-sightseeing";
import { outdoorSightseeingStrategy } from "./scoring/outdoor-sightseeing";
import { skiingStrategy } from "./scoring/skiing";
import { surfingStrategy } from "./scoring/surfing";
import { ScoringStrategy } from "./types";

export const scoringStrategies: ScoringStrategy[] = [
  skiingStrategy,
  surfingStrategy,
  outdoorSightseeingStrategy,
  indoorSightseeingStrategy,
];
