import Link from "next/link";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";

type LinkButtonProps = Omit<ComponentProps<typeof Button>, "render" | "nativeButton"> & {
  href: string;
};

/**
 * shadcn Button that navigates: wraps Next.js Link via Base UI's `render`
 * prop and sets `nativeButton={false}` (required for non-button elements).
 */
export function LinkButton({ href, ...props }: LinkButtonProps) {
  return (
    <Button render={<Link href={href} />} nativeButton={false} {...props} />
  );
}
