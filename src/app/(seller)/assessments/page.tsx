import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-utils";
import { db } from "@/lib/db";
import { format } from "date-fns";
import { Plus, FileText, CheckCircle2 } from "lucide-react";

export default async function SellerAssessmentsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const assessments = await db.assessment.findMany({
    where: { salespersonId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      customer: true,
    },
  });

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#E8621A]">Good</h1>
        <span className="text-xs text-slate-400 font-medium">{format(new Date(), "hh:mm a")}</span>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Assessments</h2>
        <Link
          href="/assessments/new"
          className="flex items-center gap-1 rounded-2xl bg-[#E8621A] px-4 py-2.5 text-sm font-semibold text-white shadow-md active:scale-95"
        >
          <Plus className="h-4 w-4" /> New
        </Link>
      </div>

      <div className="space-y-3">
        {assessments.length === 0 ? (
          <p className="text-center text-xs text-slate-400 py-8">No assessments created yet.</p>
        ) : (
          assessments.map((ass) => (
            <div
              key={ass.id}
              className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm border border-slate-100 transition hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-[#E8621A]">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{ass.customer.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {format(new Date(ass.createdAt), "dd MMM yyyy")} · {ass.status}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {ass.pdfUrl ? (
                  <a
                    href={ass.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 flex items-center gap-1"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> PDF
                  </a>
                ) : (
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-600">
                    Draft
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
