"use client";

import type { ReactNode } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { TooltipProvider } from "@/components/ui";
import { CounterProvider, QueryProvider, ThemeProvider } from "@/providers";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <NuqsAdapter>
      <TooltipProvider>
        <ThemeProvider>
          <CounterProvider>
            <QueryProvider>{children}</QueryProvider>
          </CounterProvider>
        </ThemeProvider>
      </TooltipProvider>
    </NuqsAdapter>
  );
}
