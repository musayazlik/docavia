import { prisma } from "@/lib/prisma";
import { getSession, isReadOnly } from "@/lib/auth-server";
import { DoctorsClient } from "./doctors-client";

export const metadata = { title: "Doctors — Admin" };

export default async function DoctorsPage() {
  const [rows, session] = await Promise.all([
    prisma.doctor.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] }),
    getSession(),
  ]);

  return (
    <DoctorsClient
      readOnly={isReadOnly(session)}
      uploadsEnabled={Boolean(process.env.UPLOADTHING_TOKEN)}
      rows={rows.map((row) => ({
        id: row.id,
        name: row.name,
        specialty: row.specialty,
        bio: row.bio,
        image: row.image,
        order: row.order,
      }))}
    />
  );
}
