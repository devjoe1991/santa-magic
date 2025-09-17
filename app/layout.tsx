import type { Metadata } from "next";
import { Inter, Playfair_Display, Mountains_of_Christmas } from "next/font/google";

import { cn } from "@/lib/utils";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const mountains = Mountains_of_Christmas({ 
  subsets: ["latin"], 
  weight: "400",
  variable: "--font-mountains" 
});

export const metadata: Metadata = {
  title: "Seasonal Santa | Santa Doorbell Magic",
  description: "Transform your doorbell footage into magical Santa Claus videos. Upload, pay £12.50, and receive your personalized Christmas video within minutes!",
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
          inter.variable,
          playfair.variable,
          mountains.variable,
        )}
      >
        {children}
      </body>
    </html>
  );
}
