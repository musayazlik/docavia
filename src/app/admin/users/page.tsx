import { prisma } from "@/lib/prisma";
import { getSession, isReadOnly } from "@/lib/auth-server";
import { UsersClient } from "./users-client";

export const metadata = { title: "Users — Admin" };

export default async function UsersPage() {
  const [rows, session] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "asc" } }),
    getSession(),
  ]);

  return (
    <UsersClient
      currentUserId={session?.user.id ?? ""}
      readOnly={isReadOnly(session)}
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
