"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import {
  CalendarDays,
  Clock,
  Eye,
  Loader2,
  Trash2,
  Video,
} from "lucide-react";
import { Dialog } from "@/components/admin/ui/dialog";
import { DataTable, PageToolbar, TableEmptyState } from "@/components/admin/ui/table";
import { ActionMenu } from "@/components/admin/ui/actions-menu";
import { useToast } from "@/components/admin/toast";
import { deleteAppointment, setAppointmentStatus } from "@/app/admin/entity-actions";
import { cn } from "@/lib/utils";

export type AppointmentRow = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  department: string;
  doctor: string | null;
  date: string | null;
  timeSlot: string | null;
  visitType: string;
  notes: string | null;
  status: string;
  createdAt: Date;
};

const STATUS_STYLES: Record<string, string> = {
  new: "bg-primary-light text-primary-dark",
  confirmed: "bg-[#f2b01e]/15 text-[#8a6200]",
  completed: "bg-foreground/5 text-muted",
  cancelled: "bg-red-50 text-red-600",
};

function formatDate(date: Date | string | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function formatDateTime(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

export function AppointmentsClient({ rows }: { rows: AppointmentRow[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { toastSuccess, toastError } = useToast();
  const [filter, setFilter] = useState<string>("all");
  const [viewing, setViewing] = useState<AppointmentRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AppointmentRow | null>(null);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const row of rows) {
      map.set(row.status, (map.get(row.status) ?? 0) + 1);
    }
    return map;
  }, [rows]);

  const visible =
    filter === "all" ? rows : rows.filter((row) => row.status === filter);

  const changeStatus = (row: AppointmentRow, status: string) => {
    if (pending) return;
    startTransition(async () => {
      const result = await setAppointmentStatus({ id: row.id, status });
      if (result.ok) {
        toastSuccess(result.message);
        router.refresh();
      } else {
        toastError(result.message);
      }
    });
  };

  const confirmDelete = () => {
    if (pending || !deleteTarget) return;
    startTransition(async () => {
      const result = await deleteAppointment(deleteTarget.id);
      if (result.ok) {
        setDeleteTarget(null);
        toastSuccess("Appointment deleted.");
        router.refresh();
      } else {
        toastError(result.message);
      }
    });
  };

  const filters = [
    { key: "all", label: "All", count: rows.length },
    { key: "new", label: "New", count: counts.get("new") ?? 0 },
    { key: "confirmed", label: "Confirmed", count: counts.get("confirmed") ?? 0 },
    { key: "completed", label: "Completed", count: counts.get("completed") ?? 0 },
    { key: "cancelled", label: "Cancelled", count: counts.get("cancelled") ?? 0 },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 pb-16">
      <PageToolbar
        title="Appointments"
        description="Requests submitted through the public booking form — triage them here: confirm, complete or cancel."
      />

      <div className="flex flex-wrap items-center gap-2">
        {filters.map((entry) => (
          <button
            key={entry.key}
            type="button"
            onClick={() => setFilter(entry.key)}
            aria-pressed={filter === entry.key}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200",
              filter === entry.key
                ? "bg-primary text-white"
                : "border border-border bg-white text-foreground hover:border-primary/40 hover:text-primary",
            )}
          >
            {entry.label}
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[0.625rem] font-bold",
                filter === entry.key
                  ? "bg-white/20 text-white"
                  : "bg-secondary text-muted",
              )}
            >
              {entry.count}
            </span>
          </button>
        ))}
      </div>

      <DataTable
        headers={["Patient", "Department", "Preferred", "Type", "Status", "Requested", ""]}
      >
        {visible.length === 0 ? (
          <TableEmptyState
            message={filter === "all" ? "No appointments yet" : `No ${filter} appointments`}
            hint={
              filter === "all"
                ? "Submissions from the public booking form appear here."
                : undefined
            }
          />
        ) : (
          visible.map((row) => (
            <tr
              key={row.id}
              className="group transition-colors duration-200 hover:bg-secondary/40"
            >
              <td className="px-5 py-4">
                <p className="font-heading text-[0.9375rem] font-bold text-foreground">
                  {row.name}
                </p>
                <p className="text-sm text-muted">
                  {row.phone}
                  {row.email ? ` · ${row.email}` : ""}
                </p>
              </td>
              <td className="px-5 py-4">
                <span className="rounded-full bg-primary-light px-3 py-1 text-xs font-bold text-primary-dark">
                  {row.department}
                </span>
                {row.doctor && row.doctor !== "no-preference" && (
                  <p className="mt-1 text-xs text-muted">{row.doctor}</p>
                )}
              </td>
              <td className="px-5 py-4 text-sm whitespace-nowrap text-muted">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="size-3.5" aria-hidden="true" />
                  {formatDate(row.date)}
                </span>
                {row.timeSlot && (
                  <span className="mt-0.5 flex items-center gap-1.5">
                    <Clock className="size-3.5" aria-hidden="true" />
                    {row.timeSlot}
                  </span>
                )}
              </td>
              <td className="px-5 py-4 text-sm whitespace-nowrap text-muted">
                <span className="flex items-center gap-1.5">
                  {row.visitType === "video" ? (
                    <Video className="size-3.5" aria-hidden="true" />
                  ) : null}
                  {row.visitType === "video" ? "Video" : "In-person"}
                </span>
              </td>
              <td className="px-5 py-4">
                <span
                  className={cn(
                    "inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize",
                    STATUS_STYLES[row.status] ?? "bg-foreground/5 text-muted",
                  )}
                >
                  {row.status}
                </span>
              </td>
              <td className="px-5 py-4 text-sm whitespace-nowrap text-muted">
                {formatDateTime(row.createdAt)}
              </td>
              <td className="px-5 py-4">
                <div className="flex justify-end">
                  <ActionMenu
                    label={`Actions for ${row.name}`}
                    items={[
                      { label: "View details", icon: Eye, onSelect: () => setViewing(row) },
                      {
                        label: "Mark confirmed",
                        disabled: row.status === "confirmed",
                        onSelect: () => changeStatus(row, "confirmed"),
                      },
                      {
                        label: "Mark completed",
                        disabled: row.status === "completed",
                        onSelect: () => changeStatus(row, "completed"),
                      },
                      {
                        label: "Cancel request",
                        disabled: row.status === "cancelled",
                        onSelect: () => changeStatus(row, "cancelled"),
                      },
                      {
                        label: "Delete",
                        icon: Trash2,
                        danger: true,
                        onSelect: () => setDeleteTarget(row),
                      },
                    ]}
                  />
                </div>
              </td>
            </tr>
          ))
        )}
      </DataTable>

      {/* Details dialog */}
      <Dialog
        open={viewing !== null}
        onClose={() => setViewing(null)}
        size="lg"
        title={viewing?.name ?? ""}
        description={
          viewing
            ? `Requested ${formatDateTime(viewing.createdAt)} · ${viewing.department}`
            : ""
        }
      >
        {viewing && (
          <div className="space-y-5">
            <dl className="grid gap-x-8 gap-y-4 rounded-2xl bg-secondary/60 p-6 sm:grid-cols-2">
              {[
                { label: "Phone", value: viewing.phone },
                { label: "Email", value: viewing.email || "—" },
                { label: "Department", value: viewing.department },
                {
                  label: "Doctor",
                  value:
                    viewing.doctor === "no-preference" || !viewing.doctor
                      ? "No preference"
                      : viewing.doctor,
                },
                { label: "Preferred date", value: formatDate(viewing.date) },
                { label: "Preferred time", value: viewing.timeSlot || "Any time" },
                {
                  label: "Visit type",
                  value: viewing.visitType === "video" ? "Video consultation" : "In-person visit",
                },
                { label: "Status", value: viewing.status },
              ].map((entry) => (
                <div key={entry.label}>
                  <dt className="font-heading text-xs font-bold tracking-[0.14em] text-muted uppercase">
                    {entry.label}
                  </dt>
                  <dd className="mt-1 text-[0.9375rem] font-semibold text-foreground capitalize">
                    {entry.value}
                  </dd>
                </div>
              ))}
            </dl>
            {viewing.notes && (
              <div>
                <p className="font-heading text-xs font-bold tracking-[0.14em] text-muted uppercase">
                  Notes
                </p>
                <p className="mt-2 rounded-2xl border border-border bg-white p-4 text-[0.9375rem] leading-relaxed text-foreground">
                  {viewing.notes}
                </p>
              </div>
            )}
            <div className="flex flex-wrap justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => changeStatus(viewing, "confirmed")}
                disabled={pending || viewing.status === "confirmed"}
                className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-dark disabled:opacity-50"
              >
                Mark confirmed
              </button>
              <button
                type="button"
                onClick={() => setViewing(null)}
                className="rounded-xl px-5 py-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-secondary"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete appointment"
        description={
          deleteTarget
            ? `The request from “${deleteTarget.name}” will be permanently removed.`
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
            Delete
          </button>
        </div>
      </Dialog>
    </div>
  );
}
