"use client";

import Image from "next/image";
import { useRef, useState, type DragEvent } from "react";
import { FolderOpen, ImageIcon, ImagePlus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "@/components/admin/toast";
import { MediaPickerDialog } from "@/components/admin/media-picker-dialog";

const SIZE_HINT = "JPG, PNG or WebP · up to 4 MB";
const INACTIVE_HINT =
  "Uploads are inactive — add your UPLOADTHING_TOKEN to .env and restart the dev server.";

const ASPECT_CLASSES = {
  portrait: "aspect-[4/5]",
  square: "aspect-square",
  wide: "aspect-[16/9]",
} as const;

const replaceClasses =
  "inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-white px-3.5 py-2 text-sm font-semibold text-primary transition-colors duration-200 hover:border-primary hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-primary/30 disabled:hover:bg-white disabled:hover:text-primary";

const libraryClasses =
  "inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3.5 py-2 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-primary/40 hover:text-primary";

const removeClasses =
  "inline-flex items-center rounded-xl px-3 py-2 text-sm font-semibold text-red-600 transition-colors duration-200 hover:bg-red-50";

/**
 * Shared image input for the admin area: an inviting dropzone tile when
 * empty, a framed preview card with replace/remove actions once a photo is
 * set. Files upload through UploadThing; without a token the control shows
 * an inactive state with setup instructions instead of failing silently.
 * `layout="stack"` puts the preview above the actions (narrow sidebars);
 * `aspect` shapes the preview frame.
 */
export function ImageUploadField({
  label,
  value,
  canUpload,
  onChange,
  help,
  aspect = "portrait",
  layout = "row",
  allowRemove = true,
}: {
  label: string;
  value: unknown;
  canUpload: boolean;
  onChange: (next: string) => void;
  help?: string;
  aspect?: keyof typeof ASPECT_CLASSES;
  layout?: "row" | "stack";
  allowRemove?: boolean;
}) {
  const current = typeof value === "string" ? value : "";
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const { toastError } = useToast();
  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (files) => {
      // the server re-encodes uploads as WebP and returns that file's URL
      const url = files?.[0]?.serverData?.url ?? files?.[0]?.ufsUrl;
      if (url) {
        setError(null);
        onChange(url);
      }
    },
    onUploadError: (uploadError) => {
      setError(uploadError.message);
      toastError(uploadError.message);
    },
  });

  const pick = () => inputRef.current?.click();

  const upload = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("That file is not an image — choose a JPG, PNG or WebP.");
      return;
    }
    setError(null);
    void startUpload([file]);
  };

  const dragHandlers = canUpload
    ? {
        onDragOver: (event: DragEvent) => {
          event.preventDefault();
          setDragActive(true);
        },
        onDragLeave: () => setDragActive(false),
        onDrop: (event: DragEvent) => {
          event.preventDefault();
          setDragActive(false);
          upload(event.dataTransfer.files?.[0]);
        },
      }
    : {};

  return (
    <div {...dragHandlers}>
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          upload(file);
        }}
      />

      {current ? (
        <div
          className={cn(
            "mt-2 rounded-2xl border bg-white p-3 shadow-[0_1px_2px_rgb(24_63_58/0.05)] transition-all duration-300",
            layout === "row" ? "flex items-center gap-4" : "w-full",
            dragActive
              ? "border-primary ring-4 ring-primary/10"
              : "border-border",
          )}
        >
          <button
            type="button"
            onClick={canUpload ? pick : undefined}
            disabled={isUploading || !canUpload}
            aria-label="Replace photo"
            className={cn(
              "group relative shrink-0 overflow-hidden rounded-xl",
              ASPECT_CLASSES[aspect],
              layout === "row" ? "w-20 sm:w-24" : "w-full",
            )}
          >
            <Image
              src={current}
              alt=""
              fill
              sizes={layout === "row" ? "96px" : "320px"}
              className="object-cover"
            />
            <span
              className={cn(
                "absolute inset-0 flex items-center justify-center bg-pine/50 text-white opacity-0 backdrop-blur-[2px] transition-opacity duration-300",
                canUpload && "group-hover:opacity-100 group-focus-visible:opacity-100",
              )}
            >
              <ImagePlus className="size-5" aria-hidden="true" />
            </span>
            {isUploading && (
              <span className="absolute inset-0 flex items-center justify-center bg-pine/60">
                <Loader2 className="size-5 animate-spin text-white" aria-hidden="true" />
              </span>
            )}
          </button>

          <div className={cn("min-w-0 flex-1", layout === "stack" && "mt-3")}>
            <p className="text-sm font-semibold text-foreground">
              {isUploading ? "Uploading…" : "Current photo"}
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted">
              {SIZE_HINT}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={pick}
                disabled={!canUpload || isUploading}
                className={replaceClasses}
              >
                <ImagePlus className="size-4" aria-hidden="true" />
                Replace photo
              </button>
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className={libraryClasses}
              >
                <FolderOpen className="size-4" aria-hidden="true" />
                Library
              </button>
              {allowRemove && (
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className={removeClasses}
                >
                  Remove
                </button>
              )}
            </div>
            {!canUpload && (
              <p className="mt-2.5 text-xs leading-relaxed text-muted">
                {INACTIVE_HINT}
              </p>
            )}
          </div>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={canUpload ? pick : undefined}
            disabled={!canUpload || isUploading}
            className={cn(
              "group relative mt-2 flex h-40 w-full flex-col items-center justify-center gap-2.5 overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300",
              dragActive
                ? "border-primary bg-primary-light/50 ring-4 ring-primary/10"
                : "border-border bg-secondary/30 hover:border-primary/45 hover:bg-secondary/50",
              !canUpload && "cursor-not-allowed opacity-60",
            )}
          >
            <span
              className="pointer-events-none absolute -top-12 left-1/2 size-32 -translate-x-1/2 rounded-full bg-primary-light/70 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
              aria-hidden="true"
            />
            <span className="relative flex size-12 items-center justify-center rounded-2xl bg-white text-primary shadow-[0_10px_24px_-12px_rgb(24_63_58/0.4)] ring-1 ring-border transition-transform duration-300 group-hover:-translate-y-0.5">
              {isUploading ? (
                <Loader2 className="size-5 animate-spin" aria-hidden="true" />
              ) : (
                <ImageIcon className="size-5" aria-hidden="true" />
              )}
            </span>
            <span className="relative text-sm font-semibold text-foreground">
              {isUploading ? (
                "Uploading…"
              ) : dragActive ? (
                "Drop the photo here"
              ) : canUpload ? (
                <>
                  Click to upload{" "}
                  <span className="font-normal text-muted">or drag &amp; drop</span>
                </>
              ) : (
                "Upload photo"
              )}
            </span>
            <span className="relative text-xs text-muted">{SIZE_HINT}</span>
          </button>
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className={libraryClasses + " mt-2"}
          >
            <FolderOpen className="size-4" aria-hidden="true" />
            Pick from library
          </button>
          {!canUpload && (
            <p className="mt-2 text-xs leading-relaxed text-muted">
              {INACTIVE_HINT}
            </p>
          )}
        </>
      )}

      <MediaPickerDialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onPick={onChange}
      />

      {error && (
        <p role="alert" className="mt-2 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
      {help && !error && (
        <p className="mt-2 text-xs leading-relaxed text-muted">{help}</p>
      )}
    </div>
  );
}
