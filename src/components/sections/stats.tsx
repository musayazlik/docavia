import { stats } from "@/lib/data";
import { Counter } from "@/components/motion/counter";
import { Reveal } from "@/components/motion/reveal";

export function Stats() {
  return (
    <section aria-label="Docavia in numbers" className="pb-4 md:pb-8">
      <div className="shell">
        <Reveal>
          <dl className="grid grid-cols-2 gap-y-10 rounded-[2rem] border border-border/80 bg-white px-6 py-12 shadow-card sm:px-10 md:py-14 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={
                  "text-center lg:text-left lg:first:pl-0" +
                  (index > 0 ? " lg:border-l lg:border-border lg:pl-10" : "")
                }
              >
                <dd className="font-heading text-[2.75rem] leading-none font-bold tracking-[-0.03em] text-foreground md:text-[3.25rem]">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </dd>
                <dt className="mt-3 text-sm font-medium text-muted">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
