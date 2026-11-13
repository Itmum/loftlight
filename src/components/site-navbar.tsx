"use client";

import { usePathname } from "next/navigation";
import { LinkButton } from "@/components/link-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { SiteLogo } from "@/components/site-logo";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/explore-studios", label: "Explore Studios" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#about", label: "About Us" },
] as const;

const pillClasses = "h-9 rounded-full px-4 text-sm font-semibold";

function NavLinks() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
      {navLinks.map((link) => {
        const active = link.href === "/" && pathname === "/";
        return (
          <LinkButton
            key={link.label}
            href={link.href}
            aria-current={active ? "page" : undefined}
            variant={active ? "default" : "ghost"}
            className={pillClasses}
          >
            {link.label}
          </LinkButton>
        );
      })}
    </nav>
  );
}

function AuthActions() {
  return (
    <div className="flex items-center gap-2">
      <LinkButton
        href="/login"
        variant="outline"
        className={`${pillClasses} border-foreground/30 bg-transparent hover:bg-foreground/5 dark:border-foreground/30 dark:bg-transparent dark:hover:bg-foreground/10`}
      >
        Login
      </LinkButton>
      <LinkButton href="/register" className={pillClasses}>
        Register
      </LinkButton>
    </div>
  );
}

export function SiteNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <SiteLogo />
        <div className="flex items-center gap-2 sm:gap-3">
          <NavLinks />
          <ThemeToggle />
          <AuthActions />
        </div>
      </div>
    </header>
  );
}
