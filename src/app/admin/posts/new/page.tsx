import { prisma } from "@/lib/prisma";
import { getSession, isReadOnly } from "@/lib/auth-server";
import { PostEditor } from "../post-editor";

export const metadata = { title: "New Post — Admin" };

export default async function NewPostPage() {
  const [categories, session] = await Promise.all([
    prisma.blogCategory.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    getSession(),
  ]);

  return (
    <PostEditor
      initial={null}
      categories={categories}
      uploadsEnabled={Boolean(process.env.UPLOADTHING_TOKEN)}
      readOnly={isReadOnly(session)}
    />
  );
}
