import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/components/app-provider";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "NEGO — good finds, good people",
  description: "A more human way to find your next favorite thing.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="grain">
        <AppProvider>
          <SiteHeader />
          <main className="min-h-[calc(100dvh-76px)] pb-20 md:pb-0">{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}
