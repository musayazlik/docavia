import { prisma } from "@/lib/prisma";
import { CategoriesClient } from "./categories-client";

export const metadata = { title: "Categories — Admin" };

export default async function CategoriesPage() {
  const rows = await prisma.blogCategory.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });

  return (
    <CategoriesClient
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
