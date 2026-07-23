import { requireRole } from "@/lib/auth-utils";
import { Role } from "@prisma/client";
import { BottomNav } from "@/components/ui/bottom-nav";

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  await requireRole(Role.SELLER);

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F5] pb-20 text-slate-800">
      <main className="flex-1 px-4 pt-4 max-w-lg mx-auto w-full">{children}</main>
      <BottomNav />
    </div>
  );
}
