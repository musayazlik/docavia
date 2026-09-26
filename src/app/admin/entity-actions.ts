"use server";

import { revalidatePath } from "next/cache";
import { hashPassword } from "better-auth/crypto";
import { auth } from "@/lib/auth";
import { requireEditor, toActionError, SUPERADMIN_EMAIL, isSuperAdmin } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export type ActionResult = { ok: boolean; message: string };

/**
 * Roles assignable through the panel. "superadmin" is deliberately absent —
 * the hidden super-admin account exists only via the seed / env vars.
 */
const ASSIGNABLE_ROLES = ["admin", "editor", "demo"];

function revalidateAll() {
  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/* ------------------------------- Doctors ---------------------------------- */

export async function saveDoctor(input: {
  id?: string | null;
  name: string;
  specialty: string;
  bio: string;
  image: string;
  order: number;
}): Promise<ActionResult> {
  try {
    await requireEditor();
    const name = str(input.name);
    const specialty = str(input.specialty);
    const bio = str(input.bio);
    const image = str(input.image) || "/images/doctor-emily.jpg";
    if (!name || !specialty || !bio) {
      return { ok: false, message: "Name, specialty and bio are required." };
    }
    const order = Number.isFinite(input.order) ? Math.trunc(input.order) : 0;

    if (input.id) {
      await prisma.doctor.update({
        where: { id: input.id },
        data: { name, specialty, bio, image, order },
      });
    } else {
      await prisma.doctor.create({ data: { name, specialty, bio, image, order } });
    }
    revalidateAll();
    return { ok: true, message: input.id ? "Doctor updated." : "Doctor added." };
  } catch (error) {
    return { ok: false, message: toActionError(error, "Could not save the doctor.") };
  }
}

export async function deleteDoctor(id: string): Promise<ActionResult> {
  try {
    await requireEditor();
    await prisma.doctor.delete({ where: { id } });
    revalidateAll();
    return { ok: true, message: "Doctor removed." };
  } catch (error) {
    return { ok: false, message: toActionError(error, "Could not remove the doctor.") };
  }
}

/* ------------------------------ Testimonials ------------------------------- */

export async function saveTestimonial(input: {
  id?: string | null;
  quote: string;
  name: string;
  role: string;
  avatar: string;
  order: number;
}): Promise<ActionResult> {
  try {
    await requireEditor();
    const quote = str(input.quote);
    const name = str(input.name);
    const role = str(input.role);
    const avatar = str(input.avatar) || "/images/avatar-p1.jpg";
    if (!quote || !name || !role) {
      return { ok: false, message: "Quote, name and role are required." };
    }
    const order = Number.isFinite(input.order) ? Math.trunc(input.order) : 0;

    if (input.id) {
      await prisma.testimonial.update({
        where: { id: input.id },
        data: { quote, name, role, avatar, order },
      });
    } else {
      await prisma.testimonial.create({
        data: { quote, name, role, avatar, order },
      });
    }
    revalidateAll();
    return {
      ok: true,
      message: input.id ? "Testimonial updated." : "Testimonial added.",
    };
  } catch (error) {
    return { ok: false, message: toActionError(error, "Could not save the testimonial.") };
  }
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  try {
    await requireEditor();
    await prisma.testimonial.delete({ where: { id } });
    revalidateAll();
    return { ok: true, message: "Testimonial removed." };
  } catch (error) {
    return { ok: false, message: toActionError(error, "Could not remove the testimonial.") };
  }
}

/* --------------------------------- Users ----------------------------------- */

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
  role: string;
}): Promise<ActionResult> {
  try {
    await requireEditor();
    const name = str(input.name);
    const email = str(input.email).toLowerCase();
    const password = typeof input.password === "string" ? input.password : "";
    const role = str(input.role) || "admin";

    if (!ASSIGNABLE_ROLES.includes(role)) {
      return {
        ok: false,
        message: "That role is not available. Choose admin, editor or demo.",
      };
    }
    if (email === SUPERADMIN_EMAIL) {
      return { ok: false, message: "That email is reserved and cannot be used." };
    }
    if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { ok: false, message: "A valid name and email are required." };
    }
    if (password.length < 8) {
      return {
        ok: false,
        message: "Password must be at least 8 characters long.",
      };
    }

    try {
      await auth.api.signUpEmail({ body: { name, email, password } });
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (/exist|duplicate|unique/i.test(message)) {
        return { ok: false, message: "That email is already registered." };
      }
      throw error;
    }

    await prisma.user.update({
      where: { email },
      data: { role, emailVerified: true },
    });

    revalidateAll();
    return { ok: true, message: `User ${email} created.` };
  } catch (error) {
    return { ok: false, message: toActionError(error, "Could not create the user.") };
  }
}

export async function updateUser(input: {
  id: string;
  name: string;
  role: string;
  image?: string;
  password?: string;
}): Promise<ActionResult> {
  try {
    const session = await requireEditor();
    const name = str(input.name);
    const role = str(input.role) || "admin";
    if (!name) return { ok: false, message: "Name is required." };
    if (!ASSIGNABLE_ROLES.includes(role)) {
      return {
        ok: false,
        message: "That role is not available. Choose admin, editor or demo.",
      };
    }

    const target = await prisma.user.findUnique({ where: { id: input.id } });
    if (!target) return { ok: false, message: "User not found." };
    if (isSuperAdmin(target)) {
      return {
        ok: false,
        message: "The super admin account is protected and cannot be edited here.",
      };
    }

    const image = typeof input.image === "string" ? input.image.trim() : "";
    await prisma.user.update({
      where: { id: input.id },
      data: { name, role, image: image || null },
    });

    const password =
      typeof input.password === "string" ? input.password.trim() : "";
    if (password.length > 0) {
      if (password.length < 8) {
        return {
          ok: false,
          message: "New password must be at least 8 characters.",
        };
      }
      // better-auth's credential accounts store the scrypt hash directly.
      await prisma.account.updateMany({
        where: { userId: input.id, providerId: "credential" },
        data: { password: await hashPassword(password) },
      });
    }

    revalidateAll();
    return {
      ok: true,
      message:
        session.user.id === input.id
          ? "Your profile was updated."
          : "User updated.",
    };
  } catch (error) {
    return { ok: false, message: toActionError(error, "Could not update the user.") };
  }
}

export async function deleteUser(input: {
  id: string;
}): Promise<ActionResult> {
  try {
    const session = await requireEditor();
    if (session.user.id === input.id) {
      return { ok: false, message: "You cannot delete your own account." };
    }
    const target = await prisma.user.findUnique({ where: { id: input.id } });
    if (target && isSuperAdmin(target)) {
      return {
        ok: false,
        message: "The super admin account is protected and cannot be deleted.",
      };
    }
    await prisma.user.delete({ where: { id: input.id } });
    revalidateAll();
    return { ok: true, message: "User deleted." };
  } catch (error) {
    return { ok: false, message: toActionError(error, "Could not delete the user.") };
  }
}

/* ------------------------------- Categories -------------------------------- */

export async function saveCategory(input: {
  id?: string | null;
  name: string;
  slug?: string;
  description?: string;
}): Promise<ActionResult> {
  try {
    await requireEditor();
    const name = str(input.name);
    if (!name) return { ok: false, message: "Category name is required." };
    const slug = str(input.slug) ? slugify(str(input.slug)!) : slugify(name);
    const description = str(input.description) || null;

    const clash = await prisma.blogCategory.findUnique({ where: { slug } });
    if (clash && clash.id !== input.id) {
      return { ok: false, message: `Slug "${slug}" is already in use.` };
    }

    if (input.id) {
      await prisma.blogCategory.update({
        where: { id: input.id },
        data: { name, slug, description },
      });
    } else {
      await prisma.blogCategory.create({ data: { name, slug, description } });
    }
    revalidateAll();
    return {
      ok: true,
      message: input.id ? "Category updated." : "Category created.",
    };
  } catch (error) {
    return { ok: false, message: toActionError(error, "Could not save the category.") };
  }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  try {
    await requireEditor();
    await prisma.blogCategory.delete({ where: { id } });
    revalidateAll();
    return { ok: true, message: "Category deleted. Its posts are now uncategorized." };
  } catch (error) {
    return { ok: false, message: toActionError(error, "Could not delete the category.") };
  }
}

/* ---------------------------------- Posts ---------------------------------- */

export async function savePost(input: {
  id?: string | null;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  contentHtml: string;
  contentJson?: object | null;
  categoryId?: string | null;
  readingTime: number;
  published: boolean;
}): Promise<ActionResult & { slug?: string }> {
  try {
    const session = await requireEditor();
    const title = str(input.title);
    const excerpt = str(input.excerpt);
    if (!title || !excerpt) {
      return { ok: false, message: "Title and excerpt are required." };
    }
    const slug = str(input.slug) ? slugify(str(input.slug)!) : slugify(title);
    if (!slug) return { ok: false, message: "Slug could not be derived." };
    if (!str(input.contentHtml)) {
      return { ok: false, message: "The article body is empty." };
    }

    const clash = await prisma.blogPost.findUnique({ where: { slug } });
    if (clash && clash.id !== input.id) {
      return { ok: false, message: `Slug "${slug}" is already in use.` };
    }

    const data = {
      title,
      slug,
      excerpt,
      coverImage: str(input.coverImage) || "/images/blog-heart.jpg",
      contentHtml: input.contentHtml,
      contentJson:
        input.contentJson && typeof input.contentJson === "object"
          ? input.contentJson
          : undefined,
      categoryId: input.categoryId || null,
      // Attribution follows the signed-in staff member, not free-text input.
      authorName: session.user.name?.trim() || "Docavia Team",
      authorRole: session.user.role || "admin",
      authorAvatar: session.user.image || null,
      readingTime:
        Number.isFinite(input.readingTime) && input.readingTime > 0
          ? Math.trunc(input.readingTime)
          : 4,
      published: input.published,
      publishedAt: input.published ? new Date() : null,
    };

    if (input.id) {
      const existing = await prisma.blogPost.findUnique({
        where: { id: input.id },
      });
      await prisma.blogPost.update({
        where: { id: input.id },
        data: {
          ...data,
          // Keep the original publish date when the post was already live.
          publishedAt: existing?.publishedAt ?? data.publishedAt,
        },
      });
    } else {
      await prisma.blogPost.create({ data });
    }

    revalidateAll();
    return {
      ok: true,
      message: input.id ? "Post updated." : "Post created.",
      slug,
    };
  } catch (error) {
    return { ok: false, message: toActionError(error, "Could not save the post.") };
  }
}

export async function setPostPublished(input: {
  id: string;
  published: boolean;
}): Promise<ActionResult> {
  try {
    await requireEditor();
    await prisma.blogPost.update({
      where: { id: input.id },
      data: {
        published: input.published,
        publishedAt: input.published ? new Date() : null,
      },
    });
    revalidateAll();
    return {
      ok: true,
      message: input.published ? "Post published." : "Post moved to drafts.",
    };
  } catch (error) {
    return { ok: false, message: toActionError(error, "Could not update the post.") };
  }
}

export async function deletePost(id: string): Promise<ActionResult> {
  try {
    await requireEditor();
    await prisma.blogPost.delete({ where: { id } });
    revalidateAll();
    return { ok: true, message: "Post deleted." };
  } catch (error) {
    return { ok: false, message: toActionError(error, "Could not delete the post.") };
  }
}
