// components/featured-studios.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { StudioCard } from "@/components/studio-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Studio } from "@/lib/studio";
import { LinkButton } from "./link-button";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function FeaturedStudios() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedStudios() {
      try {
        const res = await fetch(`${API_URL}/all-studios`);
        if (!res.ok) throw new Error("Failed to fetch studios");
        const data: Studio[] = await res.json();

        // Sort by newest first (if createdAt exists)
        const sorted = data.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          }
          return 0;
        });

        // Take only the latest 6 studios for the home page
        setStudios(sorted.slice(0, 6));
      } catch (err) {
        console.error("Error loading featured studios:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedStudios();
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Featured studios
        </h2>

        <LinkButton
          variant="outline"
          className="rounded-full border-foreground/25 px-6 font-medium transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
          href="/explore-studios"
        >
          See all
        </LinkButton>
      </div>

      {/* Loading Skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4 rounded-2xl border p-4">
              <Skeleton className="aspect-[3/2] w-full rounded-xl" />
              <Skeleton className="h-7 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : studios.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center">
          <p className="text-muted-foreground">
            No studios have been published yet.
          </p>
        </div>
      ) : (
        /* Real Database Studios Grid */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {studios.map((studio) => (
            <StudioCard key={studio._id} studio={studio} />
          ))}
        </div>
      )}
    </section>
  );
}
