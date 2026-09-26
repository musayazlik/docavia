import { prisma } from "@/lib/prisma";
import { AppointmentsClient } from "./appointments-client";

export const metadata = { title: "Appointments — Admin" };

export default async function AppointmentsPage() {
  const rows = await prisma.appointment.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  return (
    <AppointmentsClient
      rows={rows.map((row) => ({
        id: row.id,
        name: row.name,
        phone: row.phone,
        email: row.email,
        department: row.department,
        doctor: row.doctor,
        date: row.date ? row.date.toISOString() : null,
        timeSlot: row.timeSlot,
        visitType: row.visitType,
        notes: row.notes,
        status: row.status,
        createdAt: row.createdAt,
      }))}
    />
  );
}
