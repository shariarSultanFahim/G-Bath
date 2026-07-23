import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-utils";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const assessments = await db.assessment.findMany({
    where: user.role === "SELLER" ? { salespersonId: user.id } : {},
    orderBy: { createdAt: "desc" },
    include: {
      customer: true,
      salesperson: { select: { id: true, name: true } },
      appointment: true,
    },
  });

  return NextResponse.json(assessments);
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

    const dataPayload: any = {
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
