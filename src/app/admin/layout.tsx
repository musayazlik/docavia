import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { requireSession } from "@/lib/auth-server";

export const metadata: Metadata = {
  title: {
    default: "Admin — Docavia",
    template: "%s — Docavia Admin",
  },
  robots: { index: false, follow: false },
};

/**
 * Admin shell — deep-pine sidebar plus a calm light workspace. Every child
 * page inherits the session guard performed here.
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

  return (
    <div className="flex min-h-dvh bg-background">
      <AdminSidebar user={user} />
      <div className="flex min-w-0 flex-1 flex-col lg:pl-[17.5rem]">
        <main id="main" className="flex-1 px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
          {children}
        </main>
        <footer className="px-5 pb-8 text-xs text-muted sm:px-8 lg:px-12">
          Docavia Admin · Staff area
        </footer>
      </div>
    </div>
  );
}
