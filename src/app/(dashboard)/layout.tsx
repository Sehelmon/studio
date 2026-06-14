import { SidebarNav } from "@/components/dashboard/SidebarNav";
import { TopBar } from "@/components/dashboard/TopBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <SidebarNav />
      <div className="flex-1 ml-64 flex flex-col">
        <TopBar />
        <main className="p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
