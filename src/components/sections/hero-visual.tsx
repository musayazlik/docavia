"use client";

import { motion, useReducedMotion } from "motion/react";
import { CalendarClock, HeartPulse, Users } from "lucide-react";
import Image from "next/image";

const EASE = [0.22, 1, 0.36, 1] as const;

function FloatingCard({
  className,
  icon,
  value,
  label,
  delay,
}: {
  className?: string;
  icon: React.ReactNode;
  value: string;
  label: string;
  delay: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={className}
    >
      <div className="flex animate-float items-center gap-3.5 rounded-2xl border border-border/70 bg-white/92 p-4 shadow-float backdrop-blur-md motion-reduce:animate-none">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
          {icon}
        </span>
        <div>
          <p className="font-heading text-lg leading-tight font-bold tracking-tight text-foreground">
            {value}
          </p>
          <p className="text-xs leading-snug text-muted">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function HeroVisual() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.96, y: 28 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
      className="relative mx-auto w-full max-w-[540px]"
    >
      {/* decorative shapes behind the doctor */}
      <div
        aria-hidden="true"
        className="absolute -top-12 -right-8 size-64 rotate-12 rounded-[3rem] bg-primary-light/80 blur-2xl sm:size-72"
      />
      <div
        aria-hidden="true"
        className="bg-dots absolute -bottom-10 -left-10 size-36 opacity-80"
      />

      <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] rounded-tr-[6.5rem] shadow-soft">
        <Image
          src="/images/hero-doctor.jpg"
          alt="Smiling doctor in a white coat standing in a bright, modern clinic corridor"
          fill
          priority
          sizes="(min-width: 1024px) 44vw, (min-width: 640px) 70vw, 100vw"
          className="object-cover"
        />
      </div>

      <FloatingCard
        className="absolute top-12 -left-3 sm:-left-12"
        icon={<Users className="size-5" aria-hidden="true" />}
        value="500+"
        label="Experienced Doctors"
        delay={0.55}
      />
      <FloatingCard
        className="absolute -right-3 bottom-24 sm:-right-10"
        icon={<HeartPulse className="size-5" aria-hidden="true" />}
        value="24/7"
        label="Medical Support"
        delay={0.7}
      />

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.85, ease: EASE }}
        className="absolute bottom-6 -left-2 sm:-left-8"
      >
        <div className="flex animate-float-slow items-center gap-2.5 rounded-full border border-border/70 bg-white/92 py-2.5 pr-4 pl-3 shadow-float backdrop-blur-md motion-reduce:animate-none">
          <span className="flex size-7 items-center justify-center rounded-full bg-primary text-white">
            <CalendarClock className="size-3.5" aria-hidden="true" />
          </span>
          <span className="text-xs font-semibold text-foreground">
            Next slot available today
          </span>
          <span className="relative flex size-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
