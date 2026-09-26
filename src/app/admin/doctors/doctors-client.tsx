"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  FormField,
  inputClasses,
} from "@/components/admin/ui/dialog";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { DataTable, PageToolbar, TableEmptyState } from "@/components/admin/ui/table";
import { deleteDoctor, saveDoctor } from "@/app/admin/entity-actions";
import { ActionMenu } from "@/components/admin/ui/actions-menu";
import type { DoctorView } from "@/lib/entities";
import { useToast } from "@/components/admin/toast";

type Row = DoctorView & { id: string; order: number };

type FormState = {
  id: string | null;
  name: string;
  specialty: string;
  bio: string;
  image: string;
  order: number;
};

const EMPTY: FormState = {
  id: null,
  name: "",
  specialty: "",
  bio: "",
  image: "/images/doctor-emily.jpg",
  order: 0,
};

export function DoctorsClient({
  rows,
  uploadsEnabled,
}: {
  rows: Row[];
  uploadsEnabled: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { toastSuccess, toastError } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [deleteTarget, setDeleteTarget] = useState<Row | null>(null);

  const openCreate = () => {
    setForm({ ...EMPTY, order: rows.length });
    setFormOpen(true);
  };

  const openEdit = (row: Row) => {
    setForm({
      id: row.id,
      name: row.name,
      specialty: row.specialty,
      bio: row.bio,
      image: row.image,
      order: row.order,
    });
    setFormOpen(true);
  };

  const submit = () => {
    if (pending) return;
    startTransition(async () => {
      const result = await saveDoctor({
        id: form.id,
        name: form.name,
        specialty: form.specialty,
        bio: form.bio,
        image: form.image,
        order: form.order,
      });
      if (result.ok) {
        setFormOpen(false);
        toastSuccess(result.message);
        router.refresh();
      } else {
        toastError(result.message);
      }
    });
  };

  const confirmDelete = () => {
    if (pending || !deleteTarget) return;
    startTransition(async () => {
      const result = await deleteDoctor(deleteTarget.id);
      if (!result.ok) {
        toastError(result.message);
        return;
      }
      if (result.ok) {
        setDeleteTarget(null);
        toastSuccess("Doctor removed.");
        router.refresh();
      }
    });
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 pb-16">
      <PageToolbar
        title="Doctors"
        description="The specialist cards shown on the homepage and the doctors page. Reorder with the Order field — lower numbers come first."
      >
        {(
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_-14px_rgb(47_118_109/0.6)] transition-all duration-200 hover:bg-primary-dark"
          >
            <Plus className="size-4" aria-hidden="true" />
            Add Doctor
          </button>
        )}
      </PageToolbar>

      <DataTable headers={["Doctor", "Specialty", "Short Bio", "Order", ""]}>
        {rows.length === 0 ? (
          <TableEmptyState message="No doctors yet" hint="Add the first specialist to populate the public grid." />
        ) : (
          rows.map((row) => (
            <tr key={row.id} className="group transition-colors duration-200 hover:bg-secondary/40">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3.5">
                  <Image
                    src={row.image}
                    alt={`Portrait of ${row.name}`}
                    width={44}
                    height={44}
                    className="size-11 shrink-0 rounded-xl object-cover"
                  />
                  <span className="font-heading text-[0.9375rem] font-bold text-foreground">
                    {row.name}
                  </span>
                </div>
              </td>
              <td className="px-5 py-4">
                <span className="rounded-full bg-primary-light px-3 py-1 text-xs font-bold text-primary-dark">
                  {row.specialty}
                </span>
              </td>
              <td className="max-w-sm px-5 py-4">
                <span className="block truncate text-sm text-muted">{row.bio}</span>
              </td>
              <td className="px-5 py-4 text-sm text-muted">{row.order}</td>
              <td className="px-5 py-4 text-right">
                <ActionMenu
                  label={`Actions for ${row.name}`}
                  items={[
                    { label: "Edit", icon: Pencil, onSelect: () => openEdit(row) },
                    {
                      label: "Delete",
                      icon: Trash2,
                      danger: true,
                      onSelect: () => setDeleteTarget(row),
                    },
                  ]}
                />
              </td>
            </tr>
          ))
        )}
      </DataTable>

      {/* Create / edit dialog */}
      <Dialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={form.id ? "Edit Doctor" : "Add Doctor"}
        description="Changes publish to the public site immediately after saving."
      >
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Name" htmlFor="doctor-name">
              <input
                id="doctor-name"
                className={inputClasses}
                value={form.name}
                placeholder="Dr. Emily Carter"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </FormField>
            <FormField label="Specialty" htmlFor="doctor-specialty">
              <input
                id="doctor-specialty"
                className={inputClasses}
                value={form.specialty}
                placeholder="Cardiologist"
                onChange={(e) => setForm({ ...form, specialty: e.target.value })}
              />
            </FormField>
          </div>
          <FormField label="Short bio" htmlFor="doctor-bio">
            <textarea
              id="doctor-bio"
              rows={3}
              className={inputClasses}
              value={form.bio}
              placeholder="One or two sentences about this doctor."
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </FormField>
          <div className="grid gap-5 sm:grid-cols-[1fr_7rem]">
            <ImageUploadField
              label="Portrait"
              value={form.image}
              canUpload={uploadsEnabled}
              onChange={(image) => setForm({ ...form, image })}
            />
            <FormField label="Order" htmlFor="doctor-order">
              <input
                id="doctor-order"
                type="number"
                className={inputClasses}
                value={form.order}
                onChange={(e) =>
                  setForm({ ...form, order: Number(e.target.value) })
                }
              />
            </FormField>
          </div>

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
              {form.id ? "Save Changes" : "Add Doctor"}
            </button>
          </div>
        </div>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Remove doctor"
        description={
          deleteTarget
            ? `“${deleteTarget.name}” will disappear from the public site. This cannot be undone.`
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
