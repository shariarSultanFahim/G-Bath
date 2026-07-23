import Link from "next/link";
import { db } from "@/lib/db";
import { format } from "date-fns";
import { Eye, FileText } from "lucide-react";

export default async function AdminAssessmentsPage() {
  const assessments = await db.assessment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      customer: true,
      salesperson: true,
      appointment: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Assessments</h1>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">CUSTOMER</th>
              <th className="p-4">SALESPERSON</th>
              <th className="p-4">APPT DATE</th>
              <th className="p-4">SUBMITTED</th>
              <th className="p-4">STATUS</th>
              <th className="p-4">PDF</th>
              <th className="p-4 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {assessments.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-slate-400">
                  No assessments found.
                </td>
              </tr>
            ) : (
              assessments.map((ass) => (
                <tr key={ass.id} className="hover:bg-slate-50 transition">
                  <td className="p-4 font-mono font-bold text-slate-400">#{ass.id.slice(-4).toUpperCase()}</td>
                  <td className="p-4 font-bold text-slate-900">{ass.customer.name}</td>
                  <td className="p-4 flex items-center gap-2 text-slate-700">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold">
                      {ass.salesperson.name[0]}
                    </span>
                    {ass.salesperson.name}
                  </td>
                  <td className="p-4 text-slate-600">
                    {ass.appointment?.date ? format(new Date(ass.appointment.date), "dd MMM yyyy") : "—"}
                  </td>
                  <td className="p-4 text-slate-500">
                    {ass.submittedAt ? format(new Date(ass.submittedAt), "dd MMM yyyy") : "—"}
                  </td>
                  <td className="p-4">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600">
                      {ass.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {ass.pdfUrl ? (
                      <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 flex items-center gap-1 w-max">
                        <FileText className="h-3 w-3" /> Ready
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/admin/assessments/${ass.id}`}
                      className="inline-flex items-center gap-1 font-bold text-[#E8621A] hover:underline"
                    >
                      <Eye className="h-3.5 w-3.5" /> View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
