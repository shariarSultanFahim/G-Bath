import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-utils";
import { hashPassword } from "@/lib/password";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized: Admin only" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.max(1, parseInt(searchParams.get("limit") || "10", 10));
  const search = searchParams.get("search") || "";

  const skip = (page - 1) * limit;

  const whereCondition: any = {
    role: "SELLER",
  };

  if (search) {
    whereCondition.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ];
  }

  const [total, data] = await Promise.all([
    db.user.count({ where: whereCondition }),
    db.user.findMany({
      where: whereCondition,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        assessments: { select: { id: true } },
      },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return NextResponse.json({
    data,
    total,
    page,
    limit,
    totalPages,
  });
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
