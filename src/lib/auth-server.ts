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
