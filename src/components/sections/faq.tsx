import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { getContent } from "@/lib/content/store";

export async function Faq() {
  const content = await getContent();
  const faq = content.faq;

  return (
    <section id="faq" className="py-24 md:py-32">
      <div className="shell grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <SectionHeading
            eyebrow={faq.eyebrow}
            title={
              <>
                {faq.title}{" "}
                <em className="font-accent font-normal text-primary italic">
                  {faq.titleAccent}
                </em>
              </>
            }
            description={faq.description}
          />

          <Reveal className="mt-10" delay={0.1}>
            <div className="flex items-center gap-4 rounded-2xl border border-border bg-white p-5">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                <Phone className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm text-muted">{faq.callLabel}</p>
                <a
                  href={content.site.phoneHref}
                  className="font-heading text-lg font-bold text-foreground transition-colors hover:text-primary"
                >
                  {content.site.phone}
                </a>
              </div>
            </div>
            <Button href="/contact" className="mt-5" withArrow>
              Contact Us
            </Button>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <FaqAccordion items={faq.items.map((item) => ({ ...item }))} />
        </Reveal>
      </div>
    </section>
  );
}
