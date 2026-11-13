import Link from "next/link";
import { House } from "lucide-react";

export function SiteLogo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-b from-[#e27a5f] to-[#c8553d] shadow-sm">
        <House className="size-5 text-[#faf5ec]" strokeWidth={2.25} />
      </span>
      <span className="font-serif text-[1.4rem] font-semibold tracking-tight text-foreground">
        Loftlight
      </span>
    </Link>
  );
}
