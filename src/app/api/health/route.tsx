"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

const ErrorPage = ({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return (
    <div
      role="alert"
      className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center"
    >
      <h2 className="font-serif text-3xl font-bold">
        We couldn’t load this page
      </h2>
      <p className="text-muted-foreground">
        Our server may be waking up. This can take up to a minute the first
        time. Please try again.
      </p>
      <div className="flex gap-3">
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant="outline" render={<Link href="/" />}>
          Back to home
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
