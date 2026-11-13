"use client";

import { useTheme } from "next-themes";
import { Contrast } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon-lg"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="rounded-full bg-card shadow-sm hover:bg-muted dark:border-foreground/10 dark:bg-foreground/5 dark:hover:bg-foreground/10"
    >
      <Contrast className="size-4" />
    </Button>
  );
}
