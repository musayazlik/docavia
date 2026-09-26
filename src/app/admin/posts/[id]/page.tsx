import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PostEditor } from "../post-editor";

export const metadata = { title: "Edit Post — Admin" };

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, categories] = await Promise.all([
    prisma.blogPost.findUnique({ where: { id } }),
    prisma.blogCategory.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);
  if (!post) notFound();

  return (
    <PostEditor
      categories={categories}
      uploadsEnabled={Boolean(process.env.UPLOADTHING_TOKEN)}
      initial={{
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        contentHtml: post.contentHtml,
        categoryId: post.categoryId,
        readingTime: post.readingTime,
        published: post.published,
      }}
    />
  );
}
