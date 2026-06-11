import { ActivityRanking } from "@/lib/activities";
import {
  formatDayAndMonth,
  formatWeekday,
  ratingBadgeClasses,
  scoreBarClasses,
} from "./format";

export function ActivityScoreCard({
  ranking,
  position,
}: {
  ranking: ActivityRanking;
  position: number;
}) {
  return (
    <article className="rounded-2xl border border-black/[.08] bg-white p-6 shadow-sm dark:border-white/[.1] dark:bg-zinc-900">
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-full bg-zinc-100 text-sm font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            {position}
          </span>
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {ranking.label}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {ranking.description}
            </p>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-sm font-medium ${ratingBadgeClasses(ranking.rating)}`}
        >
          {ranking.rating}
        </span>
      </header>

      <p className="mt-5 flex items-baseline gap-2">
        <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          {ranking.overallScore}
        </span>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          / 100 average over 7 days
        </span>
      </p>

      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
        Best day: {formatWeekday(ranking.bestDay.date)} — {ranking.bestDay.reason}
      </p>

      <ol className="mt-5 grid grid-cols-7 gap-2">
        {ranking.dailyScores.map((day) => (
          <li key={day.date} className="text-center" title={day.reason}>
            <span className="block text-xs font-medium text-zinc-500 dark:text-zinc-400">
              {formatWeekday(day.date)}
            </span>
            <span className="mt-1 block text-[0.65rem] text-zinc-400 dark:text-zinc-500">
              {formatDayAndMonth(day.date)}
            </span>
            <div className="mt-2 flex h-20 items-end rounded-md bg-zinc-100 dark:bg-zinc-800">
              <div
                className={`w-full rounded-md ${scoreBarClasses(day.score)}`}
                style={{ height: `${Math.max(day.score, 4)}%` }}
              />
            </div>
            <span className="mt-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-200">
              {day.score}
            </span>
          </li>
        ))}
      </ol>
    </article>
  );
}
