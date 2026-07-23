import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-utils";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";

  const customers = await db.customer.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { address: { contains: search, mode: "insensitive" } },
          ],
        }
      : {},
    orderBy: { createdAt: "desc" },
    include: {
      assessments: { select: { id: true, createdAt: true, status: true, pdfUrl: true } },
    },
  });

  return NextResponse.json(customers);
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
