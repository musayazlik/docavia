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
 * Guard for mutating server actions — demo accounts may look at everything
 * but can never change anything, so every write funnels through here.
 */
export async function requireEditor() {
  const session = await requireAdmin();
  if (isReadOnly(session)) {
    throw new Error("Read-only account");
  }
  return session;
}
