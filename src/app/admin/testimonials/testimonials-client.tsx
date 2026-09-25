"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { Dialog, FormField, inputClasses } from "@/components/admin/ui/dialog";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { DataTable, PageToolbar, TableEmptyState } from "@/components/admin/ui/table";
import { deleteTestimonial, saveTestimonial } from "@/app/admin/entity-actions";
import type { TestimonialView } from "@/lib/entities";

type Row = TestimonialView & { id: string; order: number };

type FormState = {
  id: string | null;
  quote: string;
  name: string;
  role: string;
  avatar: string;
  order: number;
};

const EMPTY: FormState = {
  id: null,
  quote: "",
  name: "",
  role: "",
  avatar: "/images/avatar-p1.jpg",
  order: 0,
};

export function TestimonialsClient({
  rows,
  uploadsEnabled,
}: {
  rows: Row[];
  uploadsEnabled: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Row | null>(null);

  const openCreate = () => {
    setForm({ ...EMPTY, order: rows.length });
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (row: Row) => {
    setForm({
      id: row.id,
      quote: row.quote,
      name: row.name,
      role: row.role,
      avatar: row.avatar,
      order: row.order,
    });
    setFormError(null);
    setFormOpen(true);
  };

  const submit = () => {
    if (pending) return;
    setFormError(null);
    startTransition(async () => {
      const result = await saveTestimonial({
        id: form.id,
        quote: form.quote,
        name: form.name,
        role: form.role,
        avatar: form.avatar,
        order: form.order,
      });
      if (result.ok) {
        setFormOpen(false);
        router.refresh();
      } else {
        setFormError(result.message);
      }
    });
  };

  const confirmDelete = () => {
    if (pending || !deleteTarget) return;
    startTransition(async () => {
      const result = await deleteTestimonial(deleteTarget.id);
      if (result.ok) {
        setDeleteTarget(null);
        router.refresh();
      }
    });
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 pb-16">
      <PageToolbar
        title="Testimonials"
        description="Patient quotes shown in the homepage carousel and the doctors page. Lower Order numbers appear first."
      >
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_-14px_rgb(47_118_109/0.6)] transition-all duration-200 hover:bg-primary-dark"
        >
          <Plus className="size-4" aria-hidden="true" />
          Add Testimonial
        </button>
      </PageToolbar>

      <DataTable headers={["Patient", "Role", "Quote", "Order", ""]}>
        {rows.length === 0 ? (
          <TableEmptyState
            message="No testimonials yet"
            hint="Add a patient quote to fill the public carousel."
          />
        ) : (
          rows.map((row) => (
            <tr key={row.id} className="group transition-colors duration-200 hover:bg-secondary/40">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3.5">
                  <Image
                    src={row.avatar}
                    alt={`Portrait of ${row.name}`}
                    width={44}
                    height={44}
                    className="size-11 shrink-0 rounded-full object-cover"
                  />
                  <span className="font-heading text-[0.9375rem] font-bold text-foreground">
                    {row.name}
                  </span>
                </div>
              </td>
              <td className="px-5 py-4 text-sm whitespace-nowrap text-muted">{row.role}</td>
              <td className="max-w-sm px-5 py-4">
                <span className="block truncate font-accent text-[0.9375rem] text-foreground italic">
                  “{row.quote}”
                </span>
              </td>
              <td className="px-5 py-4 text-sm text-muted">{row.order}</td>
              <td className="px-5 py-4">
                <div className="flex justify-end gap-1.5 opacity-60 transition-opacity duration-200 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => openEdit(row)}
                    aria-label={`Edit testimonial by ${row.name}`}
                    className="flex size-9 items-center justify-center rounded-lg text-muted transition-colors duration-200 hover:bg-secondary hover:text-foreground"
                  >
                    <Pencil className="size-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(row)}
                    aria-label={`Remove testimonial by ${row.name}`}
                    className="flex size-9 items-center justify-center rounded-lg text-muted transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </DataTable>

      <Dialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={form.id ? "Edit Testimonial" : "Add Testimonial"}
        description="Changes publish to the public site immediately after saving."
      >
        <div className="space-y-5">
          <FormField label="Quote" htmlFor="testimonial-quote">
            <textarea
              id="testimonial-quote"
              rows={4}
              className={inputClasses}
              value={form.quote}
              placeholder="What did the patient experience?"
              onChange={(e) => setForm({ ...form, quote: e.target.value })}
            />
          </FormField>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Patient name" htmlFor="testimonial-name">
              <input
                id="testimonial-name"
                className={inputClasses}
                value={form.name}
                placeholder="Sophia Anderson"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </FormField>
            <FormField label="Role / treatment" htmlFor="testimonial-role">
              <input
                id="testimonial-role"
                className={inputClasses}
                value={form.role}
                placeholder="Patient — Cardiology"
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              />
            </FormField>
          </div>
          <div className="grid gap-5 sm:grid-cols-[1fr_7rem]">
            <ImageUploadField
              label="Avatar"
              value={form.avatar}
              canUpload={uploadsEnabled}
              onChange={(avatar) => setForm({ ...form, avatar })}
              aspect="square"
            />
            <FormField label="Order" htmlFor="testimonial-order">
              <input
                id="testimonial-order"
                type="number"
                className={inputClasses}
                value={form.order}
                onChange={(e) =>
                  setForm({ ...form, order: Number(e.target.value) })
                }
              />
            </FormField>
          </div>

          {formError && (
            <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {formError}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="rounded-xl px-5 py-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={pending}
              className="inline-flex min-w-28 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-dark disabled:opacity-50"
            >
              {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
              {form.id ? "Save Changes" : "Add Testimonial"}
            </button>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Remove testimonial"
        description={
          deleteTarget
            ? `The quote from “${deleteTarget.name}” will be removed from the public site. This cannot be undone.`
            : ""
        }
      >
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setDeleteTarget(null)}
            className="rounded-xl px-5 py-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmDelete}
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-red-700 disabled:opacity-50"
          >
            {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            Remove
          </button>
        </div>
      </Dialog>
    </div>
  );
}
