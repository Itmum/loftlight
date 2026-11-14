import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Star } from "lucide-react";
import { StudioGallery } from "@/components/studio-gallery";
import { LinkButton } from "@/components/link-button";
import { API_URL, type Studio } from "@/lib/studio";
import BookingCard from "@/components/booking/bookingCard";

async function loadStudio(id: string): Promise<Studio> {
  const res = await fetch(`${API_URL}/all-studios/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    notFound();
  }
  return res.json();
}

function SectionHeading({ children }: { children: string }) {
  return (
    <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground">
      {children}
    </h2>
  );
}

export default async function StudioDetailPage({
  params,
}: PageProps<"/studios/[id]">) {
  const { id } = await params;
  const studio = await loadStudio(id);

  return (
    <section className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <Link
          href="/explore-studios"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to studios
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          {/* Gallery + details */}
          <div>
            <StudioGallery studio={studio} />

            <h1 className="mt-8 font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {studio.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4 text-primary" aria-hidden="true" />
                {studio.location}
              </span>
              {(studio.rating ?? 0) > 0 && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Star
                      className="size-4 fill-current text-foreground"
                      aria-hidden="true"
                    />
                    {studio.rating!.toFixed(1)}
                  </span>
                </>
              )}
              <span aria-hidden="true">·</span>
              <span>Up to {studio.capacity} people</span>
            </div>

            <div className="mt-8">
              <SectionHeading>Overview</SectionHeading>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {studio.overview}
              </p>
            </div>

            {(studio.amenities?.length ?? 0) > 0 && (
              <div className="mt-8">
                <SectionHeading>Amenities</SectionHeading>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {studio.amenities.map((amenity) => (
                    <li
                      key={amenity}
                      className="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-foreground"
                    >
                      {amenity}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8">
              <SectionHeading>Hosted by</SectionHeading>
              <div className="mt-3 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="grid size-10 shrink-0 place-items-center rounded-full bg-sage text-sm font-semibold text-white"
                >
                  {(studio.ownerName ?? "H").charAt(0).toUpperCase()}
                </span>
                <div>
                  <p className="font-semibold text-foreground">
                    {studio.ownerName ?? "Host"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Verified host · 42 bookings
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky booking card */}
          <BookingCard studio={studio}></BookingCard>
        </div>
      </div>
    </section>
  );
}
