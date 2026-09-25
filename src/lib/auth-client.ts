import { createAuthClient } from "better-auth/client";

/**
 * Client-side Better Auth handle. Same-origin by default, so no baseURL is
 * needed — requests go to /api/auth/*.
 */
export const authClient = createAuthClient();

export const { signIn, signOut, useSession } = authClient;
