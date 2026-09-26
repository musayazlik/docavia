import { prisma } from "@/lib/prisma";
import { PostsClient } from "./posts-client";

export const metadata = { title: "Blog Posts — Admin" };

export default async function PostsPage() {
  const [rows] = await Promise.all([
    prisma.blogPost.findMany({
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      include: { category: true },
    }),
  ]);

  return (
    <PostsClient
      rows={rows.map((row) => ({
        id: row.id,
        title: row.title,
        slug: row.slug,
        excerpt: row.excerpt,
        coverImage: row.coverImage,
        category: row.category?.name ?? "",
        published: row.published,
        publishedAt: row.publishedAt,
        readingTime: row.readingTime,
      }))}
    />
  );
}
