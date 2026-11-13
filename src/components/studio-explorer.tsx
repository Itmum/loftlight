"use client";

import { useState } from "react";
import { StudioCard } from "@/components/studio-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Studio } from "@/lib/studio";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="mt-8 rounded-2xl border border-dashed border-border bg-card p-12 text-center">
      <p className="font-serif text-lg font-medium text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
    </div>
  );
}

export function StudioExplorer({ studios }: { studios: Studio[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<SortValue>("newest");

  const categories = [
    "All",
    ...Array.from(new Set(studios.map((studio) => studio.category))),
  ];

  const visible = studios
    .filter((studio) => category === "All" || studio.category === category)
    .filter((studio) => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return (
        studio.title.toLowerCase().includes(q) ||
        studio.location.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.hourlyRate - b.hourlyRate;
        case "price-desc":
          return b.hourlyRate - a.hourlyRate;
        case "rating":
          return (b.rating ?? 0) - (a.rating ?? 0);
        default:
          return (b.createdAt ?? "").localeCompare(a.createdAt ?? "");
      }
    });

  return (
    <>
      {/* Search, category filters, and sort */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search studios..."
          aria-label="Search studios"
          className="h-11 w-full max-w-64 rounded-full border-border bg-card px-5 text-sm shadow-xs"
        />

        <div className="flex flex-wrap items-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={cn(
                "h-10 rounded-full border px-4 text-sm font-medium transition-colors",
                category === c
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-foreground hover:border-foreground/40",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <Select value={sort} onValueChange={(value) => setSort(value as SortValue)}>
          <SelectTrigger
            aria-label="Sort studios"
            className="ml-auto h-11 rounded-full border-border bg-card px-5 text-sm shadow-xs data-[size=default]:h-11"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-2xl">
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      {studios.length === 0 ? (
        <EmptyState
          title="No studios available right now"
          hint="Check back soon for newly listed creative spaces."
        />
      ) : visible.length === 0 ? (
        <EmptyState
          title="No studios match your search"
          hint="Try a different keyword or category."
        />
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((studio) => (
            <StudioCard key={studio._id} studio={studio} />
          ))}
        </div>
      )}
    </>
  );
}
