"use client";

import { RootState } from "@/redux/store";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";
import { useSelector } from "react-redux";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const {theme} = useSelector((state : RootState) => state.theme)
  return (
    <NextThemesProvider attribute="class" defaultTheme={theme}>
      {children}
    </NextThemesProvider>
  );
}
