import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-utils";
import { notificationEmitter } from "@/lib/notifications-stream";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const notifications = await db.notification.findMany({
      where:
        user.role === "ADMIN"
          ? { OR: [{ role: "ADMIN" }, { userId: user.id }] }
          : { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const unreadCount = await db.notification.count({
      where:
        user.role === "ADMIN"
          ? { OR: [{ role: "ADMIN" }, { userId: user.id }], read: false }
          : { userId: user.id, read: false },
    });

    return NextResponse.json({ notifications, unreadCount });
  } catch (err) {
    console.error("Fetch notifications error:", err);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { userId, role, title, message, link, type } = body;

    const notification = await db.notification.create({
      data: {
        userId: userId || null,
        role: role || null,
        title,
        message,
        link,
        type: type || "GENERAL",
      },
    });

    // Broadcast real-time SSE event
    notificationEmitter.emit("notification", notification);

    return NextResponse.json(notification, { status: 201 });
  } catch (err) {
    console.error("Create notification error:", err);
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 });
  }
}
