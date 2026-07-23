import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-utils";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const customer = await db.customer.findUnique({
    where: { id },
    include: {
      assessments: {
        orderBy: { createdAt: "desc" },
        include: { salesperson: { select: { name: true } } },
      },
      appointments: { orderBy: { date: "desc" } },
    },
  });

  if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(customer);
}
