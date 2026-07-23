import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-utils";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const appointment = await db.appointment.findUnique({
    where: { id },
    include: {
      customer: true,
      salesperson: { select: { id: true, name: true, email: true, phone: true } },
      assessments: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!appointment) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(appointment);
}
