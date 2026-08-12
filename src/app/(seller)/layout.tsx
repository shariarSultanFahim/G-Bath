import { requireRole, getCurrentUser } from "@/lib/auth-utils";
import { Role } from "@prisma/client";
import { BottomNav } from "@/components/ui/bottom-nav";
import { SellerNotificationListener } from "@/components/seller/seller-notification-listener";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { SellerAppSidebar } from "@/components/seller/seller-app-sidebar";

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole(Role.SELLER);
  const currentUser = await getCurrentUser();

  return (
    <SidebarProvider defaultOpen={true}>
      <SellerAppSidebar user={{ name: currentUser?.name, email: currentUser?.email }} />
      <SidebarInset className="flex flex-col bg-[#FAF8F5] pb-20 md:pb-0 text-slate-800 h-svh overflow-hidden">
        <SellerNotificationListener />
        
        {/* Desktop Header for Sidebar Trigger */}
        <header className="hidden md:flex h-14 items-center justify-between border-b border-border bg-background px-4 shrink-0">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 pt-4 w-full max-w-screen-xl mx-auto">
          {children}
        </main>
        
        <BottomNav />
      </SidebarInset>
    </SidebarProvider>
  );
}
