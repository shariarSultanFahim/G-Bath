import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-utils";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized: Admin only" }, { status: 403 });
  }

  const appointments = await db.appointment.findMany({
    orderBy: { date: "asc" },
    include: {
      customer: true,
      salesperson: { select: { id: true, name: true } },
      assessments: true,
    },
  });

  const assessments = await db.assessment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      customer: true,
      salesperson: { select: { id: true, name: true } },
    },
  });

  const scheduledCount = appointments.filter((a) => a.status === "SCHEDULED").length;
  const completedCount = appointments.filter((a) => a.status === "COMPLETED").length;
  const pdfReadyCount = assessments.filter((a) => a.pdfUrl !== null).length;
  const newAssessmentsCount = assessments.filter((a) => a.status === "SUBMITTED").length;

  return NextResponse.json({
    stats: {
      scheduledCount,
      completedCount,
      pdfReadyCount,
      newAssessmentsCount,
    },
    appointments,
    assessments,
  });
}
