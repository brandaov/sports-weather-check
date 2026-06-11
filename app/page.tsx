import { CitySearch } from "./components/CitySearch";

export default function Home() {
  return (
    <div className="flex flex-1 justify-center bg-gradient-to-b from-sky-50 via-white to-white px-6 py-16 dark:from-slate-950 dark:via-slate-950 dark:to-black sm:py-24">
      <main className="flex w-full max-w-3xl flex-col gap-12">
        <header className="flex flex-col items-center gap-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-1.5 text-sm font-medium text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
            Sports Weather Check
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
            Where should you go this week?
          </h1>
          <p className="max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-400">
            Enter a city to see how good the next 7 days look for skiing,
            surfing, and indoor or outdoor sightseeing.
          </p>
        </header>

        <CitySearch />
      </main>
    </div>
  );
}
