import type { Metadata } from "next";
import {
  Playfair_Display,
  Merriweather,
  Great_Vibes,
} from "next/font/google";

import { cn } from "@/lib/utils";
import "./globals.css";

// Festive Display Font - Traditional, elegant Christmas headings
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-display",
  display: "swap",
});

// Body Font - Highly readable serif with warm character
const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-body",
  display: "swap",
});

// Festive Accent Font - Special decorative elements
const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-festive",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Seasonal Santa | Santa Doorbell Magic",
  description:
    "Transform your security camera photo into magical Santa Claus videos. Upload, pay £12.50, and receive your personalized Christmas video within minutes!",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body
        className={cn(
          "grainy flex min-h-screen flex-col font-body antialiased",
          playfair.variable,
          merriweather.variable,
          greatVibes.variable,
        )}
      >
        {children}
      </body>
    </html>
  );
}
