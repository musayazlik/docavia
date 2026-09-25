"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

export const fieldClass =
  "w-full rounded-xl border border-border bg-white px-4 py-3.5 text-[0.9375rem] text-foreground placeholder:text-muted/70 transition-colors duration-200 hover:border-primary/35 focus:border-primary focus:outline-none";

export const labelClass =
  "mb-2 block font-heading text-sm font-bold tracking-tight text-foreground";

export type Option = { value: string; label: string };

/**
 * Custom dropdown styled to the site's design language — the native
 * select menu can't be styled, so we render our own accessible listbox.
 */
export function SelectField({
  id,
  label,
  options,
  placeholder,
  value,
  onChange,
  hasError = false,
  disabled = false,
}: {
  id: string;
  label: string;
  options: Option[];
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const select = (option: Option) => {
    onChange(option.value);
    setOpen(false);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        setOpen(true);
        setHighlighted(options.findIndex((o) => o.value === value));
      }
      return;
    }
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setHighlighted((i) => Math.min(options.length - 1, i + 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setHighlighted((i) => Math.max(0, i - 1));
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (highlighted >= 0) select(options[highlighted]);
        break;
      case "Escape":
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  const selected = options.find((option) => option.value === value);

  return (
    <div ref={rootRef} className="relative">
      <span id={`${id}-label`} className={labelClass}>
        {label}
      </span>
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-controls={`${id}-listbox`}
        aria-haspopup="listbox"
        aria-labelledby={`${id}-label`}
        aria-activedescendant={
          open && highlighted >= 0 ? `${id}-option-${highlighted}` : undefined
        }
        onClick={() => {
          if (disabled) return;
          setOpen((o) => !o);
          setHighlighted(options.findIndex((o) => o.value === value));
        }}
        onKeyDown={onKeyDown}
        disabled={disabled}
        className={cn(
          fieldClass,
          "flex items-center justify-between text-left",
          hasError && "border-red-400 focus:border-red-500",
          disabled && "cursor-not-allowed opacity-60 hover:border-border"
        )}
      >
        <span className={selected ? "" : "text-muted/70"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-4 shrink-0 text-muted transition-transform duration-300",
            open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={`${id}-listbox`}
            role="listbox"
            aria-labelledby={`${id}-label`}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="absolute inset-x-0 top-full z-20 mt-2 max-h-60 overflow-auto rounded-xl border border-border bg-white p-1.5 shadow-card"
          >
            {options.map((option, index) => {
              const isSelected = option.value === value;
              return (
                <li
                  key={option.value}
                  id={`${id}-option-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setHighlighted(index)}
                  onClick={() => select(option)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between rounded-lg px-3.5 py-2.5 text-[0.9375rem] transition-colors duration-150",
                    index === highlighted
                      ? "bg-secondary text-foreground"
                      : "text-foreground/80",
                    isSelected && "font-semibold"
                  )}
                >
                  {option.label}
                  {isSelected && (
                    <Check className="size-4 shrink-0 text-primary" aria-hidden="true" />
                  )}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
