import { prisma } from "@/lib/prisma";
import { getSession, isReadOnly } from "@/lib/auth-server";
import { TestimonialsClient } from "./testimonials-client";

export const metadata = { title: "Testimonials — Admin" };

export default async function TestimonialsPage() {
  const [rows, session] = await Promise.all([
    prisma.testimonial.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] }),
    getSession(),
  ]);

  return (
    <TestimonialsClient
      readOnly={isReadOnly(session)}
      uploadsEnabled={Boolean(process.env.UPLOADTHING_TOKEN)}
      rows={rows.map((row) => ({
        id: row.id,
        quote: row.quote,
        name: row.name,
        role: row.role,
        avatar: row.avatar,
        order: row.order,
      }))}
    />
  );
}
