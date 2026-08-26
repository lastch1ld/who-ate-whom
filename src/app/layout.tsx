import type { Metadata } from "next";
import { Fraunces, Libre_Franklin, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display-src",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

const body = Libre_Franklin({
  variable: "--font-body-src",
  subsets: ["latin"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono-src",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Consolidation Atlas",
  description:
    "How American industries have folded from dozens of companies into a handful of survivors.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
