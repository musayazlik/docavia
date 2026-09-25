"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
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

export function FaqAccordion({ items }: { items: Array<{ question: string; answer: string }> }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="border-t border-border">
      {items.map((faq, index) => (
        <FaqItem
          key={faq.question + index}
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
  );
}
