// src/app/layout.tsx
import type { Metadata } from "next";
import {
  Outfit,
  Manrope,
  Space_Grotesk,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";
import "react-circular-progressbar/dist/styles.css";
import { Toaster } from "@/components/ui/toaster";
import { QueryProvider } from "@/providers/QueryProvider"; // ← new import

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-ui",
  weight: ["500", "600"],
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "IDS Africa Self-Care Portal",
  description: "Your gateway to truly unlimited internet access",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${manrope.variable} ${outfit.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable} font-sans antialiased`}
      >
        <QueryProvider>
          {" "}
          {/* ← wrap here */}
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
