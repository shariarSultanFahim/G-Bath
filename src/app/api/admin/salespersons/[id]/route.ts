import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-utils";

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
