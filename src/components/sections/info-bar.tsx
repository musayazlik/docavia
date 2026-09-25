import { ArrowRight, CalendarCheck, HeartPulse, Stethoscope, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { getContent } from "@/lib/content/store";

const ICONS: LucideIcon[] = [HeartPulse, Stethoscope, CalendarCheck];

export async function InfoBar() {
  const content = await getContent();

  return (
    <div className="shell relative z-10 -mt-16 md:-mt-20">
      <Reveal>
        <dl className="grid gap-px overflow-hidden rounded-[1.75rem] border border-border/80 bg-border/80 shadow-card sm:grid-cols-3">
          {content.infoBar.items.map((item, index) => {
            const Icon = ICONS[index % ICONS.length];
            return (
              <div
                key={item.title + index}
                className="flex items-start gap-4 bg-white p-6 md:p-7"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <dt className="font-heading text-[1.05rem] font-bold tracking-tight text-foreground">
                    {item.title}
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted">
                    {item.lines.map((line, lineIndex) => (
                      <span key={line + lineIndex} className="block">
                        {line}
                      </span>
                    ))}
                  </dd>
                  {item.actionLabel && item.actionHref && (
                    <a
                      href={item.actionHref}
                      className="group/link mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
                    >
                      {item.actionLabel}
                      <ArrowRight
                        className="size-3.5 transition-transform duration-300 group-hover/link:translate-x-1"
                        aria-hidden="true"
                      />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </dl>
      </Reveal>
    </div>
  );
}
