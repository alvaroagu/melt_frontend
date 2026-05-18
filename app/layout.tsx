import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="min-h-full">
      <body className="min-h-full bg-background text-foreground antialiased transition-colors">
        <div className="min-h-full w-full flex">
          <Sidebar />
          <main className="flex-1 min-h-full">
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
