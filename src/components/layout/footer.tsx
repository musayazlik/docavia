import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { footerColumns } from "@/lib/data";
import { getContent } from "@/lib/content/store";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M13.5 21v-7.2h2.42l.36-2.8H13.5V9.2c0-.81.22-1.36 1.38-1.36h1.48V5.35c-.26-.03-1.14-.11-2.16-.11-2.14 0-3.6 1.3-3.6 3.7V11H8.2v2.8h2.4V21h2.9Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className={className}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.2 4h2.6l-5.7 6.5L20.8 20h-5.3l-4.1-5.4L6.6 20H4l6.1-7L3.6 4H9l3.7 4.9L17.2 4Zm-.9 14.4h1.4L7.9 5.5H6.4l9.9 12.9Z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M6.9 8.6H4V20h2.9V8.6ZM5.4 7.3a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4ZM10 20h2.9v-5.7c0-.3 0-.6.1-.8.3-.6.9-1.2 1.9-1.2 1.3 0 1.9.9 1.9 2.3V20h2.9v-5.8c0-3-1.6-4.4-3.7-4.4-1.7 0-2.5 1-2.9 1.6h-.1V8.6H10c0 .8 0 11.4 0 11.4Z" />
    </svg>
  );
}

const socials = [
  { Icon: FacebookIcon, label: "Facebook", href: "#" },
  { Icon: InstagramIcon, label: "Instagram", href: "#" },
  { Icon: XIcon, label: "X (Twitter)", href: "#" },
  { Icon: LinkedInIcon, label: "LinkedIn", href: "#" },
];

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
              {socials.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex size-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all duration-300 hover:border-white/30 hover:bg-white/10 hover:text-white"
                >
                  <Icon className="size-4" />
                </a>
              ))}
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
