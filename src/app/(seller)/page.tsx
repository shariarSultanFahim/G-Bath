import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-utils";
import { db } from "@/lib/db";
import { format } from "date-fns";
import { AlertCircle, Eye, ArrowRight } from "lucide-react";
import { SharePdfButton } from "@/components/seller/share-pdf-button";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default async function SellerHomePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const dbUser = await db.user.findUnique({ where: { id: user.id } });
  const displayName = dbUser?.name || user.name;
  const avatarUrl = dbUser?.avatar;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const appointments = await db.appointment.findMany({
    where: {
      salespersonId: user.id,
      status: "SCHEDULED",
    },
    orderBy: { date: "asc" },
    include: {
      customer: true,
      assessments: true,
    },
  });

  const pendingAppointment = appointments.find((a) => a.assessments.length === 0);

  const recentAssessments = await db.assessment.findMany({
    where: { salespersonId: user.id, pdfUrl: { not: null } },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { customer: true },
  });

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{getGreeting()}, {displayName}</h2>
          <p className="text-xs text-slate-500">{format(new Date(), "dd MMM yyyy")}</p>
        </div>
        <Link
          href="/profile"
          className="overflow-hidden flex h-11 w-11 items-center justify-center rounded-full bg-orange-100 text-[#E8621A] font-bold border-2 border-[#E8621A] transition hover:scale-105"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayName || "User"} className="h-full w-full object-cover" />
          ) : (
            displayName?.[0] || "A"
          )}
        </Link>
      </div>

      {/* Pending Assessment Banner */}
      {pendingAppointment && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700">
            <AlertCircle className="h-4 w-4" />
            <span>Pending Assessment</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900">{pendingAppointment.customer.name}</p>
              <p className="text-xs text-slate-500">{pendingAppointment.time}</p>
            </div>
            <Link
              href={`/assessments/new?appointmentId=${pendingAppointment.id}&customerId=${pendingAppointment.customerId}`}
              className="flex items-center gap-1 text-xs font-bold text-[#E8621A] hover:underline"
            >
              Start <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Today's Appointments */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Today's Appointments</h3>
        {appointments.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No appointments scheduled for today.</p>
        ) : (
          appointments.map((appt) => {
            const isAssessed = appt.assessments.length > 0;
            return (
              <Link
                key={appt.id}
                href={`/appointments/${appt.id}`}
                className="block rounded-2xl bg-white p-4 shadow-sm border border-slate-100 transition hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900">{appt.customer.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      🕒 {appt.time} · {format(new Date(appt.date), "dd MMM yyyy")}
                    </p>
                    {appt.notes && <p className="mt-2 text-xs text-slate-600 line-clamp-1">{appt.notes}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-[11px] font-semibold text-orange-600">
                      Scheduled
                    </span>
                    {isAssessed && (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600">
                        Assessed
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* Quick Actions / Recent PDFs */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Quick Actions</h3>
        {recentAssessments.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No completed assessments yet.</p>
        ) : (
          recentAssessments.map((ass) => (
            <div
              key={ass.id}
              className="flex items-center justify-between rounded-2xl bg-white p-3.5 shadow-sm border border-slate-100"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                  📄
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{ass.customer.name}</p>
                  <p className="text-xs text-slate-400">{format(new Date(ass.createdAt), "dd MMM yyyy")}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {ass.pdfUrl && (
                  <a
                    href={ass.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-slate-400 hover:text-slate-700"
                  >
                    <Eye className="h-4 w-4" />
                  </a>
                )}
                <SharePdfButton pdfUrl={ass.pdfUrl} customerName={ass.customer.name} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
