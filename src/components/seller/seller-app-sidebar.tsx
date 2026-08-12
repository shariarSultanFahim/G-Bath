"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Calendar, ClipboardCheck, UserRoundPen, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

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

interface SellerAppSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export function SellerAppSidebar({ user }: SellerAppSidebarProps) {
  const pathname = usePathname();
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/customers", label: "Customers", icon: Users },
    { href: "/appointments", label: "Appointments", icon: Calendar },
    { href: "/assessments", label: "Assessments", icon: ClipboardCheck },
    { href: "/profile", label: "Profile", icon: UserRoundPen },
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
                  pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

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

      <SidebarFooter className="border-sidebar-border gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSignOutConfirm(true)}
          className="w-full border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
        >
          <LogOut data-icon="inline-start" />
          <span className="group-data-[state=collapsed]:hidden flex">Sign Out</span>
        </Button>
      </SidebarFooter>

      {showSignOutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-background rounded-lg shadow-lg p-6 max-w-md w-full mx-4 border border-border">
            <h3 className="text-lg font-semibold mb-2">Confirm Sign Out</h3>
            <p className="text-muted-foreground mb-6">Are you sure you want to sign out of your account?</p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowSignOutConfirm(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </Sidebar>
  );
}
