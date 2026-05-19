import { mainMenu } from "@/lib/navigation";
import Sidebar from "../Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="min-h-screen">
      <body className="min-h-screen bg-background text-foreground antialiased transition-colors">
        <div className="min-h-screen w-full flex">
          <Sidebar menu={mainMenu} />
          <main className="flex-1 min-h-screen">
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
