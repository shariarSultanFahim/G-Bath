import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-utils";

export async function PATCH() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await db.notification.updateMany({
      where:
        user.role === "ADMIN"
          ? { OR: [{ role: "ADMIN" }, { userId: user.id }], read: false }
          : { userId: user.id, read: false },
      data: { read: true },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Mark all notifications read error:", err);
    return NextResponse.json({ error: "Failed to mark all as read" }, { status: 500 });
  }
}
