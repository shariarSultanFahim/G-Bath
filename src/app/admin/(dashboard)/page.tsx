import Link from "next/link";
import { db } from "@/lib/db";
import { format } from "date-fns";
import { Eye } from "lucide-react";

export default async function AdminDashboardPage() {
  const appointments = await db.appointment.findMany({
    orderBy: { date: "asc" },
    include: {
      customer: true,
      salesperson: true,
      assessments: true,
    },
  });

  const assessments = await db.assessment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      customer: true,
      salesperson: true,
    },
  });

  const scheduledCount = appointments.filter((a) => a.status === "SCHEDULED").length;
  const completedCount = appointments.filter((a) => a.status === "COMPLETED").length;
  const pdfReadyCount = assessments.filter((a) => a.pdfUrl !== null).length;
  const newAssessmentsCount = assessments.filter((a) => a.status === "SUBMITTED").length;

  return (
    <div className="space-y-8">
      {/* Date Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#E8621A]">
          {format(new Date(), "EEEE, dd MMMM yyyy")}
        </h1>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-full border-2 border-[#E8621A]/30 bg-orange-50/50 py-4 px-6 text-center font-bold text-slate-800 shadow-sm">
          <span className="text-[#E8621A] mr-2">• {scheduledCount}</span> Scheduled
        </div>
        <div className="rounded-full bg-orange-100/60 py-4 px-6 text-center font-bold text-slate-800 shadow-sm">
          <span className="text-orange-600 mr-2">• {completedCount}</span> Completed
        </div>
        <div className="rounded-full bg-slate-200/60 py-4 px-6 text-center font-bold text-slate-800 shadow-sm">
          <span className="text-slate-600 mr-2">• {pdfReadyCount}</span> PDF Ready
        </div>
        <div className="rounded-full bg-amber-100/60 py-4 px-6 text-center font-bold text-slate-800 shadow-sm">
          <span className="text-amber-600 mr-2">• {newAssessmentsCount}</span> New Assessments
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Today's Appointments</h2>
          <p className="text-xs text-slate-400">{appointments.length} appointments scheduled</p>
        </div>

        <div className="space-y-3">
          {appointments.length === 0 ? (
            <div className="rounded-2xl bg-white p-6 text-center text-xs text-slate-400 shadow-sm">
              No appointments scheduled for today.
            </div>
          ) : (
            appointments.map((appt) => (
              <div
                key={appt.id}
                className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm border border-slate-100"
              >
                <div className="flex items-center gap-6">
                  <div className="w-20 text-center rounded-xl bg-orange-100/60 py-2">
                    <p className="text-base font-extrabold text-[#E8621A]">{appt.time.split(" ")[0]}</p>
                    <p className="text-[10px] font-bold uppercase text-orange-400">
                      {appt.time.split(" ")[1] || "AM"}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{appt.customer.name}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold">
                        {appt.salesperson.name[0]}
                      </span>
                      {appt.salesperson.name}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600">
                  {appt.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* New Assessments */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">New Assessments</h2>
            <p className="text-xs text-slate-400">Submitted by salespersons for review</p>
          </div>
          <Link href="/admin/assessments" className="text-xs font-bold text-[#E8621A] hover:underline">
            View all ›
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {assessments.length === 0 ? (
            <p className="col-span-3 text-xs text-slate-400 italic">No assessments submitted yet.</p>
          ) : (
            assessments.slice(0, 3).map((ass) => (
              <div
                key={ass.id}
                className="rounded-3xl bg-white p-5 shadow-sm border-2 border-purple-200 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-700">
                      {ass.salesperson.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{ass.customer.name}</h4>
                      <p className="text-xs text-slate-400">{ass.salesperson.name}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600">
                    PDF Ready
                  </span>
                </div>

                <Link
                  href={`/admin/assessments/${ass.id}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-[#E8621A] hover:bg-orange-50 transition"
                >
                  <Eye className="h-3.5 w-3.5" /> View Assessment
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
