"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

export type TestimonialItem = {
  quote: string;
  name: string;
  role: string;
  avatar: string;
};

export function TestimonialsCarousel({
  eyebrow,
  title,
  titleAccent,
  items,
}: {
  eyebrow: string;
  title: string;
  titleAccent: string;
  items: TestimonialItem[];
}) {
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [maxShift, setMaxShift] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const maxIndex = Math.max(0, items.length - 1);

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    const slide = track.querySelector<HTMLElement>("[data-slide]");
    if (!slide) return;
    // offsetWidth already includes the slide's right padding that forms the gap
    setStep(slide.offsetWidth);
    // never scroll past the end of the track — the last position aligns to the end
    setMaxShift(Math.max(0, track.scrollWidth - viewport.clientWidth));
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const shift = Math.min(index * step, maxShift);

  return (
    <section id="testimonials" className="py-24 md:py-32">
      <div className="shell">
        <div className="rounded-[2.5rem] bg-secondary/70 px-6 py-14 sm:px-10 md:px-14 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <SectionHeading
              eyebrow={eyebrow}
              title={
                <>
                  {title}{" "}
                  <em className="font-accent font-normal text-primary italic">
                    {titleAccent}
                  </em>
                </>
              }
            />
            <Reveal delay={0.1}>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIndex((i) => Math.max(0, i - 1))}
                  disabled={index === 0}
                  aria-label="Previous testimonial"
                  className="flex size-12 items-center justify-center rounded-full border border-border bg-white text-foreground transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white disabled:pointer-events-none disabled:opacity-35"
                >
                  <ArrowLeft className="size-4.5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setIndex((i) => Math.min(maxIndex, i + 1))}
                  disabled={index === maxIndex}
                  aria-label="Next testimonial"
                  className="flex size-12 items-center justify-center rounded-full border border-border bg-white text-foreground transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white disabled:pointer-events-none disabled:opacity-35"
                >
                  <ArrowRight className="size-4.5" aria-hidden="true" />
                </button>
              </div>
            </Reveal>
          </div>

          <div ref={viewportRef} className="mt-12 overflow-hidden">
            <motion.div
              ref={trackRef}
              className="flex"
              animate={{ x: -shift }}
              transition={reduce ? { duration: 0 } : { duration: 0.75, ease: EASE }}
            >
              {items.map((testimonial, i) => (
                <figure
                  key={testimonial.name + i}
                  data-slide
                  className="w-full shrink-0 pr-0 sm:w-[88%] md:w-[72%] lg:w-[64%] md:pr-7"
                  aria-hidden={i !== index}
                >
                  <div
                    className={cn(
                      "flex h-full flex-col rounded-[1.75rem] border bg-white p-8 transition-all duration-500 md:p-10",
                      i === index
                        ? "border-border shadow-card"
                        : "border-border/60 opacity-60"
                    )}
                  >
                    <div className="flex gap-1 text-[#f2b01e]" aria-hidden="true">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} className="size-4 fill-current" />
                      ))}
                    </div>
                    <blockquote className="font-accent mt-6 text-[1.35rem] leading-snug text-foreground italic md:text-[1.6rem]">
                      “{testimonial.quote}”
                    </blockquote>
                    <figcaption className="mt-auto flex items-center gap-4 pt-8">
                      <Image
                        src={testimonial.avatar}
                        alt={`Portrait of ${testimonial.name}`}
                        width={48}
                        height={48}
                        className="size-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-heading text-[0.95rem] font-bold text-foreground">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-muted">{testimonial.role}</p>
                      </div>
                    </figcaption>
                  </div>
                </figure>
              ))}
            </motion.div>
          </div>

          {/* Dot hit areas meet the 24×24px minimum; the visible dot is smaller */}
          <div className="mt-8 flex justify-center gap-1">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full transition-colors duration-300",
                  i === index ? "text-primary" : "text-primary/25 hover:text-primary/45",
                )}
              >
                <span
                  className={cn(
                    "rounded-full bg-current transition-all duration-300",
                    i === index ? "h-2 w-7" : "h-2 w-2",
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
