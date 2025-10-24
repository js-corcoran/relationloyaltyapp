import type { Metadata } from "next";
import "./globals.css";
import { MSWProvider } from "./(providers)/msw-provider";
import { ToastProvider } from "@/components/common/ToastHost";
import { AppProvider } from "@/state/app-context";
import { AppShell } from "@/components/nav/AppShell";

export const metadata: Metadata = {
  title: "Relation Loyalty App",
  description: "Next.js + Tailwind v4 + PWA + Design System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MSWProvider>
          <ToastProvider>
            <AppProvider>
              <AppShell>{children}</AppShell>
            </AppProvider>
          </ToastProvider>
        </MSWProvider>
      </body>
    </html>
  );
}
