import { ActivityRanking } from "@/lib/activities";
import {
  activityIcon,
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
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex size-12 items-center justify-center rounded-xl bg-slate-100 text-2xl dark:bg-slate-800">
            <span aria-hidden="true">{activityIcon(ranking.id)}</span>
          </span>
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
              <span className="text-sm font-normal text-slate-400">
                #{position}
              </span>
              {ranking.label}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
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

      <div className="mt-5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          {ranking.overallScore}
        </span>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          / 100 average over 7 days
        </span>
      </div>

      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        <span className="font-medium text-slate-700 dark:text-slate-200">
          Best day {formatWeekday(ranking.bestDay.date)}:
        </span>{" "}
        {ranking.bestDay.reason}
      </p>

      <ol className="mt-5 grid grid-cols-7 gap-2">
        {ranking.dailyScores.map((day) => (
          <li key={day.date} className="text-center" title={day.reason}>
            <span className="block text-xs font-medium text-slate-500 dark:text-slate-400">
              {formatWeekday(day.date)}
            </span>
            <span className="mt-0.5 block text-[0.65rem] text-slate-400 dark:text-slate-500">
              {formatDayAndMonth(day.date)}
            </span>
            <div className="mt-2 flex h-20 items-end rounded-lg bg-slate-100 dark:bg-slate-800">
              <div
                className={`w-full rounded-lg transition-all ${scoreBarClasses(day.score)}`}
                style={{ height: `${Math.max(day.score, 4)}%` }}
              />
            </div>
            <span className="mt-1 block text-xs font-semibold text-slate-700 dark:text-slate-200">
              {day.score}
            </span>
          </li>
        ))}
      </ol>
    </article>
  );
}
