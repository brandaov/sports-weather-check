"use client";

import { useActionState } from "react";
import { getActivityRanking } from "@/app/actions";
import { initialRankingState } from "@/app/ranking";
import { ActivityRankingList } from "./ActivityRankingList";

export function CitySearch() {
  const [state, submit, isPending] = useActionState(
    getActivityRanking,
    initialRankingState,
  );

  return (
    <div className="flex w-full flex-col gap-8">
      <form action={submit} className="flex w-full flex-col gap-3 sm:flex-row">
        <input
          type="text"
          name="city"
          defaultValue={state.city}
          placeholder="Search a city, e.g. Chamonix"
          aria-label="City"
          autoComplete="off"
          className="h-12 flex-1 rounded-full border border-black/[.1] bg-white px-5 text-base text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-white/[.15] dark:bg-zinc-900 dark:text-zinc-50"
        />
        <button
          type="submit"
          disabled={isPending}
          className="h-12 rounded-full bg-zinc-900 px-7 text-base font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {isPending ? "Checking…" : "Rank activities"}
        </button>
      </form>

      {state.status === "error" && (
        <p
          role="alert"
          className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
        >
          {state.error}
        </p>
      )}

      {state.status === "success" && state.forecast && (
        <ActivityRankingList forecast={state.forecast} />
      )}
    </div>
  );
}
