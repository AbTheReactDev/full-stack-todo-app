"use client";

import NextAuthProvider from "@/components/NextAuthProvider";
import StoreProvider from "@/components/StoreProvider";
import "bootstrap/dist/css/bootstrap.min.css";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Todo App</title>
      </head>
      <body>
        <NextAuthProvider>
          <StoreProvider>{children}</StoreProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
