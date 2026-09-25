import { cn } from "@/lib/utils";

/** Thin outlined medical cross used as a decorative accent. */
export function Cross({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={cn("text-primary/20", className)}
    >
      <path
        d="M18 4h12v14h14v12H30v14H18V30H4V18h14V4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Solid soft cross, for dark backgrounds. */
export function CrossSolid({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className={cn("text-primary/15", className)}
    >
      <path
        d="M18 4h12v14h14v12H30v14H18V30H4V18h14V4Z"
        fill="currentColor"
      />
    </svg>
  );
}
