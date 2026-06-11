"use client";

import { useEffect, useRef, useState } from "react";


export interface CitySuggestion {
  id: number;
  name: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

const MINIMUM_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 250;

const CITY_SUGGESTIONS_QUERY = /* GraphQL */ `
  query CitySuggestions($query: String!) {
    citySuggestions(query: $query) {
      id
      name
      region
      country
      latitude
      longitude
      timezone
    }
  }
`;

export function useCitySuggestions(query: string) {
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const cache = useRef(new Map<string, CitySuggestion[]>());

  const trimmed = query.trim();
  const isEnabled = trimmed.length >= MINIMUM_QUERY_LENGTH;

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      const cached = cache.current.get(trimmed);
      if (cached) {
        setSuggestions(cached);
        return;
      }

      setIsLoading(true);
      try {
        const matches = await fetchCitySuggestions(trimmed, controller.signal);
        cache.current.set(trimmed, matches);
        setSuggestions(matches);
      } catch {
        if (!controller.signal.aborted) {
          setSuggestions([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmed, isEnabled]);

  return {
    suggestions: isEnabled ? suggestions : [],
    isLoading: isEnabled && isLoading,
  };
}

async function fetchCitySuggestions(
  query: string,
  signal: AbortSignal,
): Promise<CitySuggestion[]> {
  const response = await fetch("/api/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: CITY_SUGGESTIONS_QUERY,
      variables: { query },
    }),
    signal,
  });

  const body = await response.json();
  return body.data?.citySuggestions ?? [];
}
