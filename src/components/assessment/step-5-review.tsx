"use client";

import { useState } from "react";
import { Step1Data } from "./step-1-assess";
import { Step2Data } from "./step-2-wet-area";
import { Step3Data } from "./step-3-dry-area";
import { Step4Data } from "./step-4-upgrades";
import { FileText, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  step1: Step1Data;
  step2: Step2Data;
  step3: Step3Data;
  step4: Step4Data;
  onGoToStep: (step: number) => void;
  onPrev: () => void;
  onSubmit: () => Promise<void>;
  assessmentId?: string;
  pdfUrl?: string;
  setPdfUrl: (url: string) => void;
}

export function Step5Review({
  step1,
  step2,
  step3,
  step4,
  onGoToStep,
  onPrev,
  onSubmit,
  assessmentId,
  pdfUrl,
  setPdfUrl,
}: Props) {
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleGeneratePdf = async () => {
    if (!assessmentId) {
      toast.error("Please save draft assessment first");
      return;
    }
    setGeneratingPdf(true);
    try {
      const res = await fetch(`/api/assessments/${assessmentId}/pdf`, { method: "POST" });
      if (res.ok) {
        const { pdfUrl } = await res.json();
        setPdfUrl(pdfUrl);
        toast.success("PDF Generated successfully!");
      } else {
        toast.error("PDF generation failed");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setGeneratingPdf(false);
    }
  };

  const handleSubmitAssessment = async () => {
    setSubmitting(true);
    try {
      await onSubmit();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500">
        Review all sections. Tap Edit to make changes before generating the PDF.
      </p>

      {/* Section 1: Assessment */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assessment</h4>
          <button onClick={() => onGoToStep(1)} className="text-xs font-bold text-[#E8621A]">
            Edit
          </button>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between"><span className="text-slate-500">Bath Size</span><span className="font-semibold">{step1.bathSize || "—"}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Shower Size</span><span className="font-semibold">{step1.showerSize || "—"}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Wall Material</span><span className="font-semibold">{step1.wallMaterial || "—"}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Flooring</span><span className="font-semibold">{step1.flooringSquareFt ? `${step1.flooringSquareFt} sq ft - ${step1.flooringMaterial || ""}` : "—"}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Measurements</span><span className="font-semibold">{step1.measurements || "—"}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Vanity Size</span><span className="font-semibold">{step1.vanitySize || "—"}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Photos</span><span className="font-semibold">{step1.photos?.length || 0} attached</span></div>
        </div>
      </div>

      {/* Section 2: Wet Area */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Wet Area</h4>
          <button onClick={() => onGoToStep(2)} className="text-xs font-bold text-[#E8621A]">
            Edit
          </button>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between"><span className="text-slate-500">Bath</span><span className="font-semibold">{step2.includeBath ? `Yes - ${step2.bathDetails || ""}` : "No"}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Shower</span><span className="font-semibold">{step2.includeShower ? `Yes - ${step2.showerDetails || ""}` : "No"}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Acrylic Panel</span><span className="font-semibold">{step2.acrylicTilePanel || "—"}</span></div>
        </div>
      </div>

      {/* Section 3: Dry Area */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dry Area</h4>
          <button onClick={() => onGoToStep(3)} className="text-xs font-bold text-[#E8621A]">
            Edit
          </button>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between"><span className="text-slate-500">Package</span><span className="font-semibold">{step3.package || "—"}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Vanity Style</span><span className="font-semibold">{step3.vanityStyle || "—"}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Mirror</span><span className="font-semibold">{step3.mirror || "—"}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Lighting</span><span className="font-semibold">{step3.vanityLighting || "—"}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Towel Bars</span><span className="font-semibold">{step3.towelBars || "—"}</span></div>
        </div>
      </div>

      {/* Section 4: Upgrades */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upgrades</h4>
          <button onClick={() => onGoToStep(4)} className="text-xs font-bold text-[#E8621A]">
            Edit
          </button>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between"><span className="text-slate-500">Package Upgrades</span><span className="font-semibold">{step3.packageUpgrades?.join(", ") || "None"}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Glass Door</span><span className="font-semibold">{step4.glassDoor || "—"}</span></div>
        </div>
      </div>

      {/* PDF Actions & Submit */}
      <div className="space-y-3 pt-2">
        {pdfUrl ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-center text-xs font-bold text-emerald-700 flex items-center justify-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> PDF Generated
          </div>
        ) : (
          <button
            onClick={handleGeneratePdf}
            disabled={generatingPdf}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#E8621A] py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 active:scale-[0.98] disabled:opacity-50"
          >
            <FileText className="h-4 w-4" /> {generatingPdf ? "Generating PDF..." : "Generate PDF"}
          </button>
        )}

        <button
          onClick={handleSubmitAssessment}
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 active:scale-[0.98] disabled:opacity-50"
        >
          <CheckCircle2 className="h-4 w-4" /> {submitting ? "Submitting..." : "Submit Assessment"}
        </button>

        <button
          onClick={onPrev}
          className="w-full rounded-2xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-600"
        >
          ← Previous
        </button>
      </div>
    </div>
  );
}
