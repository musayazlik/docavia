"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

const EASE = [0.22, 1, 0.36, 1] as const;
const TOAST_DURATION = 5000;

type ToastKind = "success" | "error" | "info";

type ToastItem = {
  id: number;
  kind: ToastKind;
  message: string;
};

type ToastContextValue = {
  toastSuccess: (message: string) => void;
  toastError: (message: string) => void;
  toastInfo: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * Admin toast stack — bottom-right, motion-animated. API warnings (e.g.
 * permission denials for demo accounts) and action results surface here.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const idRef = useRef(0);
  const reduce = useReducedMotion();

  const dismiss = useCallback((id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const push = useCallback(
    (kind: ToastKind, message: string) => {
      const id = ++idRef.current;
      setItems((current) => [...current, { id, kind, message }]);
      setTimeout(() => dismiss(id), TOAST_DURATION);
    },
    [dismiss]
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      toastSuccess: (message) => push("success", message),
      toastError: (message) => push("error", message),
      toastInfo: (message) => push("info", message),
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed right-6 bottom-6 z-100 flex w-full max-w-sm flex-col gap-3"
      >
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              role="status"
              initial={
                reduce ? { opacity: 0 } : { opacity: 0, x: 32, scale: 0.97 }
              }
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: 32, scale: 0.97 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-border bg-white p-4 shadow-card"
            >
              {item.kind === "success" ? (
                <CheckCircle2
                  className="mt-0.5 size-5 shrink-0 text-primary"
                  aria-hidden="true"
                />
              ) : item.kind === "info" ? (
                <Info
                  className="mt-0.5 size-5 shrink-0 text-muted"
                  aria-hidden="true"
                />
              ) : (
                <AlertCircle
                  className="mt-0.5 size-5 shrink-0 text-red-600"
                  aria-hidden="true"
                />
              )}
              <p className="flex-1 text-[0.9375rem] leading-relaxed font-medium text-foreground">
                {item.message}
              </p>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                aria-label="Dismiss notification"
                className="-mt-1 -mr-1 flex size-8 shrink-0 items-center justify-center rounded-lg text-muted transition-colors duration-200 hover:bg-secondary hover:text-foreground"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
