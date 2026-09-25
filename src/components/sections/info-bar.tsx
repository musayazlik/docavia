import { ArrowRight } from "lucide-react";
import { infoItems } from "@/lib/data";
import { Reveal } from "@/components/motion/reveal";

export function InfoBar() {
  return (
    <div className="shell relative z-10 -mt-16 md:-mt-20">
      <Reveal>
        <dl className="grid gap-px overflow-hidden rounded-[1.75rem] border border-border/80 bg-border/80 shadow-card sm:grid-cols-3">
          {infoItems.map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-4 bg-white p-6 md:p-7"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                <item.icon className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <dt className="font-heading text-[1.05rem] font-bold tracking-tight text-foreground">
                  {item.title}
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted">
                  {item.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </dd>
                {item.action && (
                  <a
                    href={item.action.href}
                    className="group/link mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
                  >
                    {item.action.label}
                    <ArrowRight
                      className="size-3.5 transition-transform duration-300 group-hover/link:translate-x-1"
                      aria-hidden="true"
                    />
                  </a>
                )}
              </div>
            </div>
          ))}
        </dl>
      </Reveal>
    </div>
  );
}
