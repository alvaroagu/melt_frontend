import { Sidebar } from "../Sidebar";
import { SidebarProvider } from "../SidebarContext";
import ContentLayout from "./ContentLayout";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <main className="flex min-h-screen w-full">
        <Sidebar />
        <ContentLayout>{children}</ContentLayout>
      </main>
    </SidebarProvider>
  );
}

