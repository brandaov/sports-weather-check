const MIN_SCORE = 0;
const MAX_SCORE = 100;

export function clampScore(value: number): number {
  return Math.max(MIN_SCORE, Math.min(MAX_SCORE, Math.round(value)));
}

export function combine(...points: number[]): number {
  const total = points.reduce((sum, points) => sum + points, 0);
  return clampScore(total);
}

export function rewardWhenAbove(
  value: number,
  threshold: number,
  pointsPerUnit: number,
  cap: number,
): number {
  if (value <= threshold) {
    return 0;
  }
  return Math.min(cap, (value - threshold) * pointsPerUnit);
}

export function penalizeWhenAbove(
  value: number,
  threshold: number,
  pointsPerUnit: number,
  cap: number,
): number {
  return -rewardWhenAbove(value, threshold, pointsPerUnit, cap);
}

export function rewardWithinRange(
  value: number,
  ideal: number,
  tolerance: number,
  maxPoints: number,
): number {
  const distance = Math.abs(value - ideal);
  if (distance >= tolerance) {
    return 0;
  }
  return maxPoints * (1 - distance / tolerance);
}
