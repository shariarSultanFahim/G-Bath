import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-utils";
import { comparePassword, hashPassword } from "@/lib/password";

export async function PUT(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, phone, currentPassword, newPassword } = await req.json();

    const dataToUpdate: Record<string, unknown> = {};
    if (name) dataToUpdate.name = name;
    if (phone !== undefined) dataToUpdate.phone = phone;

    if (currentPassword && newPassword) {
      const dbUser = await db.user.findUnique({ where: { id: user.id } });
      if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

      const isValid = await comparePassword(currentPassword, dbUser.passwordHash);
      if (!isValid) {
        return NextResponse.json({ error: "Current password incorrect" }, { status: 400 });
      }

      dataToUpdate.passwordHash = await hashPassword(newPassword);
    }

    const updated = await db.user.update({
      where: { id: user.id },
      data: dataToUpdate,
      select: { id: true, name: true, email: true, phone: true, role: true, avatar: true },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Profile update error:", err);
    return NextResponse.json({ error: "Profile update failed" }, { status: 500 });
  }
}
