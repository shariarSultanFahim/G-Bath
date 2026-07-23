import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-utils";
import { db } from "@/lib/db";
import { format } from "date-fns";

export default async function AppointmentsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const appointments = await db.appointment.findMany({
    where: { salespersonId: user.id },
    orderBy: { date: "asc" },
    include: {
      customer: true,
      assessments: true,
    },
  });

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#E8621A]">Good</h1>
        <span className="text-xs text-slate-400 font-medium">{format(new Date(), "hh:mm a")}</span>
      </div>

      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Appointments</h2>

      <div className="space-y-3">
        {appointments.length === 0 ? (
          <p className="text-center text-xs text-slate-400 py-8">No appointments scheduled.</p>
        ) : (
          appointments.map((appt) => {
            const isAssessed = appt.assessments.length > 0;
            return (
              <Link
                key={appt.id}
                href={`/appointments/${appt.id}`}
                className="block rounded-2xl bg-white p-4 shadow-sm border border-slate-100 transition hover:shadow-md active:scale-[0.99]"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900">{appt.customer.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">
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
    </div>
  );
}
