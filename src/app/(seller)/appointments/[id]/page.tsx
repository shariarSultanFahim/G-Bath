import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-utils";
import { db } from "@/lib/db";
import { format } from "date-fns";
import { ArrowLeft, Phone, Mail, MapPin, ClipboardList, Eye, FileText, Share2 } from "lucide-react";
import { notFound } from "next/navigation";

export default async function AppointmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return null;

  const { id } = await params;
  const appointment = await db.appointment.findUnique({
    where: { id },
    include: {
      customer: true,
      assessments: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!appointment) notFound();

  const assessment = appointment.assessments[0];

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#E8621A]">Good</h1>
        <span className="text-xs text-slate-400 font-medium">{format(new Date(), "hh:mm a")}</span>
      </div>

      <Link href="/appointments" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#E8621A]">
        <ArrowLeft className="h-4 w-4" /> Appointments
      </Link>

      {/* Appointment Detail Card */}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">{appointment.customer.name}</h2>
          <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600">
            Scheduled
          </span>
        </div>

        <p className="text-xs text-slate-500 font-medium">
          🕒 {format(new Date(appointment.date), "dd MMM yyyy")} at {appointment.time}
        </p>

        <div className="space-y-2 border-t border-b border-slate-100 py-4 text-sm text-slate-700">
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-slate-400" />
            <span>{appointment.customer.phone}</span>
          </div>
          {appointment.customer.email && (
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-slate-400" />
              <span>{appointment.customer.email}</span>
            </div>
          )}
          {appointment.customer.address && (
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-slate-400" />
              <span>{appointment.customer.address}</span>
            </div>
          )}
        </div>

        {appointment.notes && (
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Notes</h4>
            <p className="mt-1 text-sm text-slate-700">{appointment.notes}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        {!assessment ? (
          <Link
            href={`/assessments/new?appointmentId=${appointment.id}&customerId=${appointment.customerId}`}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#E8621A] py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition active:scale-[0.98]"
          >
            <ClipboardList className="h-4 w-4" /> Start Assessment
          </Link>
        ) : (
          <>
            <Link
              href={`/assessments?id=${assessment.id}`}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-3.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <Eye className="h-4 w-4" /> View Assessment
            </Link>

            {assessment.pdfUrl && (
              <a
                href={assessment.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#E8621A] py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition active:scale-[0.98]"
              >
                <FileText className="h-4 w-4" /> Generate / View PDF
              </a>
            )}
          </>
        )}
      </div>
    </div>
  );
}
