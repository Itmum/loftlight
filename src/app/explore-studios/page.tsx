import { Suspense } from "react";
import { StudioExplorer } from "@/components/studio-explorer";
import { API_URL, type Studio } from "@/lib/studio";

async function loadStudios(): Promise<Studio[]> {
  const res = await fetch(`${API_URL}/all-studios`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch studios");
  }
  return res.json();
}

async function StudioResults() {
  const studios = await loadStudios();
  return <StudioExplorer studios={studios} />;
}

function ExplorerSkeleton() {
  return (
    <div
      className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      aria-hidden="true"
    >
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10"
        >
          <div className="aspect-[3/2] w-full animate-pulse bg-muted" />
          <div className="space-y-3 p-5">
            <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
            <div className="h-10 w-full animate-pulse rounded-full bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ExploreStudiosPage() {
  return (
    <section className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Explore studios
        </h1>

        <Suspense fallback={<ExplorerSkeleton />}>
          <StudioResults />
        </Suspense>
      </div>
    </section>
  );
}
