import { Rating } from "@/lib/activities";

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

const RATING_STYLES: Record<Rating, string> = {
  Excellent: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  Good: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  Fair: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  Poor: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
};

export function ratingBadgeClasses(rating: Rating): string {
  return RATING_STYLES[rating];
}

export function scoreBarClasses(score: number): string {
  if (score >= 75) return "bg-emerald-500";
  if (score >= 55) return "bg-sky-500";
  if (score >= 35) return "bg-amber-500";
  return "bg-rose-500";
}
