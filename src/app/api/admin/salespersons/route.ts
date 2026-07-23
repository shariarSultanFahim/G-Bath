import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-utils";
import { hashPassword } from "@/lib/password";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized: Admin only" }, { status: 403 });
  }

  const salespersons = await db.user.findMany({
    where: { role: "SELLER" },
    orderBy: { createdAt: "desc" },
    include: {
      assessments: { select: { id: true } },
    },
  });

  return NextResponse.json(salespersons);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized: Admin only" }, { status: 403 });
  }

  try {
    const { name, email, phone, password } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: "Name and Email required" }, { status: 400 });
    }

    const existing = await db.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existing) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
    }

    const defaultPassword = password || "seller123";
    const passwordHash = await hashPassword(defaultPassword);

    const salesperson = await db.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        phone,
        passwordHash,
        role: "SELLER",
        status: "ACTIVE",
      },
    });

    return NextResponse.json(salesperson, { status: 201 });
  } catch (err) {
    console.error("Create salesperson error:", err);
    return NextResponse.json({ error: "Failed to create salesperson" }, { status: 500 });
  }
}
