/**
 * Seeds initial data: the first admin user (via Better Auth's full signup
 * flow so credentials are hashed correctly) plus the managed entities
 * (doctors, testimonials, blog categories & posts).
 *
 *   npm run db:seed
 *
 * Every step is idempotent — running it twice changes nothing.
 */
import "dotenv/config";
import { auth } from "../src/lib/auth";
import { prisma } from "../src/lib/prisma";
import { articles, type ArticleBlock } from "../src/lib/data";

const email = process.env.ADMIN_EMAIL ?? "admin@docavia.com";
const password = process.env.ADMIN_PASSWORD ?? "docavia2026";
const name = process.env.ADMIN_NAME ?? "Docavia Admin";

/** View-only staff account — can browse every admin page, can never edit. */
const DEMO_EMAIL = process.env.DEMO_EMAIL ?? "demo@docavia.com";
const DEMO_PASSWORD = process.env.DEMO_PASSWORD ?? "demo2026";

/* ---------------------------- article → HTML ------------------------------ */

function blocksToHtml(blocks: ArticleBlock[]): string {
  const parts: string[] = [];
  for (const block of blocks) {
    switch (block.type) {
      case "paragraph":
        parts.push(`<p>${block.text}</p>`);
        break;
      case "heading":
        parts.push(`<h2>${block.text}</h2>`);
        break;
      case "list":
        parts.push(
          `<ul>${block.items.map((item) => `<li>${item}</li>`).join("")}</ul>`,
        );
        break;
      case "quote":
        parts.push(`<blockquote><p>${block.text}</p></blockquote>`);
        break;
    }
  }
  return parts.join("");
}

const DOCTORS = [
  {
    name: "Dr. Emily Carter",
    specialty: "Cardiologist",
    bio: "Interventional cardiology with a preventive, lifestyle-first approach.",
    image: "/images/doctor-emily.jpg",
    order: 0,
  },
  {
    name: "Dr. James Wilson",
    specialty: "Neurologist",
    bio: "Specialist in headache medicine, sleep disorders and neuro-diagnostics.",
    image: "/images/doctor-james.jpg",
    order: 1,
  },
  {
    name: "Dr. Olivia Martin",
    specialty: "Pediatrician",
    bio: "Gentle, family-centered care from the first check-up to adolescence.",
    image: "/images/doctor-olivia.jpg",
    order: 2,
  },
  {
    name: "Dr. Daniel Brooks",
    specialty: "General Practitioner",
    bio: "Everyday medicine done thoroughly — prevention, screening and follow-up.",
    image: "/images/doctor-daniel.jpg",
    order: 3,
  },
];

const TESTIMONIALS = [
  {
    quote:
      "The entire experience was simple, professional and reassuring. From booking my appointment to meeting the doctor, everything felt effortless.",
    name: "Sophia Anderson",
    role: "Patient — Cardiology",
    avatar: "/images/patient-sophia.jpg",
    order: 0,
  },
  {
    quote:
      "I never feel like a number here. My doctor took time to explain every option and the follow-up care has been exceptional.",
    name: "Emma Collins",
    role: "Patient — Physiotherapy",
    avatar: "/images/avatar-p1.jpg",
    order: 1,
  },
  {
    quote:
      "Booking took two minutes and the reminders kept me on track. The clinic itself feels calm and genuinely welcoming.",
    name: "Rachel Nguyen",
    role: "Patient — Pediatrics",
    avatar: "/images/avatar-p3.jpg",
    order: 2,
  },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function seedAdmin() {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin already exists: ${email}`);
  } else {
    await auth.api.signUpEmail({ body: { name, email, password } });
    await prisma.user.update({
      where: { email },
      data: { role: "admin", emailVerified: true },
    });
    console.log(`Created admin user: ${email} (password from ADMIN_PASSWORD or 'docavia2026')`);
  }

  const demoExisting = await prisma.user.findUnique({ where: { email: DEMO_EMAIL } });
  if (demoExisting) {
    console.log(`Demo user already exists: ${DEMO_EMAIL}`);
  } else {
    await auth.api.signUpEmail({
      body: { name: "Demo Viewer", email: DEMO_EMAIL, password: DEMO_PASSWORD },
    });
    await prisma.user.update({
      where: { email: DEMO_EMAIL },
      data: { role: "demo", emailVerified: true },
    });
    console.log(`Created demo (read-only) user: ${DEMO_EMAIL} (password from DEMO_PASSWORD or 'demo2026')`);
  }
}

async function seedEntities() {
  const doctorCount = await prisma.doctor.count();
  if (doctorCount === 0) {
    await prisma.doctor.createMany({ data: DOCTORS });
    console.log(`Seeded ${DOCTORS.length} doctors`);
  }

  const testimonialCount = await prisma.testimonial.count();
  if (testimonialCount === 0) {
    await prisma.testimonial.createMany({ data: TESTIMONIALS });
    console.log(`Seeded ${TESTIMONIALS.length} testimonials`);
  }

  for (const article of articles) {
    const exists = await prisma.blogPost.findUnique({
      where: { slug: article.slug },
    });
    if (exists) continue;

    const category = await prisma.blogCategory.upsert({
      where: { slug: slugify(article.category) },
      update: {},
      create: {
        name: article.category,
        slug: slugify(article.category),
        description: `Articles about ${article.category.toLowerCase()}.`,
      },
    });

    await prisma.blogPost.create({
      data: {
        title: article.title,
        slug: article.slug,
        excerpt: article.description,
        coverImage: article.image,
        contentHtml: blocksToHtml(article.content),
        categoryId: category.id,
        authorName: article.author.name,
        authorRole: article.author.role,
        authorAvatar: article.author.avatar,
        readingTime: article.readingTime,
        published: true,
        publishedAt: new Date(article.publishedAt),
      },
    });
    console.log(`Seeded post: ${article.slug}`);
  }
}

async function main() {
  await seedAdmin();
  await seedEntities();
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
