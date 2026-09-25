import { prisma } from "@/lib/prisma";
import { DoctorsClient } from "./doctors-client";

export const metadata = { title: "Doctors — Admin" };

export default async function DoctorsPage() {
  const rows = await prisma.doctor.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return (
    <DoctorsClient
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
