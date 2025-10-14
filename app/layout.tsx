import type { Metadata } from "next";
import {
  Bebas_Neue,
  Montserrat,
  Poppins,
  Playfair_Display,
} from "next/font/google";

import { cn } from "@/lib/utils";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
});
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-montserrat",
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-playfair",
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
          bebasNeue.variable,
          montserrat.variable,
          poppins.variable,
          playfair.variable,
        )}
      >
        {children}
      </body>
    </html>
  );
}
