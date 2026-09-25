"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Minus, Phone, Plus } from "lucide-react";
import { useState } from "react";
import { faqs } from "@/lib/data";
import { site } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

function FaqItem({
  question,
  answer,
  open,
  onToggle,
  id,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
  id: string;
}) {
  const reduce = useReducedMotion();

  return (
    <div className="border-b border-border">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-button`}
          className="group flex w-full items-center justify-between gap-6 py-6 text-left"
        >
          <span
            className={cn(
              "font-heading text-[1.05rem] font-bold tracking-tight transition-colors duration-300 md:text-lg",
              open ? "text-primary" : "text-foreground group-hover:text-primary"
            )}
          >
            {question}
          </span>
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
              open
                ? "border-primary bg-primary text-white"
                : "border-border text-foreground group-hover:border-primary/50"
            )}
            aria-hidden="true"
          >
            {open ? (
              <Minus className="size-4" />
            ) : (
              <Plus className="size-4" />
            )}
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            id={`${id}-panel`}
            role="region"
            aria-labelledby={`${id}-button`}
            initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="max-w-xl pb-7 text-[0.9375rem] leading-relaxed text-muted">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 md:py-32">
      <div className="shell grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="FAQ"
            title={
              <>
                Questions?{" "}
                <em className="font-accent font-normal text-primary italic">
                  We&apos;re Here to Help.
                </em>
              </>
            }
            description="Everything you need to know before your visit. If you can&apos;t find your answer here, our care team is one call away."
          />

          <Reveal className="mt-10" delay={0.1}>
            <div className="flex items-center gap-4 rounded-2xl border border-border bg-white p-5">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                <Phone className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm text-muted">Call us anytime</p>
                <a
                  href={site.phoneHref}
                  className="font-heading text-lg font-bold text-foreground transition-colors hover:text-primary"
                >
                  {site.phone}
                </a>
              </div>
            </div>
            <Button href="/contact" className="mt-5" withArrow>
              Contact Us
            </Button>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <div className="border-t border-border">
            {faqs.map((faq, index) => (
              <FaqItem
                key={faq.question}
                id={`faq-${index}`}
                question={faq.question}
                answer={faq.answer}
                open={openIndex === index}
                onToggle={() =>
                  setOpenIndex((current) =>
                    current === index ? null : index
                  )
                }
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
