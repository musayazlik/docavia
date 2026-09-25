import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { GroupEditor } from "@/components/admin/group-editor";
import { getContent, getOverrideMeta } from "@/lib/content/store";
import { contentGroups, getGroup } from "@/lib/content/registry";
import type { FieldDef, ListDef } from "@/lib/content/registry";

export function generateStaticParams() {
  return contentGroups.map((group) => ({ group: group.key }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ group: string }>;
}) {
  const { group: groupKey } = await params;
  const group = getGroup(groupKey);
  return { title: group ? `${group.title} — Admin` : "Admin" };
}

export default async function GroupEditorPage({
  params,
}: {
  params: Promise<{ group: string }>;
}) {
  const { group: groupKey } = await params;
  const group = getGroup(groupKey);
  if (!group) notFound();

  const [content, meta] = await Promise.all([getContent(), getOverrideMeta()]);
  const value = content[group.key as keyof typeof content];
  const customized = group.key in meta;

  // GroupDef carries a Lucide icon (not serializable) — pass plain data.
  const fields: FieldDef[] = group.fields;
  const lists: ListDef[] = group.lists;
  const Icon = group.icon;

  return (
    <div className="mx-auto w-full max-w-5xl">
      <Link
        href="/admin/content"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors duration-200 hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        All sections
      </Link>

      <header className="mt-6 flex flex-wrap items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          <span className="flex size-13 shrink-0 items-center justify-center rounded-2xl bg-primary-light text-primary-dark">
            <Icon className="size-6" aria-hidden="true" />
          </span>
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-[-0.02em] text-foreground sm:text-3xl">
              {group.title}
            </h1>
            <p className="mt-2 max-w-xl text-[0.9375rem] leading-relaxed text-muted">
              {group.description}
            </p>
          </div>
        </div>
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-primary/40 hover:text-primary"
        >
          <ExternalLink className="size-4" aria-hidden="true" />
          Preview site
        </Link>
      </header>

      <div className="mt-10">
        <GroupEditor
          groupKey={group.key}
          fields={fields}
          lists={lists}
          initialValue={JSON.parse(JSON.stringify(value))}
          customized={customized}
          uploadsEnabled={Boolean(process.env.UPLOADTHING_TOKEN)}
        />
      </div>
    </div>
  );
}
