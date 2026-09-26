import Image from "next/image";
import Link from "next/link";
import { Globe, Mail, MapPin, Phone } from "lucide-react";
import { footerColumns } from "@/lib/data";
import { getContent } from "@/lib/content/store";
import { CmsIcon } from "@/components/ui/cms-icon";

/** Labels that map to a real brand logo via the bundled simple-icons set. */
const BRAND_LABELS = new Set([
  "facebook",
  "instagram",
  "x",
  "twitter",
  "linkedin",
  "youtube",
  "tiktok",
  "whatsapp",
  "telegram",
  "snapchat",
  "pinterest",
  "reddit",
  "discord",
  "spotify",
  "threads",
  "bluesky",
  "mastodon",
  "signal",
]);

export async function Footer() {
  const site = (await getContent()).site;

  return (
    <footer id="contact" className="bg-pine-deep text-white/65">
      <div className="shell pt-20 pb-10 md:pt-24">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.3fr_0.7fr_0.7fr_1fr] lg:gap-10">
          <div>
            <span className="inline-flex items-center gap-2.5">
              <Image
                src="/logo-mark-white.png"
                alt={`${site.name} logo`}
                width={520}
                height={476}
                className="h-9 w-auto"
              />
              <span className="font-heading text-[1.35rem] font-bold tracking-tight text-white">
                {site.name}
              </span>
            </span>
            <p className="mt-5 max-w-xs text-[0.9375rem] leading-relaxed">
              {site.footerTagline}
            </p>
            <div className="mt-6 flex gap-3">
              {site.socials.map((social, index) => {
                // Rows saved by older panel versions may use {platform,url}.
                const legacy = social as { platform?: string; url?: string };
                const label = social.label ?? legacy.platform ?? "Link";
                const href = social.href ?? legacy.url ?? "#";
                // Picked icon wins; known brand labels fall back to their
                // simple-icons logo; anything else gets a globe.
                const slug = label.trim().toLowerCase();
                const iconName =
                  social.icon ??
                  (BRAND_LABELS.has(slug) ? `brand:${slug}` : "");
                return (
                  <a
                    key={`${label}-${index}`}
                    href={href}
                    aria-label={label}
                    className="flex size-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all duration-300 hover:border-white/30 hover:bg-white/10 hover:text-white"
                  >
                    <CmsIcon
                      name={iconName}
                      fallback={Globe}
                      className="size-4"
                    />
                  </a>
                );
              })}
            </div>
          </div>

          {footerColumns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="font-heading text-sm font-bold tracking-[0.14em] text-white uppercase">
                {column.title}
              </h3>
              <ul className="mt-5 space-y-3 text-[0.9375rem]">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="transition-colors duration-200 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h3 className="font-heading text-sm font-bold tracking-[0.14em] text-white uppercase">
              Contact
            </h3>
            <ul className="mt-5 space-y-4 text-[0.9375rem]">
              <li>
                <a
                  href={site.phoneHref}
                  className="inline-flex items-center gap-3 transition-colors duration-200 hover:text-white"
                >
                  <Phone className="size-4 shrink-0 text-primary-light" aria-hidden="true" />
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={site.emailHref}
                  className="inline-flex items-center gap-3 transition-colors duration-200 hover:text-white"
                >
                  <Mail className="size-4 shrink-0 text-primary-light" aria-hidden="true" />
                  {site.email}
                </a>
              </li>
              <li className="inline-flex items-start gap-3">
                <MapPin className="mt-1 size-4 shrink-0 text-primary-light" aria-hidden="true" />
                <span>
                  {site.address}
                  <br />
                  {site.city}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-7 text-sm sm:flex-row">
          <p>{site.copyright}</p>
          <div className="flex gap-7">
            {[
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Terms", href: "/terms-of-service" },
              { label: "Cookies", href: "/privacy-policy#cookies" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="transition-colors duration-200 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
