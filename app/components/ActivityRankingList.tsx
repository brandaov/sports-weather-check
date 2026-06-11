import { ActivityForecast } from "@/app/ranking";
import { ActivityScoreCard } from "./ActivityScoreCard";

export function ActivityRankingList({
  forecast,
}: {
  forecast: ActivityForecast;
}) {
  const { location, rankings } = forecast;

  return (
    <section className="flex w-full flex-col gap-5">
      <header className="border-b border-slate-200 pb-4 dark:border-slate-800">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          {[location.name, location.country].filter(Boolean).join(", ")}
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Activities ranked by the next 7 days of weather.
        </p>
      </header>

      <div className="flex flex-col gap-4">
        {rankings.map((ranking, index) => (
          <ActivityScoreCard
            key={ranking.id}
            ranking={ranking}
            position={index + 1}
          />
        ))}
      </div>
    </section>
  );
}
