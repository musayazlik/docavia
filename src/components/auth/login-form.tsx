"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, CircleAlert, LayoutDashboard, Lock, Mail, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  AuthHeading,
  Checkbox,
  PasswordField,
  SubmitButton,
  TextField,
  authEase,
} from "@/components/auth/fields";
import { authClient } from "@/lib/auth-client";

type Status = "idle" | "sending" | "sent";

export function LoginForm() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    form?: string;
  }>({});
  const reduce = useReducedMotion();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status !== "idle") return;

    const next: typeof errors = {};
    if (!email.trim()) next.email = "Please enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "That email address doesn't look right.";
    if (!password) next.password = "Please enter your password.";

    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    setErrors({});
    setStatus("sending");

    try {
      const result = await authClient.signIn.email({
        email: email.trim(),
        password,
        rememberMe: remember,
      });

      if (result.error) {
        setStatus("idle");
        setErrors({
          form:
            result.error.status === 401
              ? "Email or password is incorrect."
              : (result.error.message ?? "Sign-in failed. Please try again."),
        });
        return;
      }

      setStatus("sent");
      router.push("/admin");
      router.refresh();
    } catch {
      setStatus("idle");
      setErrors({
        form: "Could not reach the server. Check your connection and retry.",
      });
    }
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "sent" ? (
        <motion.div
          key="sent"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
          transition={{ duration: 0.45, ease: authEase }}
        >
          <SuccessPanelInline email={email} />
        </motion.div>
      ) : (
        <motion.div
          key="form"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
          transition={{ duration: 0.45, ease: authEase }}
        >
          <AuthHeading
            eyebrow="Admin Panel"
            title={
              <>
                Welcome{" "}
                <em className="font-accent font-normal text-primary italic">
                  back.
                </em>
              </>
            }
            description="Sign in to manage appointments, doctors, services and site content."
          />

          <form onSubmit={handleSubmit} noValidate className="mt-9">
            {errors.form && (
              <p
                role="alert"
                className="mb-6 flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm leading-relaxed text-red-700"
              >
                <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                {errors.form}
              </p>
            )}

            <div className="space-y-6">
              <TextField
                id="login-email"
                label="Email"
                type="email"
                inputMode="email"
                icon={Mail}
                autoComplete="email"
                placeholder="admin@docavia.com"
                value={email}
                onChange={(value) => {
                  setEmail(value);
                  setErrors((e) => ({ ...e, email: undefined, form: undefined }));
                }}
                error={errors.email}
              />
              <PasswordField
                id="login-password"
                label="Password"
                icon={Lock}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(value) => {
                  setPassword(value);
                  setErrors((e) => ({ ...e, password: undefined, form: undefined }));
                }}
                error={errors.password}
              />
            </div>

            <div className="mt-6">
              <Checkbox name="login-remember" checked={remember} onChange={setRemember}>
                Keep me signed in on this device
              </Checkbox>
            </div>

            <div className="mt-8">
              <SubmitButton pending={status === "sending"}>
                Sign In
                {status === "idle" && (
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                )}
              </SubmitButton>
            </div>

            <p className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-muted">
              <ShieldCheck className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
              Restricted area — Docavia staff only.
            </p>
          </form>

          <p className="mt-8 border-t border-border pt-7 text-center text-sm text-muted">
            Trouble signing in?{" "}
            <a
              href="mailto:support@docavia.com"
              className="font-semibold text-primary underline-offset-4 transition-colors hover:underline"
            >
              Contact support
            </a>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SuccessPanelInline({ email }: { email: string }) {
  return (
    <div
      role="status"
      className="rounded-3xl border border-border bg-white p-8 shadow-card sm:p-10"
    >
      <span className="flex size-14 items-center justify-center rounded-2xl bg-primary-light text-primary">
        <LayoutDashboard className="size-6" aria-hidden="true" />
      </span>
      <h1 className="font-heading mt-6 text-2xl font-bold tracking-tight text-foreground">
        Welcome back.
      </h1>
      <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
        You&apos;re signed in as{" "}
        <span className="font-semibold text-foreground">{email}</span>.
        Opening the admin panel…
      </p>
    </div>
  );
}
