import { ActivityId, Rating } from "@/lib/activities";

export function formatWeekday(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
  });
}

export function formatDayAndMonth(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
}

const ACTIVITY_ICONS: Record<ActivityId, string> = {
  [ActivityId.Skiing]: "⛷️",
  [ActivityId.Surfing]: "🏄",
  [ActivityId.OutdoorSightseeing]: "🏞️",
  [ActivityId.IndoorSightseeing]: "🏛️",
};

export function activityIcon(id: ActivityId): string {
  return ACTIVITY_ICONS[id];
}

const RATING_STYLES: Record<Rating, string> = {
  Excellent: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  Good: "bg-lime-100 text-lime-700 dark:bg-lime-500/15 dark:text-lime-300",
  Fair: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  Poor: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
};

export function ratingBadgeClasses(rating: Rating): string {
  return RATING_STYLES[rating];
}

export function scoreBarClasses(score: number): string {
  if (score >= 75) return "bg-emerald-500";
  if (score >= 55) return "bg-lime-500";
  if (score >= 35) return "bg-amber-500";
  return "bg-red-500";
}
