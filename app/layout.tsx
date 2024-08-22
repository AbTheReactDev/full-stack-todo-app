import NextAuthProvider from "@/components/NextAuthProvider";
import "bootstrap/dist/css/bootstrap.min.css";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export const metadata = {
  title: "Todo App",
  description: "A simple todo app with authentication",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
