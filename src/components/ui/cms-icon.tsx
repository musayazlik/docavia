import type { LucideIcon } from "lucide-react";
import { resolveIconData } from "@/lib/iconify";
import { cn } from "@/lib/utils";

/** Icons uploaded through the picker are stored as their CDN URL. */
function isRemoteIcon(name: string): boolean {
  return /^https?:\/\//.test(name);
}

/** Labels that auto-resolve to their simple-icons logo when no icon is picked. */
const BRAND_LABELS = new Set([
  "facebook",
  "instagram",
  "x",
  "twitter",
  "linkedin",
  "youtube",
  "tiktok",
  "whatsapp",
  "telegram",
  "snapchat",
  "pinterest",
  "reddit",
  "discord",
  "spotify",
  "threads",
  "bluesky",
  "mastodon",
  "signal",
]);

/**
 * Effective icon name for a CMS row: an explicitly picked icon wins;
 * otherwise a known brand label (e.g. "Instagram") maps to its logo.
 */
export function resolveCmsIconName(
  icon?: string | null,
  label?: string | null,
): string {
  const picked = icon?.trim();
  if (picked) return picked;
  const slug = label?.trim().toLowerCase();
  return slug && BRAND_LABELS.has(slug) ? `brand:${slug}` : "";
}

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
  const data = name && !isRemoteIcon(name) ? resolveIconData(name) : null;
  if (name && isRemoteIcon(name)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- CDN icon; currentColor branding does not apply
      <img src={name} alt="" className={cn(className, "object-contain")} />
    );
  }
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
