import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-utils";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const assessments = await db.assessment.findMany({
    where: user.role === "SELLER" ? { salespersonId: user.id } : {},
    orderBy: { createdAt: "desc" },
    include: {
      customer: true,
      salesperson: { select: { id: true, name: true } },
      appointment: true,
    },
  });

  return NextResponse.json(assessments);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || !user.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { appointmentId, customerId, existingBathroom, wetArea, dryArea, upgrades, photos } = body;

    if (!customerId) {
      return NextResponse.json({ error: "Customer is required" }, { status: 400 });
    }

    const assessment = await db.assessment.create({
      data: {
        appointmentId: appointmentId ? appointmentId : null,
        customerId,
        salespersonId: user.id,
        existingBathroom,
        wetArea,
        dryArea,
        upgrades,
        photos: photos || [],
        status: "DRAFT",
      },
      include: {
        customer: true,
        salesperson: true,
      },
    });

    return NextResponse.json(assessment, { status: 201 });
  } catch (err) {
    console.error("Create assessment error:", err);
    return NextResponse.json({ error: "Failed to create assessment" }, { status: 500 });
  }
}
