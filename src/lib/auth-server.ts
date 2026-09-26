import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * Session for server components/actions. Cached per request so a page and
 * its layout share one DB round-trip.
 */
export const getSession = cache(async () => {
  try {
    return await auth.api.getSession({ headers: await headers() });
  } catch (error) {
    console.error("[auth] getSession failed:", error);
    return null;
  }
});

/**
 * Guard for /admin pages — redirects to the login screen when there is no
 * active session. Returns the session for user display purposes.
 */
export async function requireSession() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

/** Guard for privileged server actions — throws instead of redirecting. */
export async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

/** True when the account may view the panel but never edit (role "demo"). */
export function isReadOnly(session: { user: { role?: string | null } } | null) {
  return session?.user.role === "demo";
}

/**
 * The single hidden super-admin account. It holds every permission, never
 * appears in the Staff Users list and cannot be created, edited or deleted
 * through the panel — it is managed exclusively by the seed / env vars
 * (SUPERADMIN_EMAIL, SUPERADMIN_PASSWORD).
 */
export const SUPERADMIN_EMAIL = (
  process.env.SUPERADMIN_EMAIL ?? "superadmin@docavia.com"
).toLowerCase();

/**
 * Identifies the super-admin by role first and by the reserved email as a
 * fallback, so the account keeps its status even if either field drifts.
 * Accepts a session's `user` object or a raw Prisma user row.
 */
export function isSuperAdmin(
  user: { email?: string | null; role?: string | null } | null | undefined
) {
  if (!user) return false;
  return (
    user.role === "superadmin" ||
    (user.email ?? "").toLowerCase() === SUPERADMIN_EMAIL
  );
}

/** Message surfaced to demo accounts when the backend rejects a write. */
export const PERMISSION_DENIED_MESSAGE =
  "You don't have permission to perform this action. Ask an admin for access.";

/** Typed signal for write attempts from view-only (demo) accounts. */
export class PermissionDeniedError extends Error {
  constructor(message = PERMISSION_DENIED_MESSAGE) {
    super(message);
    this.name = "PermissionDeniedError";
  }
}

/**
 * Guard for mutating server actions — every write funnels through here and
 * demo accounts are rejected at the API layer, never hidden in the UI.
 */
export async function requireEditor() {
  const session = await requireAdmin();
  if (isReadOnly(session)) {
    throw new PermissionDeniedError();
  }
  return session;
}

/**
 * Map server-action failures: permission denials surface their own message,
 * unexpected errors are logged once and fall back to a friendly default.
 */
export function toActionError(error: unknown, fallback: string): string {
  if (error instanceof PermissionDeniedError) {
    return error.message;
  }
  console.error("[admin] action failed:", error);
  return fallback;
}
