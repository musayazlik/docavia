"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2, Pencil, Plus, ShieldCheck, Trash2, UserRound } from "lucide-react";
import { Dialog, FormField, inputClasses } from "@/components/admin/ui/dialog";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { DataTable, PageToolbar, TableEmptyState } from "@/components/admin/ui/table";
import { SelectField } from "@/components/ui/select-field";
import { createUser, deleteUser, updateUser } from "@/app/admin/entity-actions";

type Row = {
  id: string;
  name: string;
  email: string;
  image: string;
  role: string | null;
  emailVerified: boolean;
  createdAt: Date;
};

type FormState = {
  id: string | null;
  name: string;
  email: string;
  image: string;
  password: string;
  role: string;
};

const EMPTY: FormState = {
  id: null,
  name: "",
  email: "",
  image: "",
  password: "",
  role: "admin",
};

function initials(name: string, email: string) {
  return (
    (name || email || "?")
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "D"
  );
}

export function UsersClient({
  rows,
  currentUserId,
  uploadsEnabled,
  readOnly = false,
}: {
  rows: Row[];
  currentUserId: string;
  uploadsEnabled: boolean;
  readOnly?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Row | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const openCreate = () => {
    setForm(EMPTY);
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (row: Row) => {
    setForm({
      id: row.id,
      name: row.name,
      email: row.email,
      image: row.image,
      password: "",
      role: row.role ?? "admin",
    });
    setFormError(null);
    setFormOpen(true);
  };

  const submit = () => {
    if (pending) return;
    setFormError(null);
    startTransition(async () => {
      const result = form.id
        ? await updateUser({
            id: form.id,
            name: form.name,
            role: form.role,
            image: form.image,
            password: form.password,
          })
        : await createUser({
            name: form.name,
            email: form.email,
            password: form.password,
            role: form.role,
          });
      if (result.ok) {
        setFormOpen(false);
        setNotice(result.message);
        router.refresh();
      } else {
        setFormError(result.message);
      }
    });
  };

  const confirmDelete = () => {
    if (pending || !deleteTarget) return;
    startTransition(async () => {
      const result = await deleteUser({ id: deleteTarget.id });
      if (result.ok) {
        setDeleteTarget(null);
        setNotice(result.message);
        router.refresh();
      } else {
        setNotice(result.message);
      }
    });
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 pb-16">
      <PageToolbar
        title="Staff Users"
        description="Accounts with access to this admin panel. Users sign in with email and password on /login."
      >
        {!readOnly && (
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_-14px_rgb(47_118_109/0.6)] transition-all duration-200 hover:bg-primary-dark"
          >
            <Plus className="size-4" aria-hidden="true" />
            Add User
          </button>
        )}
      </PageToolbar>

      {notice && (
        <p
          role="status"
          className="flex items-center gap-2 rounded-2xl border border-primary/25 bg-primary-light/50 px-5 py-3.5 text-sm font-medium text-primary-dark"
        >
          <ShieldCheck className="size-4 shrink-0" aria-hidden="true" />
          {notice}
        </p>
      )}

      <DataTable headers={["User", "Role", "Email Verified", "Joined", ""]}>
        {rows.length === 0 ? (
          <TableEmptyState message="No users yet" />
        ) : (
          rows.map((row) => (
            <tr key={row.id} className="group transition-colors duration-200 hover:bg-secondary/40">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3.5">
                  {row.image ? (
                    <Image
                      src={row.image}
                      alt={`Profile photo of ${row.name}`}
                      width={44}
                      height={44}
                      className="size-11 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-pine text-xs font-bold text-white"
                    >
                      {initials(row.name, row.email)}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="font-heading flex items-center gap-2 text-[0.9375rem] font-bold text-foreground">
                      {row.name}
                      {row.id === currentUserId && (
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-[0.625rem] font-bold tracking-wide text-muted uppercase">
                          you
                        </span>
                      )}
                    </p>
                    <p className="truncate text-sm text-muted">{row.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4">
                <span className="rounded-full bg-primary-light px-3 py-1 text-xs font-bold text-primary-dark capitalize">
                  {row.role ?? "admin"}
                </span>
              </td>
              <td className="px-5 py-4">
                {row.emailVerified ? (
                  <span className="inline-flex items-center gap-1.5 text-sm text-primary">
                    <ShieldCheck className="size-4" aria-hidden="true" />
                    Verified
                  </span>
                ) : (
                  <span className="text-sm text-muted">Pending</span>
                )}
              </td>
              <td className="px-5 py-4 text-sm whitespace-nowrap text-muted">
                {new Intl.DateTimeFormat("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }).format(row.createdAt)}
              </td>
              <td className="px-5 py-4">
                <div className={"flex justify-end gap-1.5" + (!readOnly ? " opacity-60 transition-opacity duration-200 group-hover:opacity-100" : "")}>
                {!readOnly && (
                  <>
                  <button
                    type="button"
                    onClick={() => openEdit(row)}
                    aria-label={`Edit ${row.email}`}
                    className="flex size-9 items-center justify-center rounded-lg text-muted transition-colors duration-200 hover:bg-secondary hover:text-foreground"
                  >
                    <Pencil className="size-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(row)}
                    disabled={row.id === currentUserId}
                    aria-label={`Delete ${row.email}`}
                    title={
                      row.id === currentUserId
                        ? "You cannot delete your own account"
                        : "Delete user"
                    }
                    className="flex size-9 items-center justify-center rounded-lg text-muted transition-colors duration-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                  </>
                )}
                </div>
              </td>
            </tr>
          ))
        )}
      </DataTable>

      <Dialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={form.id ? "Edit User" : "Add User"}
        description={
          form.id
            ? "Leave the password empty to keep the current one."
            : "The new user can sign in immediately with these credentials."
        }
      >
        <div className="space-y-5">
          <ImageUploadField
            label="Profile photo"
            value={form.image}
            canUpload={uploadsEnabled}
            onChange={(image) => setForm({ ...form, image })}
            aspect="square"
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Name" htmlFor="user-name">
              <input
                id="user-name"
                className={inputClasses}
                value={form.name}
                placeholder="Musa Yazlık"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </FormField>
            <SelectField
              id="user-role"
              label="Role"
              placeholder="Select a role"
              options={[
                { value: "admin", label: "Admin — full access" },
                { value: "editor", label: "Editor — can edit content" },
                { value: "demo", label: "Demo — view only, cannot save" },
              ]}
              value={form.role}
              onChange={(role) => setForm({ ...form, role })}
            />
          </div>

          {!form.id && (
            <FormField label="Email" htmlFor="user-email">
              <input
                id="user-email"
                type="email"
                className={inputClasses}
                value={form.email}
                placeholder="editor@docavia.com"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </FormField>
          )}

          <FormField
            label={form.id ? "New password (optional)" : "Password"}
            htmlFor="user-password"
            help="At least 8 characters."
          >
            <input
              id="user-password"
              type="password"
              autoComplete="new-password"
              className={inputClasses}
              value={form.password}
              placeholder={form.id ? "••••••••" : "Set a password"}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
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
              {form.id ? "Save Changes" : "Create User"}
            </button>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete user"
        description={
          deleteTarget
            ? `“${deleteTarget.email}” will lose access to the admin panel immediately. This cannot be undone.`
            : ""
        }
      >
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setDeleteTarget(null)}
            className="rounded-xl px-5 py-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-secondary"
          >
            <UserRound className="mr-2 inline size-4" aria-hidden="true" />
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmDelete}
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-red-700 disabled:opacity-50"
          >
            {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            Delete User
          </button>
        </div>
      </Dialog>
    </div>
  );
}
