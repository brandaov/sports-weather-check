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
      <header>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          {location.name}
          {location.country ? `, ${location.country}` : ""}
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
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
