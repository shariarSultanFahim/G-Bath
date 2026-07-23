import { requireRole } from "@/lib/auth-utils";
import { Role } from "@prisma/client";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AdminAppSidebar } from "@/components/admin/admin-app-sidebar";
import { NotificationBell } from "@/components/admin/notification-bell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole(Role.ADMIN);

  return (
    <SidebarProvider defaultOpen={true}>
      <AdminAppSidebar user={{ name: user.name, email: user.email }} />
      <SidebarInset className="flex flex-col bg-background">
        <header className="flex h-14 items-center justify-between border-b border-border bg-background px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Good Bathroom Renos — Admin Portal
            </span>
          </div>

          <div className="flex items-center gap-2">
            <NotificationBell />
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
