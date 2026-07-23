import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-utils";
import { notificationEmitter } from "@/lib/notifications-stream";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.max(1, parseInt(searchParams.get("limit") || "10", 10));
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "ALL";

  const skip = (page - 1) * limit;

  const whereCondition: any = {
    ...(user.role === "SELLER" ? { salespersonId: user.id } : {}),
  };

  if (status && status !== "ALL") {
    whereCondition.status = status;
  }

  if (search) {
    whereCondition.OR = [
      { customer: { name: { contains: search, mode: "insensitive" } } },
      { customer: { phone: { contains: search, mode: "insensitive" } } },
      { salesperson: { name: { contains: search, mode: "insensitive" } } },
      { notes: { contains: search, mode: "insensitive" } },
    ];
  }

  const [total, data] = await Promise.all([
    db.appointment.count({ where: whereCondition }),
    db.appointment.findMany({
      where: whereCondition,
      orderBy: { date: "desc" },
      skip,
      take: limit,
      include: {
        customer: true,
        salesperson: { select: { id: true, name: true, avatar: true } },
        assessments: { select: { id: true, status: true, pdfUrl: true } },
      },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return NextResponse.json({
    data,
    total,
    page,
    limit,
    totalPages,
  });
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
