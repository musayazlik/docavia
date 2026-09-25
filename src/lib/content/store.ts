import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { defaultContent, type SiteContent } from "./defaults";

/**
 * Deep-merge sparse overrides over the default content tree.
 * Only plain objects are merged recursively; arrays and scalars replace.
 */
function merge<T>(base: T, override: unknown): T {
  if (
    override === null ||
    override === undefined ||
    typeof base !== "object" ||
    base === null ||
    Array.isArray(base) ||
    typeof override !== "object" ||
    Array.isArray(override)
  ) {
    return (override === undefined ? base : (override as T));
  }
  const out = { ...(base as Record<string, unknown>) };
  for (const [key, value] of Object.entries(override)) {
    out[key] = value in out ? merge(out[key], value) : value;
  }
  return out as T;
}

/**
 * Full site content: defaults deep-merged with the overrides saved from the
 * admin panel. One DB round-trip per request (deduplicated by React cache).
 * If the database is unreachable the site still renders with defaults.
 */
export const getContent = cache(async (): Promise<SiteContent> => {
  try {
    const rows = await prisma.siteContent.findMany();
    let content = defaultContent as SiteContent;
    for (const row of rows) {
      const group = row.key as keyof SiteContent;
      if (group in content) {
        content = {
          ...content,
          [group]: merge(content[group], row.value),
        };
      }
    }
    return content;
  } catch (error) {
    console.error("[content] Falling back to defaults:", error);
    return defaultContent;
  }
});

/** Raw overrides per group — used by the admin UI to show edit state. */
export async function getOverrides(): Promise<Record<string, unknown>> {
  try {
    const rows = await prisma.siteContent.findMany();
    return Object.fromEntries(rows.map((row) => [row.key, row.value]));
  } catch (error) {
    console.error("[content] Could not read overrides:", error);
    return {};
  }
}

/** Override metadata (updatedAt, updatedBy) per group for the dashboard. */
export async function getOverrideMeta(): Promise<
  Record<string, { updatedAt: Date; updatedBy: string | null }>
> {
  try {
    const rows = await prisma.siteContent.findMany({
      select: { key: true, updatedAt: true, updatedBy: true },
    });
    return Object.fromEntries(
      rows.map((row) => [
        row.key,
        { updatedAt: row.updatedAt, updatedBy: row.updatedBy },
      ]),
    );
  } catch (error) {
    console.error("[content] Could not read override meta:", error);
    return {};
  }
}
