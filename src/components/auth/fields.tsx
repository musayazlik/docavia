"use client";

import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useId, useState, type ComponentType, type ReactNode } from "react";
import { Eyebrow } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

const inputClass =
  "w-full rounded-xl border border-border bg-white py-3.5 text-[0.9375rem] text-foreground placeholder:text-muted/70 transition-colors duration-200 hover:border-primary/35 focus:border-primary focus:outline-none";

const labelClass =
  "mb-2 block font-heading text-sm font-bold tracking-tight text-foreground";

/* ---------------------------------- Fields --------------------------------- */

type TextFieldProps = {
  id?: string;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  icon?: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  /** Optional control rendered on the label row, e.g. "Forgot password?" */
  action?: ReactNode;
  /** Right-aligned adornment inside the input (overrides the toggle). */
  children?: ReactNode;
  inputMode?: "text" | "tel" | "email";
};

export function TextField({
  id,
  label,
  type = "text",
  placeholder,
  autoComplete,
  icon: Icon,
  value,
  onChange,
  error,
  action,
  children,
  inputMode,
}: TextFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={inputId} className={labelClass}>
          {label}
        </label>
        {action}
      </div>
      <div className="relative">
        {Icon && (
          <Icon
            className="pointer-events-none absolute top-1/2 left-4 size-4.5 -translate-y-1/2 text-muted/80"
            aria-hidden
          />
        )}
        <input
          id={inputId}
          name={inputId}
          type={type}
          inputMode={inputMode}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            inputClass,
            Icon ? "pl-11" : "px-4",
            children ? "pr-12" : undefined,
            error && "border-red-400 focus:border-red-500"
          )}
        />
        {children}
      </div>
      {error && (
        <p id={errorId} role="alert" className="mt-2 text-xs font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export function PasswordField(
  props: Omit<TextFieldProps, "type" | "children">
) {
  const [visible, setVisible] = useState(false);

  return (
    <TextField {...props} type={visible ? "text" : "password"}>
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute top-1/2 right-2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted transition-colors duration-200 hover:bg-secondary hover:text-foreground"
      >
        {visible ? (
          <EyeOff className="size-4.5" aria-hidden />
        ) : (
          <Eye className="size-4.5" aria-hidden />
        )}
      </button>
    </TextField>
  );
}

/* --------------------------------- Checkbox -------------------------------- */

export function Checkbox({
  name,
  checked,
  onChange,
  children,
  hasError,
}: {
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  hasError?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-muted"
      >
        <input
          id={name}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          aria-invalid={hasError ? true : undefined}
          className={cn(
            "mt-0.5 size-4.5 shrink-0 cursor-pointer rounded-[5px] border-border accent-primary",
            hasError && "accent-red-400"
          )}
        />
        <span>{children}</span>
      </label>
    </div>
  );
}

/* ------------------------------- Auth heading ------------------------------- */

export function AuthHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
}) {
  return (
    <header>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="font-heading mt-4 text-[2.05rem] leading-[1.1] font-bold tracking-[-0.025em] text-balance text-foreground sm:text-[2.4rem]">
        {title}
      </h1>
      <p className="mt-3.5 text-[0.9375rem] leading-relaxed text-muted">
        {description}
      </p>
    </header>
  );
}

/* -------------------------------- Submit button ------------------------------ */

export function SubmitButton({
  pending,
  children,
}: {
  pending: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-[0.9375rem] font-semibold text-white shadow-[0_12px_28px_-14px_rgb(47_118_109/0.6)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-[0_18px_36px_-14px_rgb(24_63_58/0.55)] active:translate-y-0 disabled:pointer-events-none disabled:opacity-60"
    >
      {pending ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : null}
      {pending ? "Just a moment…" : children}
    </button>
  );
}

/* ------------------------------ Success panel ------------------------------- */

export function SuccessPanel({
  icon: Icon,
  title,
  children,
  footer,
}: {
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div
      className="flex min-h-[24rem] flex-col items-center justify-center text-center"
      aria-live="polite"
    >
      <span className="flex size-16 items-center justify-center rounded-full bg-primary-light text-primary">
        <Icon className="size-8" aria-hidden />
      </span>
      <h2 className="font-heading mt-6 text-[1.65rem] font-bold tracking-tight text-foreground">
        {title}
      </h2>
      <div className="mt-3 max-w-sm text-[0.9375rem] leading-relaxed text-muted">
        {children}
      </div>
      <div className="mt-8">{footer}</div>
    </div>
  );
}

export const authEase = EASE;
