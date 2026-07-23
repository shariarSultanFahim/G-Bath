import Link from "next/link";
import { requireRole } from "@/lib/auth-utils";
import { Role } from "@prisma/client";
import { LayoutDashboard, Users, UserCheck, ClipboardList, LogOut } from "lucide-react";
import { AdminSignOutButton } from "@/components/admin/sign-out-button";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole(Role.ADMIN);

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/customers", label: "Customers", icon: Users },
    { href: "/admin/salespersons", label: "Salespersons", icon: UserCheck },
    { href: "/admin/assessments", label: "Assessments", icon: ClipboardList },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col justify-between p-6 shrink-0">
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-[#E8621A]">Good</h1>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Admin Dashboard
            </p>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-orange-50 hover:text-[#E8621A]"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Sign Out */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <div>
            <p className="text-sm font-bold text-slate-900">{user.name}</p>
            <p className="text-xs text-slate-400">Owner / Admin</p>
          </div>
          <AdminSignOutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
