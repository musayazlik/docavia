"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Dialog } from "@/components/admin/ui/dialog";
import { cn } from "@/lib/utils";

type CatalogIcon = {
  name: string;
  label: string;
  group: "general" | "logos";
  viewBox: string;
  body: string;
};

let cache: CatalogIcon[] | null = null;

/** Fetch (and memoize) the offline iconify catalog served to admins. */
function useCatalog(enabled: boolean) {
  const [items, setItems] = useState<CatalogIcon[] | null>(cache);

  useEffect(() => {
    if (!enabled || cache) return;
    let cancelled = false;
    void fetch("/api/admin/icons", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data) => {
        if (!cancelled) {
          cache = data.items as CatalogIcon[];
          setItems(cache);
        }
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      });
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return items;
}

function IconSvg({ icon, className }: { icon: CatalogIcon; className?: string }) {
  return (
    <svg
      viewBox={icon.viewBox}
      className={className}
      fill="currentColor"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: icon.body }}
    />
  );
}

/**
 * Icon picker over the bundled iconify sets: "General" (lucide) and "Logos"
 * (simple-icons brand marks). Every option shows the icon and its name;
 * picking stores a plain name ("ambulance") or a "brand:x" name.
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
  const items = useCatalog(open);

  const filtered = useMemo(() => {
    if (!items) return null;
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((entry) => entry.label.includes(q));
  }, [items, query]);

  const groups: Array<{ key: "general" | "logos"; title: string }> = [
    { key: "logos", title: "Logos" },
    { key: "general", title: "General" },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Pick an icon"
      size="lg"
      description="General icons and brand logos — the chosen name is stored and rendered on the site."
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
            placeholder="Search icons and logos…"
            aria-label="Search icons and logos"
            className="w-full rounded-xl border border-border bg-white py-3 pr-4 pl-10 text-[0.9375rem] text-foreground transition-all duration-200 placeholder:text-muted/60 hover:border-primary/35 focus:border-primary focus:shadow-[0_0_0_3px_rgb(47_118_109/0.12)] focus:outline-none"
          />
        </div>

        {filtered === null ? (
          <p className="py-12 text-center text-sm text-muted">Loading icons…</p>
        ) : (
          <div className="max-h-[22rem] overflow-y-auto pr-1">
            {groups.map((group) => {
              const groupItems = filtered.filter((entry) => entry.group === group.key);
              if (groupItems.length === 0) return null;
              return (
                <section key={group.key} className="mb-4 last:mb-0">
                  <h3 className="px-1 text-[0.6875rem] font-bold tracking-[0.14em] text-muted uppercase">
                    {group.title}
                  </h3>
                  <div
                    role="listbox"
                    aria-label={group.title}
                    className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5"
                  >
                    {groupItems.map((icon) => (
                      <button
                        key={icon.name}
                        type="button"
                        role="option"
                        aria-selected={false}
                        aria-label={icon.label}
                        onClick={() => {
                          onPick(icon.name);
                          onClose();
                        }}
                        className="group flex flex-col items-center gap-1.5 rounded-xl border border-transparent px-2 py-3 transition-all duration-200 hover:border-primary/35 hover:bg-secondary/60"
                      >
                        <IconSvg
                          icon={icon}
                          className="size-5 text-foreground/70 transition-colors duration-200 group-hover:text-primary"
                        />
                        <span className="w-full truncate text-center font-mono text-[0.625rem] text-muted">
                          {icon.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              );
            })}
            {filtered.length === 0 && (
              <p className="py-10 text-center text-sm text-muted">
                No icons match “{query}”.
              </p>
            )}
          </div>
        )}
      </div>
    </Dialog>
  );
}

/**
 * Trigger button inside forms: renders the current icon (or a neutral
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
  const items = useCatalog(open || Boolean(current));
  const preview = items?.find((entry) => entry.name === current);

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
            <IconSvg icon={preview} className="size-4.5" />
          ) : (
            <span className="font-heading text-xs font-bold text-muted">?</span>
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[0.9375rem] text-foreground">
            {current
              ? (preview?.label ?? current)
              : "Auto (design default)"}
          </span>
          <span className="block text-xs text-muted">
            {current ? "Custom icon" : "The section keeps its original icon"}
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
