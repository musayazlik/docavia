"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Dialog } from "@/components/admin/ui/dialog";
import { ICON_CATALOG } from "@/lib/icons";
import { cn } from "@/lib/utils";

/**
 * Lucide icon picker — a searchable grid where every option shows the icon
 * and its name. Selection stores the plain name in site content; public
 * components resolve it via `iconByName()` with their own fallbacks.
 */
export function IconPickerDialog({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (name: string) => void;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ICON_CATALOG;
    return ICON_CATALOG.filter((entry) => entry.name.includes(q));
  }, [query]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Pick an icon"
      size="lg"
      description="Lucide icons — the chosen name is stored and rendered on the site."
    >
      <div className="space-y-4">
        <div className="relative">
          <Search
            className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search icons…"
            aria-label="Search icons"
            className="w-full rounded-xl border border-border bg-white py-3 pr-4 pl-10 text-[0.9375rem] text-foreground transition-all duration-200 placeholder:text-muted/60 hover:border-primary/35 focus:border-primary focus:shadow-[0_0_0_3px_rgb(47_118_109/0.12)] focus:outline-none"
          />
        </div>

        <div
          role="listbox"
          aria-label="Icons"
          className="grid max-h-[22rem] grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-5"
        >
          {filtered.map(({ name, Icon }) => (
            <button
              key={name}
              type="button"
              role="option"
              aria-selected={false}
              onClick={() => {
                onPick(name);
                onClose();
              }}
              className="group flex flex-col items-center gap-1.5 rounded-xl border border-transparent px-2 py-3 transition-all duration-200 hover:border-primary/35 hover:bg-secondary/60"
            >
              <Icon
                className="size-5 text-foreground/70 transition-colors duration-200 group-hover:text-primary"
                aria-hidden="true"
              />
              <span className="w-full truncate text-center font-mono text-[0.625rem] text-muted">
                {name}
              </span>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full py-10 text-center text-sm text-muted">
              No icons match “{query}”.
            </p>
          )}
        </div>
      </div>
    </Dialog>
  );
}

/**
 * Trigger button shown inside forms: renders the current icon (or a neutral
 * placeholder) with its name, opens the picker on click.
 */
export function IconSelectButton({
  value,
  onChange,
  disabled,
}: {
  value: unknown;
  onChange: (name: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const current = typeof value === "string" ? value : "";
  const preview = ICON_CATALOG.find((entry) => entry.name === current);

  return (
    <div>
      <span className="block text-sm font-semibold text-foreground">Icon</span>
      <button
        type="button"
        onClick={() => !disabled && setOpen(true)}
        disabled={disabled}
        aria-haspopup="dialog"
        className={cn(
          "mt-2 flex w-full items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 text-left transition-all duration-200 hover:border-primary/35 focus:border-primary focus:shadow-[0_0_0_3px_rgb(47_118_109/0.12)] focus:outline-none",
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
          {preview ? (
            <preview.Icon className="size-4.5" aria-hidden="true" />
          ) : (
            <span className="font-heading text-xs font-bold text-muted">?</span>
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[0.9375rem] text-foreground">
            {preview ? preview.name : "Auto (design default)"}
          </span>
          <span className="block text-xs text-muted">
            {preview ? "Custom icon" : "The section keeps its original icon"}
          </span>
        </span>
      </button>
      {current && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="mt-1.5 text-xs font-semibold text-muted transition-colors duration-200 hover:text-red-600"
        >
          Reset to auto
        </button>
      )}
      <IconPickerDialog
        open={open}
        onClose={() => setOpen(false)}
        onPick={onChange}
      />
    </div>
  );
}
