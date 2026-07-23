import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-utils";
import { notificationEmitter } from "@/lib/notifications-stream";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const appointments = await db.appointment.findMany({
    where: user.role === "SELLER" ? { salespersonId: user.id } : {},
    orderBy: { date: "asc" },
    include: {
      customer: true,
      salesperson: { select: { id: true, name: true } },
      assessments: { select: { id: true, status: true, pdfUrl: true } },
    },
  });

  return NextResponse.json(appointments);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized: Admin only" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { customerId, salespersonId, date, time, notes } = body;

    if (!customerId || !salespersonId || !date || !time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const appointment = await db.appointment.create({
      data: {
        customerId,
        salespersonId,
        date: new Date(date),
        time,
        notes: notes || "",
      },
      include: {
        customer: true,
        salesperson: true,
      },
    });

    // Create & Broadcast real-time notification for assigned SELLER
    const notif = await db.notification.create({
      data: {
        userId: salespersonId,
        role: "SELLER",
        title: "New Appointment Assigned",
        message: `Appointment scheduled with ${appointment.customer.name} on ${time}`,
        link: `/appointments/${appointment.id}`,
        type: "NEW_APPOINTMENT",
      },
    });

    notificationEmitter.emit("notification", notif);

    return NextResponse.json(appointment, { status: 201 });
  } catch (err) {
    console.error("Create appointment error:", err);
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
  }
}
