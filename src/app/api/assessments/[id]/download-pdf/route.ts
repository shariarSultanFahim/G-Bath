import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-utils";
import { generateAssessmentPDFBuffer, PDFData } from "@/lib/pdf-generator";
import { format } from "date-fns";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const { id } = await params;
  const assessment = await db.assessment.findUnique({
    where: { id },
    include: { customer: true, salesperson: true },
  });

  if (!assessment) return new NextResponse("Assessment not found", { status: 404 });

  const pdfData: PDFData = {
    customerName: assessment.customer.name,
    customerPhone: assessment.customer.phone,
    customerAddress: assessment.customer.address,
    customerEmail: assessment.customer.email,
    sellerName: assessment.salesperson.name,
    sellerEmail: assessment.salesperson.email,
    sellerPhone: assessment.salesperson.phone || undefined,
    dateStr: format(assessment.createdAt, "dd MMM yyyy"),
    existingBathroom: (assessment.existingBathroom as Record<string, string>) || {},
    wetArea: (assessment.wetArea as unknown as Record<string, any>) || {},
    tiledWetArea: (assessment.tiledWetArea as unknown as Record<string, any>) || undefined,
    dryArea: (assessment.dryArea as unknown as Record<string, any>) || {},
    tiledDryArea: (assessment.tiledDryArea as unknown as Record<string, any>) || undefined,
    upgrades: (assessment.upgrades as unknown as Record<string, any>) || {},
    notes: assessment.existingBathroom?.notes || undefined,
    photos: assessment.photos || [],
  };

  try {
    const buffer = await generateAssessmentPDFBuffer(pdfData, assessment.id);

    return new NextResponse(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="Assessment_${assessment.customer.name.replace(/[^a-zA-Z0-9]/g, "_")}.pdf"`,
      },
    });
  } catch (err) {
    console.error("PDF generation failed:", err);
    return new NextResponse("PDF generation failed", { status: 500 });
  }
}
