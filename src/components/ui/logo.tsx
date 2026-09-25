import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  inverted = false,
  priority = false,
}: {
  className?: string;
  /** Solid-white variant (pulse line knocked out) for dark backgrounds. */
  inverted?: boolean;
  /** Eager-load the logo when it sits in the initial viewport (navbar). */
  priority?: boolean;
}) {
  return (
    <Image
      src={inverted ? "/logo-white.png" : "/logo.png"}
      alt="Docavia"
      width={1946}
      height={476}
      priority={priority}
      draggable={false}
      className={cn("h-10 w-auto", className)}
    />
  );
}
