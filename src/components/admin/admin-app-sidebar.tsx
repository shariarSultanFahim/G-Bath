"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, UserCheck, Calendar, ClipboardList, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

interface AdminAppSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export function AdminAppSidebar({ user }: AdminAppSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/appointments", label: "Appointments", icon: Calendar },
    { href: "/admin/customers", label: "Customers", icon: Users },
    { href: "/admin/salespersons", label: "Salespersons", icon: UserCheck },
    { href: "/admin/assessments", label: "Assessments", icon: ClipboardList },
  ];

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <Image
            src="/logo-512.png"
            alt="G-Bath Logo"
            width={36}
            height={36}
            className="h-11 w-11 object-contain shrink-0"
          />
          <div className="group-data-[state=collapsed]:hidden flex flex-col gap-0.5">
            <span className="text-lg font-bold tracking-tight text-[#E8621A]">Good Bathroom Renos</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={isActive ? "bg-orange-50 text-[#E8621A] font-bold" : "text-muted-foreground"}
                    >
                      <Link href={item.href}>
                        <Icon data-icon="inline-start" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border gap-3">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-foreground truncate">{user.name}</span>
          <span className="text-xs text-muted-foreground">Owner / Admin</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
        >
          <LogOut data-icon="inline-start" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
