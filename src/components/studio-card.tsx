import Image from "next/image";
import { MapPin, Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { LinkButton } from "@/components/link-button";
import { StudioFallbackArtwork } from "@/components/studio-artwork";
import type { Studio } from "@/lib/studio";

export function StudioCard({ studio }: { studio: Studio }) {
  const coverImage = studio.images?.[0];
  const rating = studio.rating ?? 0;

  return (
    <Card className="group gap-0 rounded-2xl py-0 transition-shadow duration-200 hover:shadow-md">
      {/* Artwork with overlaid category + rating pills */}
      <div className="relative aspect-[3/2] w-full overflow-hidden">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={studio.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <StudioFallbackArtwork category={studio.category} />
        )}

        <span className="absolute top-3 left-3 rounded-full bg-card px-3 py-1 text-xs font-medium text-foreground shadow-sm">
          {studio.category}
        </span>

        {rating > 0 && (
          <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-mustard px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm">
            <Star className="size-3 fill-current" aria-hidden="true" />
            {rating.toFixed(1)}
          </span>
        )}
      </div>

      {/* Details */}
      <CardContent className="px-5 pt-5 pb-2">
        <h3 className="line-clamp-2 font-serif text-2xl font-bold tracking-tight text-card-foreground">
          {studio.title}
        </h3>

        <div className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0 text-primary" aria-hidden="true" />
          <span className="truncate">{studio.location}</span>
        </div>

        <div className="mt-4 flex items-baseline justify-between">
          <p className="font-serif text-xl font-bold text-primary">
            ${studio.hourlyRate}
            <span className="font-sans text-sm font-normal text-muted-foreground">
              {" "}
              / hr
            </span>
          </p>
          <span className="text-sm text-muted-foreground">
            Up to {studio.capacity}
          </span>
        </div>
      </CardContent>

      {/* Action */}
      <CardFooter className="border-t-0 bg-transparent px-5 pt-1 pb-5">
        <LinkButton
          href={`/studios/${studio._id}`}
          variant="outline"
          className="w-full rounded-full border-foreground/25 bg-transparent font-medium text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
        >
          View Details
        </LinkButton>
      </CardFooter>
    </Card>
  );
}
