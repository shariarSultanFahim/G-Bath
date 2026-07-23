import { AppSidebar } from "@/components/layouts/app-sidebar";
import { Separator } from "@/components/ui";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        </header>
        <div className="flex flex-1 flex-col gap-4 overflow-y-hidden rounded-tl-xl bg-background p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
