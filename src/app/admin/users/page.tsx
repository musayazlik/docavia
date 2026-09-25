import { prisma } from "@/lib/prisma";
import { UsersClient } from "./users-client";

export const metadata = { title: "Users — Admin" };

export default async function UsersPage() {
  const [rows, session] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "asc" } }),
    import("@/lib/auth-server").then((m) => m.getSession()),
  ]);

  return (
    <UsersClient
      currentUserId={session?.user.id ?? ""}
      rows={rows.map((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        role: row.role,
        emailVerified: row.emailVerified,
        createdAt: row.createdAt,
      }))}
    />
  );
}
