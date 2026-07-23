import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-utils";
import { generateAssessmentPDF, PDFData } from "@/lib/pdf-generator";
import { format } from "date-fns";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const assessment = await db.assessment.findUnique({
    where: { id },
    include: { customer: true, salesperson: true },
  });

  if (!assessment) return NextResponse.json({ error: "Assessment not found" }, { status: 404 });

  const pdfData: PDFData = {
    customerName: assessment.customer.name,
    customerPhone: assessment.customer.phone,
    customerAddress: assessment.customer.address,
    dateStr: format(assessment.createdAt, "dd MMM yyyy"),
    existingBathroom: (assessment.existingBathroom as Record<string, string>) || {},
    wetArea: (assessment.wetArea as unknown as Record<string, string>) || {},
    dryArea: (assessment.dryArea as unknown as Record<string, string>) || {},
    upgrades: (assessment.upgrades as Record<string, string>) || {},
    notes: assessment.existingBathroom?.notes || undefined,
    photosCount: assessment.photos?.length || 0,
  };

  try {
    const pdfUrl = await generateAssessmentPDF(pdfData, assessment.id);
    const updated = await db.assessment.update({
      where: { id },
      data: { pdfUrl, status: assessment.status === "DRAFT" ? "PDF_READY" : assessment.status },
    });

    return NextResponse.json({ pdfUrl: updated.pdfUrl });
  } catch (err) {
    console.error("PDF generation failed:", err);
    return NextResponse.json({ error: "PDF generation failed" }, { status: 500 });
  }
}
