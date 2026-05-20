import "./globals.css";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="min-h-screen">
      <body className="min-h-screen bg-background text-foreground antialiased transition-colors">
        <div className="min-h-screen w-full flex">
          <main className="flex-1 min-h-screen">
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
              <DashboardLayout>
                {children}
              </DashboardLayout>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
