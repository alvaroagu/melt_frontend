import "./globals.css";
import DashboardLayout from "@/components/layout/DashboardLayout";
import NavBar from "@/components/layout/NavBar";
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className="min-h-screen">
      <body className="min-h-screen bg-background text-foreground antialiased transition-colors">
        <ThemeProvider>
          <div className="min-h-screen w-full flex flex-col">
            <NavBar />
            <DashboardLayout>{children}</DashboardLayout>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
