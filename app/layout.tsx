import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "../components/layout/Sidebar";
import { StreakHandler } from "../components/layout/StreakHandler";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FocusForge - AI Study Planner",
  description: "Master your schedule with AI-powered planning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StreakHandler />
        <div className="flex bg-slate-950 min-h-screen text-white">
          <Sidebar />
          <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto pt-16 md:pt-0">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
