import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";

import { seoConfig } from "@/config/seo";

import { Providers } from "@/providers";
import { Toaster } from "@/ui";

import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = seoConfig;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen w-full flex-col antialiased`}
      >
        <Providers>
          <main className="flex-1">{children}</main>
          <Toaster richColors />
        </Providers>
      </body>
    </html>
  );
}
