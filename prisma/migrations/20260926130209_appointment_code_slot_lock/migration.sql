-- Add patient-facing lookup code.
ALTER TABLE "Appointment" ADD COLUMN "code" TEXT;
CREATE UNIQUE INDEX "Appointment_code_key" ON "Appointment"("code");
UPDATE "Appointment" SET "code" = 'APT-' || upper(substr(md5(random()::text || id), 1, 6)) WHERE "code" IS NULL;
ALTER TABLE "Appointment" ALTER COLUMN "code" SET NOT NULL;

-- Double-booking lock: one active appointment per doctor + date + time slot.
-- Cancelled appointments release their slot.
CREATE UNIQUE INDEX "appointments_slot_lock"
  ON "Appointment"("doctor", "date", "timeSlot")
  WHERE status <> 'cancelled'
    AND doctor IS NOT NULL
    AND date IS NOT NULL
    AND "timeSlot" IS NOT NULL;
