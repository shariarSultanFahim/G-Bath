import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-utils";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.max(1, parseInt(searchParams.get("limit") || "10", 10));
  const search = searchParams.get("search") || "";

  const skip = (page - 1) * limit;

  const whereCondition: any = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { phone: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { address: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

  const [total, data] = await Promise.all([
    db.customer.count({ where: whereCondition }),
    db.customer.findMany({
      where: whereCondition,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        assessments: { select: { id: true, createdAt: true, status: true, pdfUrl: true } },
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
  if (!user || !user.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { name, email, phone, address } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
    }

    const customer = await db.customer.create({
      data: {
        name,
        email: email || "",
        phone,
        address: address || "",
        createdById: user.id,
      },
    });

    return NextResponse.json(customer, { status: 201 });
  } catch (err) {
    console.error("Create customer error:", err);
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
  }
}
