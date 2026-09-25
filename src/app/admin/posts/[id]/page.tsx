import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession, isReadOnly } from "@/lib/auth-server";
import { PostEditor } from "../post-editor";

export const metadata = { title: "Edit Post — Admin" };

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, categories, session] = await Promise.all([
    prisma.blogPost.findUnique({ where: { id } }),
    prisma.blogCategory.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    getSession(),
  ]);
  if (!post) notFound();

  return (
    <PostEditor
      categories={categories}
      uploadsEnabled={Boolean(process.env.UPLOADTHING_TOKEN)}
      readOnly={isReadOnly(session)}
      initial={{
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        contentHtml: post.contentHtml,
        categoryId: post.categoryId,
        authorName: post.authorName,
        authorRole: post.authorRole ?? "",
        authorAvatar: post.authorAvatar ?? "",
        readingTime: post.readingTime,
        published: post.published,
      }}
    />
  );
}
