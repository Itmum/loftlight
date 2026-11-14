"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { toast } from "sonner";

import { LinkButton } from "@/components/link-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { SiteLogo } from "@/components/site-logo";
import { authClient } from "@/lib/auth-client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/explore-studios", label: "Explore Studios" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#about", label: "About Us" },
] as const;

// The links inside the logged-in dropdown (from your brief)
const userLinks = [
  // { href: "/dashboard", label: "Dashboard" },
  { href: "/add-studio", label: "Add New Studio" },
  { href: "/my-listing", label: "My Studio Listings" },
  { href: "/my-booking", label: "My Bookings" },
] as const;

const pillClasses = "h-9 rounded-full px-4 text-sm font-semibold";

// A link is "active" when you are on that page. Links with a #hash
// (like /#about) point inside the home page, so they never show as active.
const isActive = (href: string, pathname: string) => {
  if (href.includes("#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
};

function NavLinks() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
      {navLinks.map((link) => {
        const active = isActive(link.href, pathname);
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

// Hamburger menu shown on phones and tablets, where NavLinks is hidden
function MobileMenu() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

  return (
    <div className="md:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuGroup>
            {navLinks.map((link) => (
              <DropdownMenuItem
                key={link.label}
                render={<Link href={link.href} />}
                className={
                  isActive(link.href, pathname) ? "bg-accent font-semibold" : ""
                }
              >
                {link.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          {!session?.user && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem render={<Link href="/login" />}>
                  Login
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/signup" />}>
                  Register
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function AuthActions() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  // While the session loads, show a grey circle instead of text. This stops the
  // navbar from flashing "Login / Register" for a logged-in user.
  if (isPending) {
    return (
      <div
        aria-label="Loading account"
        className="size-9 animate-pulse rounded-full bg-muted"
      />
    );
  }

  const user = session?.user;

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("You’ve been logged out.");
          router.push("/");
          router.refresh();
        },
        onError: () => {
          toast.error("Couldn’t log you out. Please try again.");
        },
      },
    });
  };

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <LinkButton
          href="/login"
          variant="outline"
          className={`${pillClasses} hidden border-foreground/30 bg-transparent hover:bg-foreground/5 sm:inline-flex dark:border-foreground/30 dark:bg-transparent dark:hover:bg-foreground/10`}
        >
          Login
        </LinkButton>
        <LinkButton
          href="/signup"
          className={`${pillClasses} hidden sm:inline-flex`}
        >
          Register
        </LinkButton>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            title={user.name}
            aria-label={`Account menu for ${user.name}`}
          >
            <Avatar>
              <AvatarImage
                referrerPolicy="no-referrer"
                src={user.image ?? undefined}
                alt={user.name}
              />
              <AvatarFallback>
                {user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-56">
        {/* Shows the user's name and email at the top */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">
              {user.name}
            </span>
            <span className="text-xs font-normal text-muted-foreground">
              {user.email}
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {userLinks.map((link) => (
            <DropdownMenuItem
              key={link.href}
              render={<Link href={link.href} />}
            >
              {link.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" onClick={handleLogout}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
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
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
