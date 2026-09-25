import { prisma } from "@/lib/prisma";
import { getSession, isReadOnly } from "@/lib/auth-server";
import { CategoriesClient } from "./categories-client";

export const metadata = { title: "Categories — Admin" };

export default async function CategoriesPage() {
  const [rows, session] = await Promise.all([
    prisma.blogCategory.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { posts: true } } },
    }),
    getSession(),
  ]);

  return (
    <CategoriesClient
      readOnly={isReadOnly(session)}
      rows={rows.map((row) => ({
        id: row.id,
        name: row.name,
        slug: row.slug,
        description: row.description,
        postCount: row._count.posts,
      }))}
    />
  );
}
