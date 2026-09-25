import { prisma } from "@/lib/prisma";
import { PostEditor } from "../post-editor";

export const metadata = { title: "New Post — Admin" };

export default async function NewPostPage() {
  const categories = await prisma.blogCategory.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <PostEditor
      initial={null}
      categories={categories}
      uploadsEnabled={Boolean(process.env.UPLOADTHING_TOKEN)}
    />
  );
}
