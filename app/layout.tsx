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
          <DashboardLayout>
            {children}
          </DashboardLayout>
        </div>
      </body>
    </html>
  );
}
