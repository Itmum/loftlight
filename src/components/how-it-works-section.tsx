const steps = [
  {
    title: "Discover spaces",
    description: "Filter by category, price and city.",
  },
  {
    title: "Select shoot hours",
    description: "Pick a date, start time and duration.",
  },
  {
    title: "Book instantly",
    description: "See the total up front. No surprises.",
  },
  {
    title: "Create & produce",
    description: "Show up, set up, make the thing.",
  },
] as const;

const hostSteps = [
  { title: "List your space" },
  { title: "Set your hours & price" },
  { title: "Approve bookings" },
  { title: "Get paid" },
] as const;

function StepCard({
  index,
  title,
  description,
}: {
  index: number;
  title: string;
  description?: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6">
      <p className="font-serif text-5xl font-bold text-primary">{index}</p>
      <h3 className="mt-4 font-serif text-xl font-bold tracking-tight text-card-foreground">
        {title}
      </h3>
      {description ? (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

function StepGrid({
  heading,
  steps,
}: {
  heading: string;
  steps: readonly { title: string; description?: string }[];
}) {
  return (
    <div>
      <h2 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        {heading}
      </h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <StepCard key={step.title} index={index + 1} {...step} />
        ))}
      </div>
    </div>
  );
}

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <div className="flex flex-col gap-16">
        <StepGrid heading="How Loftlight works" steps={steps} />
        <StepGrid heading="For hosts" steps={hostSteps} />
      </div>
    </section>
  );
}
