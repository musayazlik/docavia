import lucideJsonRaw from "@iconify-json/lucide/icons.json";
import simpleIconsJsonRaw from "@iconify-json/simple-icons/icons.json";
import { getIconData } from "@iconify/utils";
import type { IconifyJSON } from "@iconify/types";

// JSON imports can arrive as { default: set } depending on the bundler.
function asIconSet(raw: unknown): IconifyJSON {
  const set = raw as { icons?: unknown; default?: unknown };
  if (set.icons) return raw as IconifyJSON;
  return (set.default ?? raw) as IconifyJSON;
}

/**
 * Server-side Iconify rendering. The admin picker and public components both
 * consume the small {viewBox, body} objects produced here, so the site never
 * pulls an icon runtime or calls the Iconify API — everything renders from
 * the two bundled offline sets (lucide + simple-icons).
 */

const LUCIDE = asIconSet(lucideJsonRaw);
const SIMPLE = asIconSet(simpleIconsJsonRaw);

export type RenderedIcon = {
  /** "0 0 24 24" style viewBox string. */
  viewBox: string;
  /** Raw SVG child elements (paths) — inject inside an <svg> wrapper. */
  body: string;
};

/** Names kept identical to the picker; plain = lucide, "brand:" = simple-icons. */
export function resolveIconData(
  name: string,
): RenderedIcon | null {
  if (!name) return null;
  const data = name.startsWith("brand:")
    ? getIconData(SIMPLE, name.slice("brand:".length))
    : getIconData(LUCIDE, name);
  if (!data) return null;
  const left = data.left ?? 0;
  const top = data.top ?? 0;
  const width = data.width ?? 24;
  const height = data.height ?? 24;
  return { viewBox: `${left} ${top} ${width} ${height}`, body: data.body };
}

/* ------------------------------ picker catalog ---------------------------- */

export type CatalogIcon = RenderedIcon & {
  /** Stored name — plain for lucide, "brand:x" for logos. */
  name: string;
  /** Display name without prefix. */
  label: string;
  group: "general" | "logos";
};

/** Brands most clinics actually link from the footer. */
const BRAND_NAMES = [
  "facebook",
  "instagram",
  "x",
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
  "apple",
  "android",
  "google",
  "googlemaps",
  "waze",
  "github",
  "slack",
  "dribbble",
  "behance",
  "medium",
  "substack",
  "twitch",
  "vimeo",
  "patreon",
  "threads",
  "bluesky",
  "mastodon",
  "signal",
  "doctolib",
];

const GENERAL_NAMES = [
  "heart-pulse",
  "stethoscope",
  "activity",
  "hospital",
  "ambulance",
  "pill",
  "syringe",
  "microscope",
  "baby",
  "brain",
  "bone",
  "eye",
  "smile",
  "heart",
  "hand-heart",
  "heart-handshake",
  "calendar-check",
  "calendar-clock",
  "clock",
  "hourglass",
  "phone",
  "phone-call",
  "mail",
  "map-pin",
  "globe",
  "at-sign",
  "message-circle",
  "contact",
  "users",
  "graduation-cap",
  "award",
  "star",
  "sparkles",
  "shield",
  "shield-check",
  "check-circle",
  "zap",
  "leaf",
  "sun",
  "moon",
  "apple",
  "coffee",
  "dumbbell",
  "bike",
  "armchair",
  "bed",
  "air-vent",
  "briefcase",
  "building",
  "home",
  "car",
  "plane",
  "laptop",
  "camera",
  "video",
  "monitor-play",
  "square-play",
  "music",
  "palette",
  "book-open",
  "book-open-check",
  "newspaper",
  "clipboard-list",
  "package",
  "wallet",
  "wifi",
  "languages",
  "lightbulb",
  "glasses",
  "help-circle",
  "life-buoy",
  "quote",
  "arrow-right",
];

function catalogItem(
  name: string,
  label: string,
  group: CatalogIcon["group"],
  json: IconifyJSON,
): CatalogIcon | null {
  const data = getIconData(json, name);
  if (!data) return null;
  const left = data.left ?? 0;
  const top = data.top ?? 0;
  return {
    name,
    label,
    group,
    viewBox: `${left} ${top} ${data.width ?? 24} ${data.height ?? 24}`,
    body: data.body,
  };
}

/** Full picker catalog — served to admins via /api/admin/icons. */
export function getIconCatalog(): CatalogIcon[] {
  const items: CatalogIcon[] = [];
  for (const name of GENERAL_NAMES) {
    const item = catalogItem(name, name, "general", LUCIDE);
    if (item) items.push(item);
  }
  for (const name of BRAND_NAMES) {
    const item = catalogItem(name, name, "logos", SIMPLE);
    if (item) items.push({ ...item, name: `brand:${name}` });
  }
  return items;
}
