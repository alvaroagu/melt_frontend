import "./globals.css";
import { Bricolage_Grotesque, Geist_Mono, Onest } from "next/font/google";
import DashboardLayout from "@/components/layout/DashboardLayout";
import NavBar from "@/components/layout/NavBar";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const onest = Onest({
  subsets: ["latin"],
  variable: "--font-onest",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${onest.variable} ${bricolage.variable} ${geistMono.variable} min-h-screen`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased font-sans transition-colors">
        <ThemeProvider>
          <div className="min-h-screen w-full flex flex-col">
            <NavBar />
            <DashboardLayout>{children}</DashboardLayout>
            <Toaster richColors position="top-right" />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
