"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Link from "next/link";
import { FileText, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { Dialog, FormField, inputClasses } from "@/components/admin/ui/dialog";
import { DataTable, PageToolbar, TableEmptyState } from "@/components/admin/ui/table";
import { deleteCategory, saveCategory } from "@/app/admin/entity-actions";

type Row = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  postCount: number;
};

type FormState = { id: string | null; name: string; slug: string; description: string };

const EMPTY: FormState = { id: null, name: "", slug: "", description: "" };

export function CategoriesClient({ rows }: { rows: Row[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Row | null>(null);

  const openCreate = () => {
    setForm(EMPTY);
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (row: Row) => {
    setForm({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description ?? "",
    });
    setFormError(null);
    setFormOpen(true);
  };

  const submit = () => {
    if (pending) return;
    setFormError(null);
    startTransition(async () => {
      const result = await saveCategory({
        id: form.id,
        name: form.name,
        slug: form.slug,
        description: form.description,
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
      const result = await deleteCategory(deleteTarget.id);
      if (result.ok) {
        setDeleteTarget(null);
        router.refresh();
      }
    });
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 pb-16">
      <PageToolbar
        title="Blog Categories"
        description="Create and manage the categories posts are filed under. Posts in a deleted category become uncategorized."
      >
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_-14px_rgb(47_118_109/0.6)] transition-all duration-200 hover:bg-primary-dark"
        >
          <Plus className="size-4" aria-hidden="true" />
          New Category
        </button>
      </PageToolbar>

      <DataTable headers={["Category", "Slug", "Posts", ""]}>
        {rows.length === 0 ? (
          <TableEmptyState
            message="No categories yet"
            hint="Create one before writing your first post."
          />
        ) : (
          rows.map((row) => (
            <tr key={row.id} className="group transition-colors duration-200 hover:bg-secondary/40">
              <td className="px-5 py-4">
                <p className="font-heading text-[0.9375rem] font-bold text-foreground">
                  {row.name}
                </p>
                {row.description && (
                  <p className="mt-0.5 max-w-md truncate text-sm text-muted">
                    {row.description}
                  </p>
                )}
              </td>
              <td className="px-5 py-4">
                <code className="rounded-lg bg-secondary px-2.5 py-1 text-xs font-semibold text-primary-dark">
                  {row.slug}
                </code>
              </td>
              <td className="px-5 py-4">
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <FileText className="size-4 text-muted" aria-hidden="true" />
                  {row.postCount}
                </span>
              </td>
              <td className="px-5 py-4">
                <div className="flex justify-end gap-1.5 opacity-60 transition-opacity duration-200 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => openEdit(row)}
                    aria-label={`Edit ${row.name}`}
                    className="flex size-9 items-center justify-center rounded-lg text-muted transition-colors duration-200 hover:bg-secondary hover:text-foreground"
                  >
                    <Pencil className="size-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(row)}
                    aria-label={`Delete ${row.name}`}
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

      <p className="text-sm text-muted">
        Ready to write?{" "}
        <Link
          href="/admin/posts/new"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Create a blog post
        </Link>
      </p>

      <Dialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={form.id ? "Edit Category" : "New Category"}
        description="The slug is used in URLs; leave it empty to derive it from the name."
      >
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Name" htmlFor="category-name">
              <input
                id="category-name"
                className={inputClasses}
                value={form.name}
                placeholder="Heart Health"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </FormField>
            <FormField
              label="Slug (optional)"
              htmlFor="category-slug"
              help="lowercase-with-dashes"
            >
              <input
                id="category-slug"
                className={inputClasses}
                value={form.slug}
                placeholder="heart-health"
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
              />
            </FormField>
          </div>
          <FormField label="Description (optional)" htmlFor="category-description">
            <textarea
              id="category-description"
              rows={2}
              className={inputClasses}
              value={form.description}
              placeholder="What belongs in this category?"
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </FormField>

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
              {form.id ? "Save Changes" : "Create Category"}
            </button>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete category"
        description={
          deleteTarget
            ? `“${deleteTarget.name}” will be removed. ${deleteTarget.postCount} post(s) will become uncategorized.`
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
            Delete Category
          </button>
        </div>
      </Dialog>
    </div>
  );
}
