import { prisma } from "@/lib/prisma";
import { defaultContent } from "@/lib/content/defaults";

/**
 * Entity readers used by the public site. Managed entities (doctors,
 * testimonials, blog posts) live in dedicated tables; on any database
 * problem the site degrades to the bundled defaults / static content.
 */

export type DoctorView = {
  name: string;
  specialty: string;
  bio: string;
  image: string;
};

export type TestimonialView = {
  quote: string;
  name: string;
  role: string;
  avatar: string;
};

export async function getDoctors(): Promise<DoctorView[]> {
  try {
    const rows = await prisma.doctor.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    if (rows.length > 0) {
      return rows.map(({ name, specialty, bio, image }) => ({
        name,
        specialty,
        bio,
        image,
      }));
    }
  } catch (error) {
    console.error("[entities] getDoctors fell back to defaults:", error);
  }
  return defaultContent.doctors.items.map((item) => ({ ...item }));
}

export async function getTestimonials(): Promise<TestimonialView[]> {
  try {
    const rows = await prisma.testimonial.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    if (rows.length > 0) {
      return rows.map(({ quote, name, role, avatar }) => ({
        quote,
        name,
        role,
        avatar,
      }));
    }
  } catch (error) {
    console.error("[entities] getTestimonials fell back to defaults:", error);
  }
  return defaultContent.testimonials.items.map((item) => ({ ...item }));
}

export type PostListItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  category: string;
  readingTime: number;
  publishedAt: Date | null;
};

export async function getPublishedPosts(): Promise<PostListItem[] | null> {
  try {
    const rows = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      include: { category: true },
    });
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt,
      coverImage: row.coverImage,
      category: row.category?.name ?? "",
      readingTime: row.readingTime,
      publishedAt: row.publishedAt,
    }));
  } catch (error) {
    console.error("[entities] getPublishedPosts failed:", error);
    return null;
  }
}

export async function getPostBySlug(slug: string) {
  try {
    return await prisma.blogPost.findUnique({
      where: { slug },
      include: { category: true },
    });
  } catch (error) {
    console.error("[entities] getPostBySlug failed:", error);
    return null;
  }
}
