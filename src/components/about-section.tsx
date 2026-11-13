import { Star } from "lucide-react";

const stats = [
  { value: "120+", label: "Studios" },
  { value: "4,800", label: "Hours booked" },
  { value: "4.8", label: "Average rating", starred: true },
] as const;

function StatCard({
  value,
  label,
  starred,
}: {
  value: string;
  label: string;
  starred?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6">
      <p className="flex items-center gap-1 font-serif text-4xl font-bold tracking-tight text-card-foreground">
        {value}
        {starred ? <Star className="size-6 fill-current" aria-hidden="true" /> : null}
      </p>
      <p className="mt-2 text-muted-foreground">{label}</p>
    </div>
  );
}

export function AboutSection() {
  return (
    <section id="about" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <div className="rounded-3xl bg-sage p-8 sm:p-12 lg:p-16">
        <p className="text-xs font-bold tracking-[0.18em] text-mustard uppercase">
          Our story
        </p>
        <h2 className="mt-4 max-w-4xl font-serif text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Great work needs the right room.
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-white/90">
          Loftlight began when a photographer couldn&rsquo;t find a daylight
          studio for a single afternoon. We built the marketplace we wished
          existed: clear prices, real availability, hosts you can trust.
        </p>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
    </section>
  );
}
