"use client";

import NextAuthProvider from "@/components/NextAuthProvider";
import StoreProvider from "@/components/StoreProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ReactNode } from "react";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Todo App</title>
      </head>
      <body>
        <Toaster />
        <ThemeProvider>
          <NextAuthProvider>
            <StoreProvider>{children}</StoreProvider>
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
