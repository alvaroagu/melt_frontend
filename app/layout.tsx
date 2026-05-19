import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";
import ThemeToggle from "@/components/ui/ThemeToggle";

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
              <TooltipProvider>
                {/* <div className="flex justify-end mb-4"> */}
                {/*   <ThemeToggle /> */}
                {/* </div> */}
                {children}
              </TooltipProvider>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
