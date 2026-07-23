import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-utils";
import { sendAssessmentNotification } from "@/lib/email";
import { notificationEmitter } from "@/lib/notifications-stream";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const assessment = await db.assessment.findUnique({
    where: { id },
    include: { customer: true, salesperson: true, appointment: true },
  });

  if (!assessment) return NextResponse.json({ error: "Assessment not found" }, { status: 404 });

  try {
    const updated = await db.assessment.update({
      where: { id },
      data: {
        status: "SUBMITTED",
        submittedAt: new Date(),
      },
    });

    if (assessment.appointmentId) {
      await db.appointment.update({
        where: { id: assessment.appointmentId },
        data: { status: "COMPLETED" },
      });
    }

    // Send email notification to admin
    await sendAssessmentNotification({
      customerName: assessment.customer.name,
      salespersonName: assessment.salesperson.name,
      assessmentId: assessment.id,
    });

    // Create & Broadcast real-time notification for ADMIN
    const notif = await db.notification.create({
      data: {
        role: "ADMIN",
        title: "New Assessment Submitted",
        message: `${assessment.salesperson.name} submitted an assessment for ${assessment.customer.name}`,
        link: `/admin/assessments/${assessment.id}`,
        type: "NEW_ASSESSMENT",
      },
    });

    notificationEmitter.emit("notification", notif);

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Assessment submission failed:", err);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
