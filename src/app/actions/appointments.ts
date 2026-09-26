"use server";

import { prisma } from "@/lib/prisma";

export type AppointmentResult = { ok: boolean; message: string };

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

    await prisma.appointment.create({
      data: {
        name,
        phone,
        email: email || null,
        department,
        doctor: str(input.doctor) || null,
        date,
        timeSlot: str(input.timeSlot) || null,
        visitType: str(input.visitType) === "video" ? "video" : "in-person",
        notes: str(input.notes).slice(0, 2000) || null,
        status: "new",
      },
    });

    return { ok: true, message: "Request received." };
  } catch (error) {
    console.error("[appointments] createAppointment failed:", error);
    return {
      ok: false,
      message: "Could not submit right now — please call us instead.",
    };
  }
}
