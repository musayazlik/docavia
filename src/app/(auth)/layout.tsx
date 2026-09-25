import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { BrandPanel } from "@/components/auth/brand-panel";
import { Logo } from "@/components/ui/logo";

/**
 * Shared split-screen shell for auth pages: brand panel on the left
 * (large screens), focused form column on the right. Deliberately
 * navbar-free to keep the flow distraction-free.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col lg:grid lg:grid-cols-[1.05fr_1fr] xl:grid-cols-[1.1fr_1fr]">
      <BrandPanel />

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between px-6 py-6 sm:px-10 lg:px-14">
          <span className="lg:hidden">
            <Link href="/" aria-label="Docavia — home">
              <Logo />
            </Link>
          </span>
          <Link
            href="/"
            className="ml-auto inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors duration-200 hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to home
          </Link>
        </header>

        <main
          id="main"
          className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10 lg:px-14 lg:py-12"
        >
          <div className="w-full max-w-md">{children}</div>
        </main>

        <footer className="flex flex-col items-center justify-between gap-3 px-6 pb-8 text-xs text-muted sm:flex-row sm:px-10 lg:px-14">
          <p>© 2026 Docavia. All rights reserved.</p>
          <p className="flex items-center gap-5">
            <Link
              href="/"
              className="transition-colors duration-200 hover:text-foreground"
            >
              Privacy Policy
            </Link>
            <Link
              href="/"
              className="transition-colors duration-200 hover:text-foreground"
            >
              Terms of Service
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
