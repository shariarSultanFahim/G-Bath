"use client";

import type { ReactNode } from "react";

import { TooltipProvider } from "@/components/ui";
import { CounterProvider, QueryProvider, ThemeProvider } from "@/providers";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <ThemeProvider>
        <CounterProvider>
          <QueryProvider>{children}</QueryProvider>
        </CounterProvider>
      </ThemeProvider>
    </TooltipProvider>
  );
}
