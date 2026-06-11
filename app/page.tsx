import { CitySearch } from "./components/CitySearch";

export default function Home() {
  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-6 py-16 dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col gap-10">
        <header className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Where should you go this week?
          </h1>
          <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Enter a city to see how good the next 7 days look for skiing,
            surfing, and indoor or outdoor sightseeing.
          </p>
        </header>

        <CitySearch />
      </main>
    </div>
  );
}
