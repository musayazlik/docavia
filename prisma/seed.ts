/**
 * Seeds the first admin user via Better Auth's full signup flow
 * (so the credential account is hashed/salted correctly).
 *
 *   npm run db:seed
 *
 * Override with ADMIN_EMAIL / ADMIN_PASSWORD env vars (defaults are for
 * local development only).
 */
import "dotenv/config";
import { auth } from "../src/lib/auth";
import { prisma } from "../src/lib/prisma";

const email = process.env.ADMIN_EMAIL ?? "admin@docavia.com";
const password = process.env.ADMIN_PASSWORD ?? "docavia2026";
const name = process.env.ADMIN_NAME ?? "Docavia Admin";

async function main() {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin already exists: ${email} — nothing to do.`);
    return;
  }

  const result = await auth.api.signUpEmail({
    body: { name, email, password },
  });

  if ("token" in result && result.token) {
    // Email verification is disabled; the signup response carrying a token
    // just means the account was created in this request.
  }

  await prisma.user.update({
    where: { email },
    data: { role: "admin", emailVerified: true },
  });

  console.log(`Created admin user: ${email}`);
  console.log("Password: (from ADMIN_PASSWORD env or the default 'docavia2026')");
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
