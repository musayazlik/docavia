import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireSession } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Admin — Docavia",
    template: "%s — Docavia Admin",
  },
  robots: { index: false, follow: false },
};

/**
 * Admin shell — deep-pine sidebar, fixed top header, fixed footer and a
 * scrolling main area. Every child page inherits the session guard here.
 */
export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireSession();
  const user = {
    name: session.user.name,
    email: session.user.email,
  };

  return <AdminShell user={user}>{children}</AdminShell>;
}
