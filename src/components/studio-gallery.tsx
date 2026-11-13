"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { StudioFallbackArtwork } from "@/components/studio-artwork";
import type { Studio } from "@/lib/studio";

/**
 * Studio image gallery: swipeable photos with a category counter pill and
 * overlay arrows (only when there is more than one image). Falls back to
 * geometric artwork when the studio has no photos.
 */
export function StudioGallery({ studio }: { studio: Studio }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    api.on("reInit", onSelect);
  }, [api]);

  const images = studio.images ?? [];
  const multiple = images.length > 1;

  return (
    <Carousel
      setApi={setApi}
      opts={{ loop: multiple }}
      className="overflow-hidden rounded-3xl bg-card ring-1 ring-foreground/10"
    >
      <CarouselContent className="ml-0">
        {images.length > 0
          ? images.map((src, index) => (
              <CarouselItem key={src + index} className="pl-0">
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src={src}
                    alt={`${studio.title} — image ${index + 1}`}
                    fill
                    sizes="(min-width: 1024px) 66vw, 100vw"
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              </CarouselItem>
            ))
          : (
              <CarouselItem className="pl-0">
                <div className="relative aspect-[16/10] w-full">
                  <StudioFallbackArtwork category={studio.category} />
                </div>
              </CarouselItem>
            )}
      </CarouselContent>

      {/* Category + counter pill */}
      <div className="absolute top-4 left-4 z-10 flex items-center rounded-full bg-card px-3.5 py-1.5 text-xs font-medium text-foreground shadow-sm">
        {studio.category}
        {multiple && (
          <>
            <span aria-hidden="true" className="mx-1.5 opacity-50">
              ·
            </span>
            <span>
              {current + 1}/{images.length}
            </span>
          </>
        )}
      </div>

      {/* Overlay arrows, only for multiple images */}
      {multiple && (
        <>
          <button
            type="button"
            onClick={() => api?.scrollPrev()}
            aria-label="Previous image"
            className="absolute top-1/2 left-4 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-card text-foreground shadow-md transition-colors hover:bg-accent"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => api?.scrollNext()}
            aria-label="Next image"
            className="absolute top-1/2 right-4 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-card text-foreground shadow-md transition-colors hover:bg-accent"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </>
      )}
    </Carousel>
  );
}
