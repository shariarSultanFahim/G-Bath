import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-utils";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized: Admin only" }, { status: 403 });
  }

  const { id } = await params;
  try {
    const salesperson = await db.user.findUnique({
      where: { id },
      include: {
        assessments: {
          orderBy: { createdAt: "desc" },
          include: { customer: true },
        },
        appointments: {
          orderBy: { date: "desc" },
          include: { customer: true },
        },
      },
    });

    if (!salesperson) {
      return NextResponse.json({ error: "Salesperson not found" }, { status: 404 });
    }

    return NextResponse.json(salesperson);
  } catch (err) {
    console.error("Fetch salesperson error:", err);
    return NextResponse.json({ error: "Failed to fetch salesperson" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized: Admin only" }, { status: 403 });
  }

  const { id } = await params;
  try {
    const body = await req.json();
    const updated = await db.user.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("Update salesperson error:", err);
    return NextResponse.json({ error: "Failed to update salesperson" }, { status: 500 });
  }
}
