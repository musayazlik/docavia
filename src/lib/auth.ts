import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

/**
 * Better Auth — email & password only. The public site has no accounts;
 * this auth realm exists solely for Docavia staff (admin panel).
 *
 * The base URL is inferred per-request so the app works on any dev port.
 * In production set BETTER_AUTH_URL to the public site origin.
 */
export const auth = betterAuth({
  appName: "Docavia",
  trustedOrigins: (request) => {
    const origins: string[] = [];
    if (process.env.BETTER_AUTH_URL) origins.push(process.env.BETTER_AUTH_URL);
    // The panel runs on arbitrary ports in development (and `next start`
    // sets NODE_ENV=production), so localhost is trusted unconditionally.
    const origin = request?.headers?.get("origin") ?? "";
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      origins.push(origin);
    }
    return origins;
  },
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh once a day
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "admin",
        input: false,
      },
    },
  },
  advanced: {
    cookiePrefix: "docavia",
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
