import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Admin Sign In",
  description:
    "Sign in to the Docavia admin panel to manage appointments, doctors, services and site content.",
  robots: { index: false },
};

export default function LoginPage() {
  return <LoginForm />;
}
