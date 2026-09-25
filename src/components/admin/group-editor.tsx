"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  Check,
  Loader2,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";
import {
  getGroupValue,
  resetContentGroup,
  saveContentGroup,
  type ActionResult,
} from "@/app/admin/actions";
import type { FieldDef, ListDef } from "@/lib/content/registry";
import { cn } from "@/lib/utils";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Dialog } from "@/components/admin/ui/dialog";
import { DataTable, TableEmptyState } from "@/components/admin/ui/table";

type Json = Record<string, unknown>;

/* ----------------------------- path helpers ------------------------------ */

function getPath(source: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (node, key) =>
        node !== null && typeof node === "object"
          ? (node as Json)[key]
          : undefined,
      source,
    );
}

function setMutablePath(target: Json, path: string, value: unknown) {
  const keys = path.split(".");
  let node: Json = target;
  for (const key of keys.slice(0, -1)) {
    const child = node[key];
    if (child === null || typeof child !== "object" || Array.isArray(child)) {
      node[key] = {};
    }
    node = node[key] as Json;
  }
  node[keys[keys.length - 1]] = value;
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

/* -------------------------------- inputs --------------------------------- */

const inputClasses =
  "w-full rounded-xl border border-border bg-white px-4 py-3 text-[0.9375rem] leading-relaxed text-foreground shadow-[0_1px_2px_rgb(24_63_58/0.05)] transition-all duration-200 placeholder:text-muted/60 hover:border-primary/35 focus:border-primary focus:shadow-[0_0_0_3px_rgb(47_118_109/0.12)] focus:outline-none";

function Field({
  def,
  value,
  canUpload,
  disabled,
  onChange,
}: {
  def: FieldDef;
  value: unknown;
  canUpload?: boolean;
  disabled?: boolean;
  onChange: (next: unknown) => void;
}) {
  if (def.type === "image") {
    return (
      <ImageUploadField
        label={def.label}
        value={value}
        canUpload={canUpload ?? false}
        onChange={onChange}
        help={def.help}
      />
    );
  }

  const id = `f-${def.key.replace(/\./g, "-")}`;
  const isStringArray =
    Array.isArray(value) && value.every((entry) => typeof entry === "string");
  const display = isStringArray
    ? (value as string[]).join("\n")
    : value === undefined || value === null
      ? ""
      : String(value);

  return (
    <div>
      <label
        htmlFor={id}
        className="flex items-baseline justify-between gap-3 text-sm font-semibold text-foreground"
      >
        {def.label}
        {def.type === "number" && (
          <span className="text-xs font-medium text-muted">number</span>
        )}
      </label>
      {def.type === "textarea" || isStringArray ? (
        <textarea
          id={id}
          rows={def.type === "textarea" ? 4 : 3}
          value={display}
          placeholder={def.placeholder}
          disabled={disabled}
          onChange={(event) =>
            onChange(
              isStringArray
                ? event.target.value.split("\n")
                : event.target.value,
            )
          }
          className={cn(inputClasses, "mt-2 resize-y disabled:cursor-not-allowed disabled:bg-secondary/40 disabled:text-muted")}
        />
      ) : (
        <input
          id={id}
          type={def.type === "number" ? "number" : "text"}
          inputMode={def.type === "number" ? "numeric" : undefined}
          value={display}
          placeholder={def.placeholder}
          disabled={disabled}
          onChange={(event) =>
            onChange(
              def.type === "number"
                ? event.target.value === ""
                  ? ""
                  : Number(event.target.value)
                : event.target.value,
            )
          }
          className={cn(inputClasses, "mt-2 disabled:cursor-not-allowed disabled:bg-secondary/40 disabled:text-muted")}
        />
      )}
      {def.help && (
        <p className="mt-2 text-xs leading-relaxed text-muted">{def.help}</p>
      )}
    </div>
  );
}

function blankItem(list: ListDef): Json {
  const blank: Json = {};
  for (const field of list.fields) {
    blank[field.key] = "";
  }
  return blank;
}

function previewText(value: unknown): string {
  if (Array.isArray(value)) {
    return value.filter((entry) => typeof entry === "string").join(" / ");
  }
  if (value === undefined || value === null || value === "") return "";
  return String(value);
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Repeatable items of a content group, shown as a table like the entity
 * pages. Rows are added/edited in a dialog; changes stay local until the
 * sticky "Save & Publish" bar writes the whole group to the database.
 */
function ListEditor({
  list,
  items,
  canUpload,
  readOnly,
  onChange,
}: {
  list: ListDef;
  items: Json[];
  canUpload?: boolean;
  readOnly?: boolean;
  onChange: (next: Json[]) => void;
}) {
  const [editing, setEditing] = useState<{ index: number | null; draft: Json } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  const move = (index: number, direction: -1 | 1) => {
    const next = [...items];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const openAdd = () => {
    setError(null);
    setEditing({ index: null, draft: blankItem(list) });
  };

  const openEdit = (index: number) => {
    setError(null);
    setEditing({ index, draft: clone(items[index]) });
  };

  const apply = () => {
    if (!editing) return;
    const firstField = list.fields[0];
    const firstValue = firstField ? previewText(editing.draft[firstField.key]) : "";
    if (!firstValue) {
      setError(`${firstField?.label ?? "The first field"} is required.`);
      return;
    }
    if (editing.index === null) {
      onChange([...items, editing.draft]);
    } else {
      onChange(items.toSpliced(editing.index, 1, editing.draft));
    }
    setEditing(null);
  };

  const confirmDelete = () => {
    if (deleting === null) return;
    onChange(items.filter((_, i) => i !== deleting));
    setDeleting(null);
  };

  const deletingPreview =
    deleting !== null
      ? previewText(getPath(items[deleting], list.fields[0]?.key ?? ""))
      : "";

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h3 className="font-heading text-[1.05rem] font-bold tracking-tight text-foreground">
          {list.label}
          <span className="ml-2 text-sm font-semibold text-muted">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        </h3>
        {!readOnly && (
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_-14px_rgb(47_118_109/0.6)] transition-colors duration-200 hover:bg-primary-dark"
          >
            <Plus className="size-4" aria-hidden="true" />
            Add {capitalize(list.itemLabel)}
          </button>
        )}
      </div>
      {list.help && (
        <p className="text-xs leading-relaxed text-muted">{list.help}</p>
      )}

      <DataTable
        headers={["#", ...list.fields.map((field) => field.label), ""]}
        className="shadow-none"
      >
        {items.length === 0 ? (
          <TableEmptyState
            message={`No ${list.itemLabel}s yet`}
            hint={`Use “Add ${capitalize(list.itemLabel)}” to create the first one.`}
          />
        ) : (
          items.map((item, index) => (
            <tr
              key={index}
              className="group transition-colors duration-200 hover:bg-secondary/40"
            >
              <td className="px-5 py-4 text-sm font-bold text-primary">
                {String(index + 1).padStart(2, "0")}
              </td>
              {list.fields.map((field) => (
                <td
                  key={field.key}
                  className={
                    field === list.fields[0]
                      ? "max-w-[16rem] px-5 py-4"
                      : "max-w-sm px-5 py-4"
                  }
                >
                  <span
                    className={cn(
                      "block truncate text-sm",
                      field === list.fields[0]
                        ? "font-semibold text-foreground"
                        : "text-muted",
                    )}
                  >
                    {previewText(getPath(item, field.key)) || "—"}
                  </span>
                </td>
              ))}
              <td className="px-5 py-4">
                <div className={cn("flex justify-end gap-1", !readOnly && "opacity-70 transition-opacity duration-200 group-hover:opacity-100")}>
                  {!readOnly && (
                    <>
                      <button
                        type="button"
                        onClick={() => move(index, -1)}
                        disabled={index === 0}
                        aria-label={`Move ${list.itemLabel} ${index + 1} up`}
                        className="flex size-9 items-center justify-center rounded-lg text-muted transition-colors duration-200 hover:bg-secondary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <ArrowUp className="size-4" aria-hidden="true" />
                      </button>
                    <button
                      type="button"
                      onClick={() => move(index, 1)}
                      disabled={index === items.length - 1}
                      aria-label={`Move ${list.itemLabel} ${index + 1} down`}
                      className="flex size-9 items-center justify-center rounded-lg text-muted transition-colors duration-200 hover:bg-secondary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <ArrowDown className="size-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(index)}
                      aria-label={`Edit ${list.itemLabel} ${index + 1}`}
                      className="flex size-9 items-center justify-center rounded-lg text-muted transition-colors duration-200 hover:bg-secondary hover:text-foreground"
                    >
                      <Pencil className="size-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(index)}
                      aria-label={`Remove ${list.itemLabel} ${index + 1}`}
                      className="flex size-9 items-center justify-center rounded-lg text-muted transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
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

      {/* Create / edit dialog */}
      <Dialog
        open={editing !== null}
        onClose={() => setEditing(null)}
        size="lg"
        title={
          editing?.index === null || editing === null
            ? `Add ${capitalize(list.itemLabel)}`
            : `Edit ${capitalize(list.itemLabel)}`
        }
        description="Applies locally — publish with the Save & Publish bar below."
      >
        {editing && (
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              {list.fields.map((field) => (
                <div
                  key={field.key}
                  className={
                    field.type === "textarea" ||
                    field.type === "image" ||
                    Array.isArray(editing.draft[field.key])
                      ? "sm:col-span-2"
                      : undefined
                  }
                >
                  <Field
                    def={field}
                    canUpload={canUpload}
                    value={editing.draft[field.key]}
                    onChange={(next) => {
                      const draft = clone(editing.draft);
                      setMutablePath(draft, field.key, next);
                      setEditing({ ...editing, draft });
                    }}
                  />
                </div>
              ))}
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
              >
                {error}
              </p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-xl px-5 py-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={apply}
                className="inline-flex min-w-28 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-dark"
              >
                {editing.index === null
                  ? `Add ${capitalize(list.itemLabel)}`
                  : "Apply"}
              </button>
            </div>
          </div>
        )}
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        title={`Remove ${list.itemLabel}`}
        description={
          deletingPreview
            ? `“${deletingPreview}” will be removed from this section once you publish.`
            : "This row will be removed from this section once you publish."
        }
      >
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setDeleting(null)}
            className="rounded-xl px-5 py-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmDelete}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-red-700"
          >
            <Trash2 className="size-4" aria-hidden="true" />
            Remove
          </button>
        </div>
      </Dialog>
    </section>
  );
}

/* ------------------------------ main editor ------------------------------- */

export function GroupEditor({
  groupKey,
  fields,
  lists,
  initialValue,
  customized,
  uploadsEnabled,
  readOnly = false,
}: {
  groupKey: string;
  fields: FieldDef[];
  lists: ListDef[];
  initialValue: Json;
  customized: boolean;
  uploadsEnabled: boolean;
  /** Demo accounts browse everything but can never save. */
  readOnly?: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState<Json>(initialValue);
  const [status, setStatus] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [savedJson, setSavedJson] = useState(() => JSON.stringify(initialValue));

  const dirty = useMemo(
    () => JSON.stringify(value) !== savedJson,
    [value, savedJson],
  );

  const save = () => {
    if (pending || !dirty) return;
    setStatus(null);
    startTransition(async () => {
      const result = await saveContentGroup(groupKey, JSON.stringify(value));
      setStatus(result);
      if (result.ok) {
        setSavedJson(JSON.stringify(value));
        router.refresh();
      }
    });
  };

  const reset = () => {
    if (pending) return;
    if (
      !window.confirm(
        "Restore the original copy? All saved changes for this section will be removed.",
      )
    ) {
      return;
    }
    setStatus(null);
    startTransition(async () => {
      const result = await resetContentGroup(groupKey);
      setStatus(result);
      if (result.ok) {
        const fresh = await getGroupValue(groupKey);
        const restored = JSON.parse(fresh) as Json;
        setValue(restored);
        setSavedJson(JSON.stringify(restored));
        router.refresh();
      }
    });
  };

  return (
    <div className="pb-40">
      {customized && (
        <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-light px-4 py-1.5 text-xs font-bold tracking-wide text-primary-dark uppercase">
          <Check className="size-3.5" aria-hidden="true" />
          Custom copy live
        </p>
      )}

      <div className="space-y-8">
        {fields.length > 0 && (
          <div className="rounded-3xl border border-border bg-white p-6 sm:p-8">
            <div className="grid gap-6 sm:grid-cols-2">
              {fields.map((field) => (
                <div
                  key={field.key}
                  className={field.type === "textarea" ? "sm:col-span-2" : undefined}
                >
                  <Field
                    def={field}
                    canUpload={uploadsEnabled && !readOnly}
                    disabled={readOnly}
                    value={getPath(value, field.key)}
                    onChange={(next) => {
                      const draft = clone(value);
                      setMutablePath(draft, field.key, next);
                      setValue(draft);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {lists.map((list) => {
          const items = getPath(value, list.key);
          return (
            <ListEditor
              key={list.key}
              list={list}
              canUpload={uploadsEnabled && !readOnly}
              readOnly={readOnly}
              items={Array.isArray(items) ? (items as Json[]) : []}
              onChange={(next) => {
                const draft = clone(value);
                setMutablePath(draft, list.key, next);
                setValue(draft);
              }}
            />
          );
        })}

        {fields.length === 0 && lists.length === 0 && (
          <p className="rounded-3xl border border-dashed border-border px-6 py-10 text-center text-muted">
            This section has no editable fields.
          </p>
        )}
      </div>

      {/* Save bar — demo accounts have nothing to save */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-20 border-t border-border bg-white/92 backdrop-blur-md lg:left-[17.5rem]",
          readOnly && "hidden",
        )}
      >
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-4 px-5 py-4 sm:px-8 lg:px-12">
          <div className="min-w-0 flex-1" aria-live="polite">
            {pending ? (
              <p className="flex items-center gap-2 text-sm font-semibold text-muted">
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Saving…
              </p>
            ) : status ? (
              <p
                className={cn(
                  "flex items-center gap-2 text-sm font-semibold",
                  status.ok ? "text-primary" : "text-red-600",
                )}
              >
                {status.ok && <Check className="size-4" aria-hidden="true" />}
                {status.message}
              </p>
            ) : dirty ? (
              <p className="text-sm font-semibold text-foreground">
                Unsaved changes
              </p>
            ) : (
              <p className="text-sm text-muted">
                {customized ? "Custom copy published" : "Using original copy"}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => setConfirmingReset((v) => !v)}
            disabled={pending || !customized}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200",
              customized
                ? "text-muted hover:bg-secondary hover:text-foreground"
                : "cursor-not-allowed opacity-40",
            )}
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </button>
          <button
            type="button"
            onClick={save}
            disabled={pending || !dirty}
            className="inline-flex min-w-36 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_-14px_rgb(47_118_109/0.6)] transition-all duration-200 hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
          >
            {pending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Check className="size-4" aria-hidden="true" />
            )}
            Save & Publish
          </button>
        </div>

        {confirmingReset && (
          <div className="mx-auto max-w-5xl px-5 pb-4 sm:px-8 lg:px-12">
            <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-secondary/60 px-5 py-4">
              <p className="min-w-0 flex-1 text-sm text-muted">
                This removes the saved copy for this section and brings back the
                original text everywhere on the site.
              </p>
              <button
                type="button"
                onClick={() => {
                  setConfirmingReset(false);
                  reset();
                }}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-red-700"
              >
                Restore original
              </button>
              <button
                type="button"
                onClick={() => setConfirmingReset(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-white"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
