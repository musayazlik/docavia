"use server";

import { prisma } from "@/lib/prisma";

export type AppointmentResult = {
  ok: boolean;
  message: string;
  /** Lookup code returned to the patient (e.g. APT-7F3K2Q). */
  code?: string;
};

const CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

function generateCode(): string {
  let out = "";
  for (let i = 0; i < 6; i += 1) {
    out += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return `APT-${out}`;
}

/** "apt-abc123" / "ABC123" → "APT-ABC123" for tolerant lookup. */
function normalizeCode(value: string): string {
  const raw = value.trim().toUpperCase().replace(/\s+/g, "");
  if (!raw) return "";
  return raw.startsWith("APT-") ? raw : `APT-${raw}`;
}

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Public endpoint for the appointment form — no auth. Validates the payload,
 * stores the request as status "new" and never leaks internals to visitors.
 */
export async function createAppointment(input: {
  name: string;
  phone: string;
  email?: string;
  department: string;
  doctor?: string;
  date?: string;
  timeSlot?: string;
  visitType?: string;
  notes?: string;
  /** Honeypot — bots fill it, humans never see it. */
  website?: string;
}): Promise<AppointmentResult> {
  try {
    // Honeypot: pretend success so bots move on.
    if (str(input.website)) {
      return { ok: true, message: "Request received." };
    }

    const name = str(input.name);
    const phone = str(input.phone);
    const email = str(input.email);
    const department = str(input.department);

    if (!name || !phone || !department) {
      return {
        ok: false,
        message: "Name, phone and department are required.",
      };
    }
    if (name.length > 120 || phone.length > 40 || email.length > 160) {
      return { ok: false, message: "One of the fields is too long." };
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { ok: false, message: "That email address doesn't look right." };
    }

    let date: Date | null = null;
    if (str(input.date)) {
      const parsed = new Date(`${str(input.date)}T00:00:00`);
      if (Number.isNaN(parsed.getTime())) {
        return { ok: false, message: "The chosen date is invalid." };
      }
      date = parsed;
    }

    const doctor = str(input.doctor);
    const timeSlot = str(input.timeSlot);

    // Slot lock: a specific doctor can only be booked once per date + time.
    if (doctor && doctor !== "no-preference" && date && timeSlot) {
      const clash = await prisma.appointment.findFirst({
        where: {
          doctor,
          date,
          timeSlot,
          status: { not: "cancelled" },
        },
        select: { id: true },
      });
      if (clash) {
        return {
          ok: false,
          message:
            "That doctor is already booked at the chosen date and time — please pick a different slot or doctor.",
        };
      }
    }

    try {
      const code = generateCode();
      await prisma.appointment.create({
        data: {
          code,
          name,
          phone,
          email: email || null,
          department,
          doctor: doctor || null,
          date,
          timeSlot: timeSlot || null,
          visitType: str(input.visitType) === "video" ? "video" : "in-person",
          notes: str(input.notes).slice(0, 2000) || null,
          status: "new",
        },
      });
      return { ok: true, message: "Request received.", code };
    } catch (error) {
      // The partial unique index is the final guard against races.
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: string }).code === "P2002"
      ) {
        return {
          ok: false,
          message:
            "That doctor is already booked at the chosen date and time — please pick a different slot or doctor.",
        };
      }
      throw error;
    }
  } catch (error) {
    console.error("[appointments] createAppointment failed:", error);
    return {
      ok: false,
      message: "Could not submit right now — please call us instead.",
    };
  }
}

/* ------------------------------ Patient lookup ------------------------------ */

export type LookupResult = {
  ok: boolean;
  message: string;
  appointments?: Array<{
    code: string;
    name: string;
    department: string;
    doctor: string | null;
    date: string | null;
    timeSlot: string | null;
    visitType: string;
    status: string;
    createdAt: string;
  }>;
};

/**
 * Public lookup by appointment code or email. Returns the minimal fields a
 * patient needs to recognise and cancel their request.
 */
export async function lookupAppointments(input: {
  query: string;
}): Promise<LookupResult> {
  try {
    const query = str(input.query);
    if (!query) {
      return { ok: false, message: "Enter your appointment code or email." };
    }

    const isEmail = query.includes("@");
    if (isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(query)) {
      return { ok: false, message: "That email address doesn't look right." };
    }

    const rows = await prisma.appointment.findMany({
      where: isEmail
        ? { email: query.trim().toLowerCase() }
        : { code: normalizeCode(query) },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    if (rows.length === 0) {
      return {
        ok: false,
        message: isEmail
          ? "No appointments found for that email."
          : "No appointment found for that code.",
      };
    }

    return {
      ok: true,
      message: `Found ${rows.length} appointment${rows.length === 1 ? "" : "s"}.`,
      appointments: rows.map((row) => ({
        code: row.code,
        name: row.name,
        department: row.department,
        doctor: row.doctor,
        date: row.date ? row.date.toISOString() : null,
        timeSlot: row.timeSlot,
        visitType: row.visitType,
        status: row.status,
        createdAt: row.createdAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error("[appointments] lookupAppointments failed:", error);
    return { ok: false, message: "Lookup failed — please try again." };
  }
}

/** Public cancellation — the code acts as the capability token. */
export async function cancelAppointment(input: {
  code: string;
}): Promise<AppointmentResult> {
  try {
    const code = normalizeCode(str(input.code));
    if (!code) {
      return { ok: false, message: "Enter your appointment code." };
    }
    const row = await prisma.appointment.findUnique({ where: { code } });
    if (!row) {
      return { ok: false, message: "No appointment found for that code." };
    }
    if (row.status === "cancelled") {
      return { ok: false, message: "This appointment is already cancelled." };
    }
    if (row.status === "completed") {
      return {
        ok: false,
        message: "Completed appointments cannot be cancelled online.",
      };
    }
    await prisma.appointment.update({
      where: { code },
      data: { status: "cancelled" },
    });
    return { ok: true, message: "Your appointment has been cancelled." };
  } catch (error) {
    console.error("[appointments] cancelAppointment failed:", error);
    return { ok: false, message: "Cancellation failed — please try again." };
  }
}
