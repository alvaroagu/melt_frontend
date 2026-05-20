import { Sidebar } from "../Sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex-1 min-h-screen">
      <Sidebar>
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </Sidebar>
    </main>
  );
}

