import Link from "next/link";
import { db } from "@/lib/db";
import { format } from "date-fns";
import { ArrowLeft, Phone, Mail, MapPin } from "lucide-react";
import { notFound } from "next/navigation";

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await db.customer.findUnique({
    where: { id },
    include: {
      assessments: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!customer) notFound();

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#E8621A]">Good</h1>
        <span className="text-xs text-slate-400 font-medium">{format(new Date(), "hh:mm a")}</span>
      </div>

      {/* Back button */}
      <Link href="/customers" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#E8621A]">
        <ArrowLeft className="h-4 w-4" /> Customers
      </Link>

      {/* Customer Card */}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-2xl font-extrabold text-[#E8621A]">
            {customer.name[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{customer.name}</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Since {format(new Date(customer.createdAt), "dd MMM yyyy")}
            </p>
          </div>
        </div>

        <div className="space-y-3.5 border-t border-slate-100 pt-5 text-sm text-slate-700">
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-slate-400" />
            <span>{customer.phone}</span>
          </div>

          {customer.email && (
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-slate-400" />
              <span>{customer.email}</span>
            </div>
          )}

          {customer.address && (
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-slate-400" />
              <span>{customer.address}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
