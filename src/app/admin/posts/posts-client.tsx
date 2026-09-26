"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  Eye,
  EyeOff,
  FileText,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { Dialog } from "@/components/admin/ui/dialog";
import { DataTable, PageToolbar, TableEmptyState } from "@/components/admin/ui/table";
import { deletePost, setPostPublished } from "@/app/admin/entity-actions";
import { ActionMenu } from "@/components/admin/ui/actions-menu";
import { useToast } from "@/components/admin/toast";

type Row = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  category: string;
  published: boolean;
  publishedAt: Date | null;
  readingTime: number;
};

function formatDate(date: Date | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function PostsClient({
  rows,
}: {
  rows: Row[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { toastError } = useToast();
  const [deleteTarget, setDeleteTarget] = useState<Row | null>(null);

  const togglePublish = (row: Row) => {
    if (pending) return;
    startTransition(async () => {
      const result = await setPostPublished({ id: row.id, published: !row.published });
      if (!result.ok) {
        toastError(result.message);
        return;
      }
      router.refresh();
    });
  };

  const confirmDelete = () => {
    if (pending || !deleteTarget) return;
    startTransition(async () => {
      const result = await deletePost(deleteTarget.id);
      if (!result.ok) {
        toastError(result.message);
        return;
      }
      setDeleteTarget(null);
      router.refresh();
    });
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 pb-16">
      <PageToolbar
        title="Blog Posts"
        description="Everything published here appears on /blog the moment it is saved as published."
      >
        {(
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_-14px_rgb(47_118_109/0.6)] transition-all duration-200 hover:bg-primary-dark"
          >
            <Plus className="size-4" aria-hidden="true" />
            New Post
          </Link>
        )}
      </PageToolbar>

      <DataTable headers={["Post", "Category", "Status", "Date", ""]}>
        {rows.length === 0 ? (
          <TableEmptyState
            message="No posts yet"
            hint="Write your first article with the rich text editor."
          />
        ) : (
          rows.map((row) => (
            <tr key={row.id} className="group transition-colors duration-200 hover:bg-secondary/40">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3.5">
                  <Image
                    src={row.coverImage}
                    alt=""
                    width={64}
                    height={44}
                    className="h-11 w-16 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0 max-w-xs">
                    <p className="font-heading truncate text-[0.9375rem] font-bold text-foreground">
                      {row.title}
                    </p>
                    <p className="truncate text-xs text-muted">/blog/{row.slug}</p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4 text-sm whitespace-nowrap text-muted">
                {row.category || "—"}
              </td>
              <td className="px-5 py-4">
                <span
                  className={
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold " +
                    (row.published
                      ? "bg-primary-light text-primary-dark"
                      : "bg-foreground/5 text-muted")
                  }
                >
                  {row.published ? (
                    <Eye className="size-3.5" aria-hidden="true" />
                  ) : (
                    <EyeOff className="size-3.5" aria-hidden="true" />
                  )}
                  {row.published ? "Published" : "Draft"}
                </span>
              </td>
              <td className="px-5 py-4 text-sm whitespace-nowrap text-muted">
                {formatDate(row.publishedAt)}
                <span className="block text-xs text-muted/70">
                  {row.readingTime} min read
                </span>
              </td>
              <td className="px-5 py-4 text-right">
                <ActionMenu
                  label={`Actions for ${row.title}`}
                  disabled={pending}
                  items={[
                    {
                      label: row.published ? "Move to Drafts" : "Publish",
                      icon: row.published ? EyeOff : Eye,
                      onSelect: () => togglePublish(row),
                    },
                    {
                      label: "Preview on site",
                      icon: FileText,
                      href: `/blog/${row.slug}`,
                      external: true,
                    },
                    { label: "Edit", icon: Pencil, href: `/admin/posts/${row.id}` },
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

      <Dialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete post"
        description={
          deleteTarget
            ? `“${deleteTarget.title}” will be removed from /blog. This cannot be undone.`
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
            Delete Post
          </button>
        </div>
      </Dialog>
    </div>
  );
}
