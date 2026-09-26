"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CheckCircle2, ImageIcon, Loader2 } from "lucide-react";
import { Dialog } from "@/components/admin/ui/dialog";
import { listMedia, registerMediaUrl, type MediaItem } from "@/app/admin/media-actions";
import { cn } from "@/lib/utils";

/**
 * "Pick from library" dialog — a grid/table of previously uploaded images.
 * New uploads register themselves automatically (uploadthing core.ts), and
 * manually pasted URLs can be saved into the library from here as well.
 */
export function MediaPickerDialog({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (url: string) => void;
}) {
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    void listMedia().then((rows) => {
      if (!cancelled) setItems(rows);
    });
    return () => {
      cancelled = true;
    };
  }, [open]);

  const close = () => {
    setSelected(null);
    setItems(null);
    onClose();
  };

  const confirm = async () => {
    if (!selected) return;
    setSaving(true);
    // Pick also registers pasted URLs the first time they are used.
    await registerMediaUrl(selected);
    onPick(selected);
    setSaving(false);
    setItems(null);
    setSelected(null);
    onClose();
  };

  const gridItem = (item: MediaItem) => {
    const active = selected === item.url;
    return (
      <button
        key={item.id}
        type="button"
        onClick={() => setSelected(item.url)}
        aria-pressed={active}
        aria-label={`Select ${item.filename}`}
        className={cn(
          "group relative aspect-square overflow-hidden rounded-2xl border-2 bg-secondary/30 transition-all duration-200",
          active
            ? "border-primary ring-4 ring-primary/15"
            : "border-transparent hover:border-primary/40",
        )}
      >
        <Image
          src={item.url}
          alt={item.filename}
          fill
          sizes="(min-width: 768px) 140px, 40vw"
          className="object-cover"
        />
        {active && (
          <span className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-primary text-white shadow-float">
            <CheckCircle2 className="size-4" aria-hidden="true" />
          </span>
        )}
        <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-pine/80 to-transparent px-2.5 pt-6 pb-2 text-left text-[0.6875rem] font-medium text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          {item.filename}
        </span>
      </button>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={close}
      title="Pick from library"
      size="lg"
      description="Previously uploaded images — click one to select it."
    >
      <div className="space-y-5">
        {items === null ? (
          <div className="flex items-center justify-center gap-2 py-14 text-sm text-muted">
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Loading library…
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-14 text-center">
            <ImageIcon className="size-8 text-muted/60" aria-hidden="true" />
            <p className="text-sm font-semibold text-foreground">
              The library is empty
            </p>
            <p className="max-w-xs text-xs leading-relaxed text-muted">
              Images uploaded anywhere in the admin panel appear here and can be
              reused across sections and posts.
            </p>
          </div>
        ) : (
          <div className="grid max-h-[24rem] grid-cols-3 gap-3 overflow-y-auto pr-1 sm:grid-cols-4">
            {items.map(gridItem)}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={close}
            className="rounded-xl px-5 py-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirm}
            disabled={!selected || saving}
            className="inline-flex min-w-28 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saving && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            Use Selected
          </button>
        </div>
      </div>
    </Dialog>
  );
}
