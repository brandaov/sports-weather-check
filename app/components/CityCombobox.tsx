"use client";

import { KeyboardEvent, useId, useRef, useState } from "react";
import { CitySuggestion, useCitySuggestions } from "./useCitySuggestions";

interface CityComboboxProps {
  defaultValue: string;
  isPending: boolean;
  onSelect: (suggestion: CitySuggestion) => void;
}

export function CityCombobox({
  defaultValue,
  isPending,
  onSelect,
}: CityComboboxProps) {
  const [query, setQuery] = useState(defaultValue);
  const [hasSelection, setHasSelection] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const { suggestions, isLoading } = useCitySuggestions(hasSelection ? "" : query);

  const listboxId = useId();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showList = isOpen && suggestions.length > 0;

  function handleChange(value: string) {
    setQuery(value);
    setHasSelection(false);
    setIsOpen(true);
    setHighlighted(-1);
  }

  function choose(suggestion: CitySuggestion) {
    setQuery(suggestion.name);
    setHasSelection(true);
    setIsOpen(false);
    setHighlighted(-1);
    onSelect(suggestion);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setHighlighted((index) => Math.min(index + 1, suggestions.length - 1));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlighted((index) => Math.max(index - 1, 0));
      return;
    }
    if (event.key === "Enter" && showList && highlighted >= 0) {
      event.preventDefault();
      choose(suggestions[highlighted]);
      return;
    }
    if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <div className="relative flex-1">
      <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
        <SearchIcon />
      </span>

      <input
        type="text"
        name="city"
        value={query}
        role="combobox"
        aria-expanded={showList}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={
          highlighted >= 0 ? `${listboxId}-${highlighted}` : undefined
        }
        autoComplete="off"
        placeholder="Search a city, e.g. Chamonix"
        onChange={(event) => handleChange(event.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsOpen(true)}
        onBlur={() => {
          closeTimer.current = setTimeout(() => setIsOpen(false), 120);
        }}
        className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-12 text-base text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-sky-500 dark:focus:ring-sky-500/20"
      />

      {(isLoading || isPending) && (
        <span className="absolute inset-y-0 right-4 flex items-center text-sky-500">
          <Spinner />
        </span>
      )}

      {showList && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-10 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900"
          onMouseDown={(event) => {
            event.preventDefault();
            if (closeTimer.current) clearTimeout(closeTimer.current);
          }}
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.id}
              id={`${listboxId}-${index}`}
              role="option"
              aria-selected={index === highlighted}
              onMouseEnter={() => setHighlighted(index)}
              onClick={() => choose(suggestion)}
              className={`flex cursor-pointer items-center gap-3 px-4 py-3 text-left ${
                index === highlighted
                  ? "bg-sky-50 dark:bg-sky-500/10"
                  : "bg-transparent"
              }`}
            >
              <span className="text-slate-400">
                <PinIcon />
              </span>
              <span className="flex flex-col">
                <span className="text-sm font-medium text-slate-900 dark:text-slate-50">
                  {suggestion.name}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {[suggestion.region, suggestion.country]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="animate-spin" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
