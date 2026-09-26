import { prisma } from "@/lib/prisma";
import { getSession, SUPERADMIN_EMAIL } from "@/lib/auth-server";
import { UsersClient } from "./users-client";

export const metadata = { title: "Users — Admin" };

export default async function UsersPage() {
  // The hidden super-admin is filtered out server-side (by reserved email
  // and role), so it never reaches the Staff Users table.
  const [rows, session] = await Promise.all([
    prisma.user.findMany({
      where: {
        AND: [
          { email: { not: SUPERADMIN_EMAIL } },
          { OR: [{ role: null }, { role: { not: "superadmin" } }] },
        ],
      },
      orderBy: { createdAt: "asc" },
    }),
    getSession(),
  ]);

  return (
    <UsersClient
      currentUserId={session?.user.id ?? ""}
      uploadsEnabled={Boolean(process.env.UPLOADTHING_TOKEN)}
      rows={rows.map((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        image: row.image ?? "",
        role: row.role,
        emailVerified: row.emailVerified,
        createdAt: row.createdAt,
      }))}
    />
  );
}
