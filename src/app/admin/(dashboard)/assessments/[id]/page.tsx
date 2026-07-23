"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Download, Eye } from "lucide-react";
import { format } from "date-fns";
import { PdfPreviewModal } from "@/components/admin/pdf-preview-modal";

export default function AdminAssessmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [assessment, setAssessment] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/assessments/${id}`)
      .then((res) => res.json())
      .then((data) => setAssessment(data));
  }, [id]);

  if (!assessment) return <div className="p-8 text-center text-xs text-slate-400">Loading assessment...</div>;

  const ex = assessment.existingBathroom || {};
  const wet = assessment.wetArea || {};
  const dry = assessment.dryArea || {};
  const up = assessment.upgrades || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <Link href="/admin/assessments" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E8621A]">
        <ArrowLeft className="h-4 w-4" /> Back to Assessments
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Assessment – {assessment.customer.name}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {assessment.salesperson.name} · {format(new Date(assessment.createdAt), "dd MMM yyyy")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-slate-400">#{id.slice(-4).toUpperCase()}</span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
            {assessment.status}
          </span>
          {assessment.pdfUrl && (
            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-[#E8621A]">
              PDF Ready
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left 2 Cols: Full Assessment Readonly View */}
        <div className="col-span-2 space-y-6">
          {/* Assessment Section */}
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
              ASSESSMENT
            </h3>
            <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-xs">
              <div><span className="text-slate-400 block">BATH SIZE</span><span className="font-bold text-slate-800">{ex.bathSize || "—"}</span></div>
              <div><span className="text-slate-400 block">SHOWER SIZE</span><span className="font-bold text-slate-800">{ex.showerSize || "—"}</span></div>
              <div><span className="text-slate-400 block">WALL MATERIAL</span><span className="font-bold text-slate-800">{ex.wallMaterial || "—"}</span></div>
              <div><span className="text-slate-400 block">FLOORING SQ FT</span><span className="font-bold text-slate-800">{ex.flooringSquareFt || "—"}</span></div>
              <div><span className="text-slate-400 block">FLOORING MATERIAL</span><span className="font-bold text-slate-800">{ex.flooringMaterial || "—"}</span></div>
              <div><span className="text-slate-400 block">MEASUREMENTS</span><span className="font-bold text-slate-800">{ex.measurements || "—"}</span></div>
              <div><span className="text-slate-400 block">VANITY SIZE</span><span className="font-bold text-slate-800">{ex.vanitySize || "—"}</span></div>
              <div><span className="text-slate-400 block">NOTES</span><span className="font-bold text-slate-800">{ex.notes || "—"}</span></div>
            </div>
          </div>

          {/* Wet Area Section */}
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
              WET AREA
            </h3>
            <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-xs">
              <div><span className="text-slate-400 block">BATH</span><span className="font-bold text-slate-800">{wet.includeBath ? `Yes - ${wet.bathDetails || ""}` : "No"}</span></div>
              <div><span className="text-slate-400 block">SHOWER</span><span className="font-bold text-slate-800">{wet.includeShower ? `Yes - ${wet.showerDetails || ""}` : "No"}</span></div>
              <div className="col-span-2"><span className="text-slate-400 block">ACRYLIC PANEL SYSTEM</span><span className="font-bold text-slate-800">{wet.acrylicTilePanel || "—"}</span></div>
            </div>
          </div>

          {/* Dry Area Section */}
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
              DRY AREA
            </h3>
            <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-xs">
              <div><span className="text-slate-400 block">PACKAGE</span><span className="font-bold text-slate-800">{dry.package || "—"}</span></div>
              <div><span className="text-slate-400 block">VANITY STYLE</span><span className="font-bold text-slate-800">{dry.vanityStyle || "—"}</span></div>
              <div><span className="text-slate-400 block">MIRROR</span><span className="font-bold text-slate-800">{dry.mirror || "—"}</span></div>
              <div><span className="text-slate-400 block">VANITY LIGHTING</span><span className="font-bold text-slate-800">{dry.vanityLighting || "—"}</span></div>
              <div><span className="text-slate-400 block">UPGRADE LIGHTING</span><span className="font-bold text-slate-800">{dry.upgradeLighting || "—"}</span></div>
              <div><span className="text-slate-400 block">TOWEL BARS</span><span className="font-bold text-slate-800">{dry.towelBars || "—"}</span></div>
              <div className="col-span-2"><span className="text-slate-400 block">COMMENTS</span><span className="font-bold text-slate-800">{dry.comments || "—"}</span></div>
            </div>
          </div>

          {/* Upgrades Section */}
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
              UPGRADES
            </h3>
            <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-xs">
              <div><span className="text-slate-400 block">PACKAGE UPGRADES</span><span className="font-bold text-slate-800">{dry.packageUpgrades?.join(", ") || "None"}</span></div>
              <div><span className="text-slate-400 block">GLASS DOOR</span><span className="font-bold text-slate-800">{up.glassDoor || "—"}</span></div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Generated PDF & Uploaded Photos */}
        <div className="space-y-6">
          {/* PDF Card */}
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">GENERATED PDF</h3>

            {assessment.pdfUrl ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-2xl bg-orange-50/60 p-3 border border-orange-100">
                  <FileText className="h-6 w-6 text-[#E8621A]" />
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      Assessment_{assessment.customer.name.replace(/\s+/g, "_")}.pdf
                    </p>
                    <p className="text-[10px] text-slate-400">Ready</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsPreviewOpen(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E8621A] py-2.5 text-xs font-bold text-white shadow-md hover:bg-orange-600 active:scale-95"
                >
                  <Eye className="h-4 w-4" /> Open PDF
                </button>

                <a
                  href={assessment.pdfUrl}
                  download
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  <Download className="h-4 w-4" /> Download PDF
                </a>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No PDF generated yet.</p>
            )}
          </div>

          {/* Uploaded Photos Card */}
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              UPLOADED PHOTOS ({assessment.photos?.length || 0})
            </h3>

            {!assessment.photos || assessment.photos.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center">No photos uploaded.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {assessment.photos.map((url: string, i: number) => (
                  <a key={i} href={url} target="_blank" rel="noreferrer">
                    <img src={url} alt={`Photo ${i + 1}`} className="h-24 w-full rounded-xl object-cover border border-slate-200 hover:opacity-90" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <PdfPreviewModal
        pdfUrl={assessment.pdfUrl}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
}
