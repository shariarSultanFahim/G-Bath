import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-utils";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const assessment = await db.assessment.findUnique({
    where: { id },
    include: {
      customer: true,
      salesperson: { select: { id: true, name: true, email: true } },
      appointment: true,
    },
  });

  if (!assessment) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(assessment);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const body = await req.json();
    const updated = await db.assessment.update({
      where: { id },
      data: body,
      include: { customer: true, salesperson: true },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Update assessment error:", err);
    return NextResponse.json({ error: "Failed to update assessment" }, { status: 500 });
  }
}
