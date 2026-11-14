import { Loader2 } from "lucide-react";

const LoadingPage = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4"
    >
      {/* Loftlight logo mark: roofline with a rising sun */}
      <svg
        width="56"
        height="56"
        viewBox="0 0 40 40"
        className="animate-pulse text-primary"
        aria-hidden="true"
      >
        <rect width="40" height="40" rx="12" fill="currentColor" />
        <path
          d="M8 32V19L20 9l12 10v13"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="M13 32a7 7 0 0114 0" fill="#E0A93B" />
      </svg>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        <span>Loading Loftlight…</span>
      </div>
    </div>
  );
};

export default LoadingPage;
