import type { LucideIcon } from "lucide-react";
import { resolveIconData } from "@/lib/iconify";

/**
 * Server-rendered CMS icon: resolves a stored icon name ("ambulance",
 * "brand:facebook") from the bundled iconify sets and inlines the SVG.
 * Falls back to a lucide component when the name is empty or unknown.
 */
export function CmsIcon({
  name,
  fallback,
  className,
}: {
  name?: string | null;
  fallback?: LucideIcon;
  className?: string;
}) {
  const data = name ? resolveIconData(name) : null;
  if (data) {
    return (
      <svg
        viewBox={data.viewBox}
        className={className}
        fill="currentColor"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: data.body }}
      />
    );
  }
  if (fallback) {
    const Fallback = fallback;
    return <Fallback className={className} aria-hidden="true" />;
  }
  return null;
}
