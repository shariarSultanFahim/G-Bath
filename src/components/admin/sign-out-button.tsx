"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function AdminSignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="flex w-full items-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-4 py-2.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-100"
    >
      <LogOut className="h-4 w-4" /> Sign Out
    </button>
  );
}
