"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { requireAdmin } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export type MediaItem = {
  id: string;
  url: string;
  filename: string;
  size: number | null;
  createdAt: string;
};

/** Latest uploads for the picker dialog (admin only). */
export async function listMedia(limit = 60): Promise<MediaItem[]> {
  try {
    await requireAdmin();
    const rows = await prisma.mediaAsset.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return rows.map((row) => ({
      id: row.id,
      url: row.url,
      filename: row.filename,
      size: row.size,
      createdAt: row.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("[media] listMedia failed:", error);
    return [];
  }
}

/** Register a manually-pasted URL so it becomes pickable later too. */
export async function registerMediaUrl(
  url: string,
  filename?: string,
): Promise<{ ok: boolean }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { ok: false };
    const trimmed = url.trim();
    if (!/^https?:\/\//.test(trimmed)) return { ok: false };
    await prisma.mediaAsset.upsert({
      where: { url: trimmed },
      update: {},
      create: {
        url: trimmed,
        filename: filename?.trim() || trimmed.split("/").pop() || "image",
        createdBy: session.user.id,
      },
    });
    return { ok: true };
  } catch (error) {
    console.error("[media] registerMediaUrl failed:", error);
    return { ok: false };
  }
}
