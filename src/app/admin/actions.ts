"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, requireEditor } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { getGroup } from "@/lib/content/registry";

export type ActionResult = { ok: boolean; message: string };

function revalidateAll() {
  // Content groups render on the homepage, inner pages and the admin area.
  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
}

export async function saveContentGroup(
  groupKey: string,
  valueJson: string,
): Promise<ActionResult> {
  try {
    const session = await requireEditor();
    const group = getGroup(groupKey);
    if (!group) {
      return { ok: false, message: "Unknown content group." };
    }

    let value: unknown;
    try {
      value = JSON.parse(valueJson);
    } catch {
      return { ok: false, message: "Editor data is corrupted — please retry." };
    }
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
      return { ok: false, message: "Invalid content payload." };
    }

    const savedBy = session.user.email ?? session.user.name;

    await prisma.siteContent.upsert({
      where: { key: groupKey },
      update: { value: value as object, updatedBy: savedBy },
      create: { key: groupKey, value: value as object, updatedBy: savedBy },
    });

    revalidateAll();
    return { ok: true, message: "Changes published to the site." };
  } catch (error) {
    console.error("[admin] saveContentGroup failed:", error);
    return { ok: false, message: "Could not save — check the server logs." };
  }
}

export async function resetContentGroup(
  groupKey: string,
): Promise<ActionResult> {
  try {
    await requireEditor();
    const group = getGroup(groupKey);
    if (!group) {
      return { ok: false, message: "Unknown content group." };
    }

    await prisma.siteContent.deleteMany({ where: { key: groupKey } });
    revalidateAll();
    return { ok: true, message: "Section restored to its original copy." };
  } catch (error) {
    console.error("[admin] resetContentGroup failed:", error);
    return { ok: false, message: "Could not reset — check the server logs." };
  }
}

/** Effective value (defaults + overrides) for one group, for the editor UI. */
export async function getGroupValue(groupKey: string): Promise<string> {
  await requireAdmin();
  const { getContent } = await import("@/lib/content/store");
  const content = await getContent();
  const group = getGroup(groupKey);
  const value =
    group && group.key in content
      ? (content[group.key as keyof typeof content] ?? {})
      : {};
  return JSON.stringify(value);
}
