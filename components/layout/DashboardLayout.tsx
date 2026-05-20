import Sidebar from "../Siderbar";
import { TooltipProvider } from "../ui/tooltip";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex-1 min-h-screen">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <TooltipProvider>
          <Sidebar />
          {children}
        </TooltipProvider>
      </div>
    </main>
  );
}

