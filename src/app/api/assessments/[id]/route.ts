import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-utils";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const assessment = await db.assessment.findUnique({
    where: { id },
    include: {
      customer: true,
      salesperson: { select: { id: true, name: true, email: true } },
      appointment: true,
    },
  });

  if (!assessment) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(assessment);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const body = await req.json();
    const { existingBathroom, wetArea, dryArea, upgrades, photos, ...rest } = body;

    const dataPayload: Prisma.AssessmentUncheckedUpdateInput = { ...rest };

    if (existingBathroom) {
      dataPayload.existingBathroom = {
        bathSize: existingBathroom.bathSize || undefined,
        showerSize: existingBathroom.showerSize || undefined,
        wallMaterial: existingBathroom.wallMaterial || undefined,
        flooringSquareFt: existingBathroom.flooringSquareFt || undefined,
        flooringMaterial: existingBathroom.flooringMaterial || undefined,
        measurements: existingBathroom.measurements || undefined,
        vanitySize: existingBathroom.vanitySize || undefined,
        notes: existingBathroom.notes || undefined,
      };
    }

    if (wetArea) {
      dataPayload.wetArea = {
        includeBath: Boolean(wetArea.includeBath),
        bathDetails: wetArea.bathDetails || undefined,
        includeShower: Boolean(wetArea.includeShower),
        showerDetails: wetArea.showerDetails || undefined,
        acrylicTilePanel: wetArea.acrylicTilePanel || undefined,
        notes: wetArea.notes || undefined,
      };
    }

    if (dryArea) {
      dataPayload.dryArea = {
        package: dryArea.package || undefined,
        vanityStyle: dryArea.vanityStyle || undefined,
        vanityDetails: dryArea.vanityDetails || undefined,
        packageUpgrades: Array.isArray(dryArea.packageUpgrades) ? dryArea.packageUpgrades : [],
        mirror: dryArea.mirror || undefined,
        vanityLighting: dryArea.vanityLighting || undefined,
        upgradeLighting: dryArea.upgradeLighting || undefined,
        towelBars: dryArea.towelBars || undefined,
        comments: dryArea.comments || undefined,
      };
    }

    if (upgrades) {
      dataPayload.upgrades = {
        glassDoor: upgrades.glassDoor || undefined,
      };
    }

    if (photos || existingBathroom?.photos) {
      dataPayload.photos = Array.from(
        new Set([
          ...(Array.isArray(photos) ? photos : []),
          ...(Array.isArray(existingBathroom?.photos) ? existingBathroom.photos : []),
        ])
      );
    }

    const updated = await db.assessment.update({
      where: { id },
      data: dataPayload,
      include: { customer: true, salesperson: true },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Update assessment error:", err);
    return NextResponse.json({ error: "Failed to update assessment" }, { status: 500 });
  }
}
