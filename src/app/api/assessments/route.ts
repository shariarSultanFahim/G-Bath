import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-utils";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.max(1, parseInt(searchParams.get("limit") || "10", 10));
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "ALL";

  const skip = (page - 1) * limit;

  const whereCondition: any = {
    ...(user.role === "SELLER" ? { salespersonId: user.id } : {}),
  };

  if (status && status !== "ALL") {
    whereCondition.status = status;
  }

  if (search) {
    whereCondition.OR = [
      { customer: { name: { contains: search, mode: "insensitive" } } },
      { customer: { phone: { contains: search, mode: "insensitive" } } },
      { salesperson: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  const [total, data] = await Promise.all([
    db.assessment.count({ where: whereCondition }),
    db.assessment.findMany({
      where: whereCondition,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        customer: true,
        salesperson: { select: { id: true, name: true, avatar: true } },
        appointment: true,
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
    const { appointmentId, customerId, existingBathroom, wetArea, dryArea, upgrades, photos } = body;

    if (!customerId) {
      return NextResponse.json({ error: "Customer is required" }, { status: 400 });
    }

    const validApptId =
      appointmentId &&
      typeof appointmentId === "string" &&
      appointmentId !== "null" &&
      appointmentId.trim().length === 24
        ? appointmentId.trim()
        : undefined;

    const cleanExistingBathroom = existingBathroom
      ? {
          bathSize: existingBathroom.bathSize || undefined,
          showerSize: existingBathroom.showerSize || undefined,
          wallMaterial: existingBathroom.wallMaterial || undefined,
          flooringSquareFt: existingBathroom.flooringSquareFt || undefined,
          flooringMaterial: existingBathroom.flooringMaterial || undefined,
          measurements: existingBathroom.measurements || undefined,
          vanitySize: existingBathroom.vanitySize || undefined,
          notes: existingBathroom.notes || undefined,
        }
      : undefined;

    const cleanWetArea = wetArea
      ? {
          includeBath: Boolean(wetArea.includeBath),
          bathDetails: wetArea.bathDetails || undefined,
          includeShower: Boolean(wetArea.includeShower),
          showerDetails: wetArea.showerDetails || undefined,
          acrylicTilePanel: wetArea.acrylicTilePanel || undefined,
          notes: wetArea.notes || undefined,
        }
      : undefined;

    const cleanDryArea = dryArea
      ? {
          package: dryArea.package || undefined,
          vanityStyle: dryArea.vanityStyle || undefined,
          vanityDetails: dryArea.vanityDetails || undefined,
          packageUpgrades: Array.isArray(dryArea.packageUpgrades) ? dryArea.packageUpgrades : [],
          mirror: dryArea.mirror || undefined,
          vanityLighting: dryArea.vanityLighting || undefined,
          upgradeLighting: dryArea.upgradeLighting || undefined,
          towelBars: dryArea.towelBars || undefined,
          comments: dryArea.comments || undefined,
        }
      : undefined;

    const cleanUpgrades = upgrades
      ? {
          glassDoor: upgrades.glassDoor || undefined,
        }
      : undefined;

    const allPhotos = Array.from(
      new Set([
        ...(Array.isArray(photos) ? photos : []),
        ...(Array.isArray(existingBathroom?.photos) ? existingBathroom.photos : []),
      ])
    );

    const dataPayload: Prisma.AssessmentUncheckedCreateInput = {
      customerId,
      salespersonId: user.id,
      existingBathroom: cleanExistingBathroom,
      wetArea: cleanWetArea,
      dryArea: cleanDryArea,
      upgrades: cleanUpgrades,
      photos: allPhotos,
      status: "DRAFT",
    };

    if (validApptId) {
      dataPayload.appointmentId = validApptId;
    }

    const assessment = await db.assessment.create({
      data: dataPayload,
      include: {
        customer: true,
        salesperson: true,
      },
    });

    return NextResponse.json(assessment, { status: 201 });
  } catch (err) {
    console.error("Create assessment error:", err);
    return NextResponse.json({ error: "Failed to create assessment" }, { status: 500 });
  }
}
