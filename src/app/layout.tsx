import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://docavia.com"),
  title: {
    default: "Docavia — Modern Healthcare & Medical Specialists",
    template: "%s — Docavia",
  },
  description:
    "Expert healthcare, experienced specialists and simple appointments. Discover modern patient-centered care with Docavia.",
  keywords: [
    "healthcare",
    "medical clinic",
    "doctors",
    "appointments",
    "specialists",
    "Docavia",
  ],
  openGraph: {
    type: "website",
    siteName: "Docavia",
    title: "Docavia — Modern Healthcare & Medical Specialists",
    description:
      "Expert healthcare, experienced specialists and simple appointments. Discover modern patient-centered care with Docavia.",
    images: [{ url: "/images/og.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Docavia — Modern Healthcare & Medical Specialists",
    description:
      "Expert healthcare, experienced specialists and simple appointments.",
    images: ["/images/og.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${dmSans.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
