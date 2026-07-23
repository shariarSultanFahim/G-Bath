import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-utils";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized: Admin only" }, { status: 403 });
  }

  const allAppointments = await db.appointment.findMany({
    orderBy: { date: "asc" },
    include: {
      customer: true,
      salesperson: { select: { id: true, name: true, avatar: true } },
      assessments: true,
    },
  });

  const assessments = await db.assessment.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
    include: {
      customer: true,
      salesperson: { select: { id: true, name: true, avatar: true } },
    },
  });

  const scheduledCount = allAppointments.filter((a) => a.status === "SCHEDULED").length;
  const completedCount = allAppointments.filter((a) => a.status === "COMPLETED").length;
  const pdfReadyCount = assessments.filter((a) => a.pdfUrl !== null).length;
  const newAssessmentsCount = assessments.filter((a) => a.status === "SUBMITTED").length;

  // Filter Today's Appointments list to only SCHEDULED appointments
  const scheduledAppointments = allAppointments.filter((a) => a.status === "SCHEDULED");

  return NextResponse.json({
    stats: {
      scheduledCount,
      completedCount,
      pdfReadyCount,
      newAssessmentsCount,
    },
    appointments: scheduledAppointments,
    assessments,
  });
}
