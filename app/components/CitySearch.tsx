"use client";

import { startTransition, useActionState } from "react";
import { getActivityRanking } from "@/app/actions";
import { initialRankingState } from "@/app/ranking";
import { ActivityRankingList } from "./ActivityRankingList";
import { CityCombobox } from "./CityCombobox";
import { CitySuggestion } from "./useCitySuggestions";

export function CitySearch() {
  const [state, submit, isPending] = useActionState(
    getActivityRanking,
    initialRankingState,
  );

  function submitSelection(suggestion: CitySuggestion) {
    const payload = new FormData();
    payload.set("city", suggestion.name);
    payload.set("location", JSON.stringify(toLocation(suggestion)));
    startTransition(() => submit(payload));
  }

  return (
    <div className="flex w-full flex-col gap-8">
      <form action={submit} className="flex w-full flex-col gap-3 sm:flex-row">
        <CityCombobox
          defaultValue={state.city}
          isPending={isPending}
          onSelect={submitSelection}
        />
        <button
          type="submit"
          disabled={isPending}
          className="h-14 shrink-0 rounded-2xl bg-sky-600 px-7 text-base font-medium text-white shadow-sm transition-colors hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
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

function toLocation(suggestion: CitySuggestion) {
  return {
    name: suggestion.name,
    country: suggestion.country,
    latitude: suggestion.latitude,
    longitude: suggestion.longitude,
    timezone: suggestion.timezone,
  };
}
