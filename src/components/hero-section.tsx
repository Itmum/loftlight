"use client";

import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { LinkButton } from "@/components/link-button";
import {
  HouseIllustration,
  MicIllustration,
  RoomIllustration,
} from "@/components/hero-illustrations";
import { cn } from "@/lib/utils";

const slides = [
  {
    title: "Own a space? Let it earn.",
    description:
      "List your studio for free and welcome creators who treat it with care.",
    Illustration: HouseIllustration,
  },
  {
    title: "Light, sound, space. By the hour.",
    description:
      "Compare verified studios across the city and reserve in under a minute.",
    Illustration: MicIllustration,
  },
  {
    title: "Find the room that fits your story",
    description:
      "Book photo studios, stages and podcast lounges by the hour, with prices you can see.",
    Illustration: RoomIllustration,
  },
] as const;

const eyebrow = "Creative Workspace Marketplace";

function SlideIndicators({
  count,
  current,
  onSelect,
}: {
  count: number;
  current: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="mt-auto flex items-center gap-2 pt-10">
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          type="button"
          aria-label={`Go to slide ${index + 1}`}
          aria-current={index === current}
          onClick={() => onSelect(index)}
          className={cn(
            "rounded-full transition-all",
            index === current
              ? "h-2 w-6 bg-primary"
              : "size-2 bg-muted-foreground/40 hover:bg-muted-foreground/60",
          )}
        />
      ))}
    </div>
  );
}

export function HeroSection() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    api.on("reInit", onSelect);
  }, [api]);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pt-6 pb-16 sm:px-6">
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        className="overflow-hidden rounded-3xl border border-border/60 bg-card"
      >
        <CarouselContent className="ml-0">
          {slides.map((slide, index) => {
            const TitleTag = index === 0 ? "h1" : "h2";
            return (
              <CarouselItem key={slide.title} className="pl-0">
                <div className="grid lg:min-h-[560px] lg:grid-cols-[1.15fr_1fr]">
                  <div className="flex flex-col p-8 sm:p-12 lg:p-16">
                    <p className="text-xs font-bold tracking-[0.18em] text-primary uppercase">
                      {eyebrow}
                    </p>
                    <TitleTag className="mt-6 font-serif text-4xl leading-[1.05] font-bold tracking-tight text-card-foreground sm:text-5xl md:text-6xl xl:text-[4.25rem]">
                      {slide.title}
                    </TitleTag>
                    <p className="mt-6 max-w-md text-lg text-muted-foreground">
                      {slide.description}
                    </p>
                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      <LinkButton
                        href="/explore-studios"
                        className="h-11 rounded-full px-6 text-sm font-semibold"
                      >
                        Explore Studios
                      </LinkButton>
                      <LinkButton
                        href="/add-studio"
                        variant="outline"
                        className="h-11 rounded-full border-card-foreground/60 bg-transparent px-6 text-sm font-semibold text-card-foreground hover:border-card-foreground hover:bg-card-foreground/10 hover:text-card-foreground dark:border-card-foreground/60 dark:bg-transparent dark:text-card-foreground dark:hover:bg-card-foreground/10"
                      >
                        Host Your Space
                      </LinkButton>
                    </div>
                    <SlideIndicators
                      count={slides.length}
                      current={current}
                      onSelect={(index) => api?.scrollTo(index)}
                    />
                  </div>
                  <div className="relative h-64 overflow-hidden lg:h-auto">
                    <slide.Illustration />
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
