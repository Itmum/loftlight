import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteLogo } from "@/components/site-logo";

const exploreLinks = [
  { href: "/", label: "Home" },
  { href: "/explore-studios", label: "Studios" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#about", label: "About" },
] as const;

const categoryLinks = [
  "Photo Studios",
  "Sound Stages",
  "Podcast Rooms",
  "Music Suites",
] as const;

function FooterHeading({ children }: { children: string }) {
  return (
    <h3 className="font-serif text-lg font-bold text-foreground">{children}</h3>
  );
}

function FooterLinks({
  heading,
  links,
}: {
  heading: string;
  links: readonly { href: string; label: string }[];
}) {
  return (
    <div>
      <FooterHeading>{heading}</FooterHeading>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-[0.95rem] text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcons() {
  return (
    <div className="mt-6 flex items-center gap-4">
      <a
        href="#"
        aria-label="X (Twitter)"
        className="text-foreground transition-colors hover:text-primary"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-5 fill-current"
          aria-hidden="true"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>
      <a
        href="#"
        aria-label="Instagram"
        className="text-foreground transition-colors hover:text-primary"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-5 fill-none stroke-current"
          strokeWidth="2"
          aria-hidden="true"
        >
          <rect x="2" y="2" width="20" height="20" rx="6" />
          <circle cx="12" cy="12" r="4.5" />
          <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
        </svg>
      </a>
      <a
        href="#"
        aria-label="YouTube"
        className="text-foreground transition-colors hover:text-primary"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-5 fill-current"
          aria-hidden="true"
        >
          <path d="M8 5.5v13l11-6.5z" />
        </svg>
      </a>
    </div>
  );
}

function NewsletterForm() {
  return (
    <form className="mt-4 flex flex-col items-start gap-3">
      <Input
        type="email"
        required
        placeholder="you@email.com"
        aria-label="Email address"
        className="h-11 w-full rounded-full border-transparent bg-foreground px-5 text-background placeholder:text-background/50 dark:bg-input/30 dark:text-foreground dark:placeholder:text-muted-foreground"
      />
      <Button
        type="submit"
        className="h-11 rounded-full px-6 text-sm font-semibold"
      >
        Subscribe
      </Button>
    </form>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/50">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1.2fr]">
          <div>
            <SiteLogo />
            <p className="mt-4 max-w-xs text-[0.95rem] text-muted-foreground">
              Our mission: put every creator in the right room, at the right
              hour.
            </p>
            <SocialIcons />
          </div>
          <FooterLinks heading="Explore" links={exploreLinks} />
          <FooterLinks
            heading="Categories"
            links={categoryLinks.map((label) => ({
              href: "/explore-studios",
              label,
            }))}
          />
          <div>
            <FooterHeading>Newsletter</FooterHeading>
            <NewsletterForm />
          </div>
        </div>
        <p className="mt-12 text-sm text-muted-foreground">
          © 2026 Loftlight.{" "}
          <Link href="#" className="transition-colors hover:text-foreground">
            Terms
          </Link>{" "}
          &{" "}
          <Link href="#" className="transition-colors hover:text-foreground">
            Privacy
          </Link>
          .
        </p>
      </div>
    </footer>
  );
}
