"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ArrowLeft, Eye, Loader2, Save } from "lucide-react";
import { TiptapEditor } from "@/components/admin/tiptap-editor";
import { FormField, inputClasses } from "@/components/admin/ui/dialog";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { SelectField } from "@/components/ui/select-field";
import { savePost } from "@/app/admin/entity-actions";

type Category = { id: string; name: string };

export type PostDraft = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  contentHtml: string;
  categoryId: string | null;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  readingTime: number;
  published: boolean;
};

const EMPTY: PostDraft = {
  id: "",
  title: "",
  slug: "",
  excerpt: "",
  coverImage: "/images/blog-heart.jpg",
  contentHtml: "",
  categoryId: null,
  authorName: "",
  authorRole: "",
  authorAvatar: "",
  readingTime: 4,
  published: false,
};

export function PostEditor({
  initial,
  categories,
  uploadsEnabled,
  readOnly = false,
}: {
  initial: PostDraft | null;
  categories: Category[];
  uploadsEnabled: boolean;
  readOnly?: boolean;
}) {
  const router = useRouter();
  const [form, setForm] = useState<PostDraft>(initial ?? EMPTY);
  const [contentJson, setContentJson] = useState<object | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const editing = Boolean(initial?.id);

  const update = (patch: Partial<PostDraft>) => {
    setForm((current) => ({ ...current, ...patch }));
  };

  const submit = (publish: boolean) => {
    if (pending) return;
    setError(null);
    startTransition(async () => {
      const result = await savePost({
        id: editing ? initial!.id : null,
        title: form.title,
        slug: form.slug || form.title,
        excerpt: form.excerpt,
        coverImage: form.coverImage,
        contentHtml: form.contentHtml,
        contentJson,
        categoryId: form.categoryId,
        authorName: form.authorName || "Docavia Team",
        authorRole: form.authorRole,
        authorAvatar: form.authorAvatar,
        readingTime: form.readingTime,
        published: publish,
      });
      if (result.ok) {
        router.push("/admin/posts");
        router.refresh();
      } else {
        setError(result.message);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  };

  return (
    <div className="mx-auto w-full max-w-5xl pb-16">
      <Link
        href="/admin/posts"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors duration-200 hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        All posts
      </Link>

      <header className="mt-6">
        <h2 className="font-heading text-2xl font-bold tracking-[-0.02em] text-foreground">
          {editing ? "Edit Post" : "New Post"}
        </h2>
        <p className="mt-2 text-[0.9375rem] text-muted">
          Drafts stay private. Publishing makes the post live at its slug
          immediately.
        </p>
      </header>

      {error && (
        <p
          role="alert"
          className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-sm font-medium text-red-700"
        >
          {error}
        </p>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem]">
        {/* Main column */}
        <div className="space-y-6">
          <FormField label="Title" htmlFor="post-title">
            <input
              id="post-title"
              disabled={readOnly}
              className={inputClasses}
              value={form.title}
              placeholder="5 Simple Ways to Improve Your Heart Health"
              onChange={(e) => update({ title: e.target.value })}
            />
          </FormField>

          <div>
            <p className="text-sm font-semibold text-foreground">Article body</p>
            <div className="mt-2">
              <TiptapEditor
                initialHtml={form.contentHtml}
                editable={!readOnly}
                onChange={(html, json) => {
                  update({ contentHtml: html });
                  setContentJson(json);
                }}
              />
            </div>
          </div>

          <FormField
            label="Excerpt"
            htmlFor="post-excerpt"
            help="Shown on the blog listing and in search results."
          >
            <textarea
              id="post-excerpt"
              rows={3}
              disabled={readOnly}
              className={inputClasses}
              value={form.excerpt}
              placeholder="One or two sentences summarizing the article."
              onChange={(e) => update({ excerpt: e.target.value })}
            />
          </FormField>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="rounded-3xl border border-border bg-white p-6">
            <p className="font-heading text-[0.8125rem] font-bold tracking-[0.12em] text-muted uppercase">
              Publish
            </p>
            {readOnly ? (
              <p className="mt-4 rounded-xl bg-secondary/60 px-4 py-3 text-xs leading-relaxed text-muted">
                Read-only account — you can review this post but cannot save
                changes.
              </p>
            ) : (
              <>
            <div className="mt-4 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => submit(true)}
                disabled={pending}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_-14px_rgb(47_118_109/0.6)] transition-all duration-200 hover:bg-primary-dark disabled:opacity-50"
              >
                {pending ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Eye className="size-4" aria-hidden="true" />
                )}
                {editing && form.published ? "Save & Keep Published" : "Publish Now"}
              </button>
              <button
                type="button"
                onClick={() => submit(false)}
                disabled={pending}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-primary/40 hover:text-primary disabled:opacity-50"
              >
                <Save className="size-4" aria-hidden="true" />
                Save as Draft
              </button>
            </div>
              </>
            )}
            {editing && (
              <p className="mt-4 flex items-center gap-2 text-xs text-muted">
                <span
                  className={
                    "size-1.5 rounded-full " +
                    (form.published ? "bg-primary" : "bg-muted/50")
                  }
                  aria-hidden="true"
                />
                {form.published ? "Currently published" : "Currently a draft"}
              </p>
            )}
          </div>

          <div className="rounded-3xl border border-border bg-white p-6">
            <p className="font-heading text-[0.8125rem] font-bold tracking-[0.12em] text-muted uppercase">
              Meta
            </p>
            <div className="mt-4 space-y-4">
              <FormField
                label="Slug (optional)"
                htmlFor="post-slug"
                help="Derived from the title when empty."
              >
                <input
                  id="post-slug"
                  disabled={readOnly}
              className={inputClasses}
                  value={form.slug}
                  placeholder="improve-your-heart-health"
                  onChange={(e) => update({ slug: e.target.value })}
                />
              </FormField>
              <SelectField
                id="post-category"
                label="Category"
                placeholder="Uncategorized"
                disabled={readOnly}
                options={[
                  { value: "", label: "Uncategorized" },
                  ...categories.map((category) => ({
                    value: category.id,
                    label: category.name,
                  })),
                ]}
                value={form.categoryId ?? ""}
                onChange={(value) => update({ categoryId: value || null })}
              />
              <ImageUploadField
                label="Cover image"
                value={form.coverImage}
                canUpload={uploadsEnabled}
                onChange={(coverImage) => update({ coverImage })}
                aspect="wide"
                layout="stack"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-white p-6">
            <p className="font-heading text-[0.8125rem] font-bold tracking-[0.12em] text-muted uppercase">
              Author
            </p>
            <div className="mt-4 space-y-4">
              <FormField label="Name" htmlFor="post-author">
                <input
                  id="post-author"
                  disabled={readOnly}
              className={inputClasses}
                  value={form.authorName}
                  placeholder="Dr. Emily Carter"
                  onChange={(e) => update({ authorName: e.target.value })}
                />
              </FormField>
              <FormField label="Role" htmlFor="post-author-role">
                <input
                  id="post-author-role"
                  disabled={readOnly}
              className={inputClasses}
                  value={form.authorRole}
                  placeholder="Cardiologist"
                  onChange={(e) => update({ authorRole: e.target.value })}
                />
              </FormField>
              <ImageUploadField
                label="Author avatar"
                value={form.authorAvatar}
                canUpload={uploadsEnabled}
                onChange={(authorAvatar) => update({ authorAvatar })}
                aspect="square"
                help="Optional — shown beside the article byline."
              />
              <FormField label="Reading time (minutes)" htmlFor="post-reading-time">
                <input
                  id="post-reading-time"
                  type="number"
                  min={1}
                  disabled={readOnly}
              className={inputClasses}
                  value={form.readingTime}
                  onChange={(e) =>
                    update({ readingTime: Number(e.target.value) })
                  }
                />
              </FormField>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
