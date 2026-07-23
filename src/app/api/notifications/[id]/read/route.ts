import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-utils";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const updated = await db.notification.update({
      where: { id },
      data: { read: true },
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("Mark notification read error:", err);
    return NextResponse.json({ error: "Failed to mark notification read" }, { status: 500 });
  }
}
