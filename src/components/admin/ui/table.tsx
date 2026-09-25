import type { ReactNode } from "react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Styled table shell for the admin entity pages. Pages compose their own
 * <tr> rows; this component keeps the visual language consistent.
 */
export function DataTable({
  headers,
  children,
  className,
}: {
  headers: string[];
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[1.5rem] border border-border bg-white shadow-[0_12px_36px_-28px_rgb(24_63_58/0.4)]",
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-3xl border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              {headers.map((header, index) => (
                <th
                  key={header + index}
                  scope="col"
                  className="px-5 py-4 text-[0.6875rem] font-bold tracking-[0.12em] whitespace-nowrap text-muted uppercase"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">{children}</tbody>
        </table>
      </div>
    </div>
  );
}

export function TableEmptyState({
  message,
  hint,
}: {
  message: string;
  hint?: string;
}) {
  return (
    <tr>
      <td colSpan={99} className="px-6 py-16 text-center">
        <Inbox className="mx-auto size-7 text-muted/60" aria-hidden="true" />
        <p className="mt-4 text-[0.9375rem] font-semibold text-foreground">
          {message}
        </p>
        {hint && (
          <p className="mt-1 text-sm text-muted">{hint}</p>
        )}
      </td>
    </tr>
  );
}

export function PageToolbar({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-6">
      <div className="max-w-xl">
        <h2 className="font-heading text-2xl font-bold tracking-[-0.02em] text-foreground">
          {title}
        </h2>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
          {description}
        </p>
      </div>
      {children && <div className="flex shrink-0 items-center gap-3">{children}</div>}
    </div>
  );
}
