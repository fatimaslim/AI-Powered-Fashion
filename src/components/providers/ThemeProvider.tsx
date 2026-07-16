"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";
import { useAuthHydration } from "@/store/auth-store";

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Hydrate auth state on every page
  useAuthHydration();

  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      {children}
    </NextThemesProvider>
  );
}
