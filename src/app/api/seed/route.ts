import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  const secretKey = process.env.NEXTAUTH_SECRET || "g-bath-super-secret-key-change-in-prod";
  if (key !== secretKey) {
    return NextResponse.json({ error: "Unauthorized. Provide ?key=YOUR_NEXTAUTH_SECRET" }, { status: 401 });
  }

  try {
    const adminPassword = await bcrypt.hash("admin123", 10);
    const sellerPassword = await bcrypt.hash("seller123", 10);

    const admin = await db.user.upsert({
      where: { email: "goodbathroomrenos@gmail.com" },
      update: {},
      create: {
        name: "Admin",
        email: "goodbathroomrenos@gmail.com",
        passwordHash: adminPassword,
        phone: "021 555 9999",
        role: "ADMIN",
        status: "ACTIVE",
      },
    });

    const seller = await db.user.upsert({
      where: { email: "alex@gbath.com" },
      update: {},
      create: {
        name: "Alex Rivera",
        email: "alex@gbath.com",
        passwordHash: sellerPassword,
        phone: "021 555 1001",
        role: "SELLER",
        status: "ACTIVE",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      seeded: { admin: admin.email, seller: seller.email },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
}
