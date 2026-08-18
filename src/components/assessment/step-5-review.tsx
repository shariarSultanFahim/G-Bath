"use client";

import { useState } from "react";
export interface Step4Data {
  includeGlassDoor: boolean;
  glassDoor: string;
}

import { Step1Data } from "./step-1-assess";
import { Step2Data } from "./step-2-wet-area";
import { StepTiledWetAreaData } from "./step-tiled-wet-area";
import { Step3Data } from "./step-3-dry-area";
import { StepTiledDryAreaData } from "./step-tiled-dry-area";
import { FileText, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  step1: Step1Data;
  step2: Step2Data;
  stepTiledWet: StepTiledWetAreaData;
  step3: Step3Data;
  stepTiledDry: StepTiledDryAreaData;
  step4: Step4Data;
  onGoToStep: (step: number) => void;
  onPrev: () => void;
  onSubmit: () => Promise<void>;
  onGeneratePdf: () => Promise<void>;
  pdfUrl?: string;
}

export function Step5Review({
  step1,
  step2,
  stepTiledWet,
  step3,
  stepTiledDry,
  step4,
  onGoToStep,
  onPrev,
  onSubmit,
  onGeneratePdf,
  pdfUrl,
}: Props) {
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleGeneratePdf = async () => {
    setGeneratingPdf(true);
    try {
      await onGeneratePdf();
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
          <div className="flex justify-between"><span className="text-slate-500">Bath Size</span><span className="font-semibold">{step1.bathSize || "None"}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Shower Size</span><span className="font-semibold">{step1.showerSize || "None"}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Wall Material</span><span className="font-semibold">{step1.wallMaterial || "None"}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Flooring</span><span className="font-semibold">{step1.flooringSquareFt ? `${step1.flooringSquareFt} sq ft${step1.flooringMaterial ? ` - ${step1.flooringMaterial}` : ""}` : (step1.flooringMaterial || "None")}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Measurements</span><span className="font-semibold">{step1.measurements || "None"}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Vanity Size</span><span className="font-semibold">{step1.vanitySize || "None"}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Notes</span><span className="font-semibold">{step1.notes || "None"}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Photos</span><span className="font-semibold">{step1.photos?.length ? `${step1.photos.length} attached` : "None"}</span></div>
        </div>
      </div>

      {/* Section 2: Wet Area (Acrylic) */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Wet Area (Acrylic)</h4>
          <button onClick={() => onGoToStep(2)} className="text-xs font-bold text-[#E8621A]">
            Edit
          </button>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between"><span className="text-slate-500">Bath Details</span><span className="font-semibold">{step2.bathDetails ? `Yes - ${step2.bathDetails}` : (step2.includeBath ? "Included" : "None")}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Shower Details</span><span className="font-semibold">{step2.showerDetails ? `Yes - ${step2.showerDetails}` : (step2.includeShower ? "Included" : "None")}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Glass Door</span><span className="font-semibold">{step4.glassDoor || "None"}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Acrylic Panel</span><span className="font-semibold">{step2.acrylicTilePanel || "None"}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Package Upgrades</span><span className="font-semibold">{step3.packageUpgrades?.length ? step3.packageUpgrades.join(", ") : "None"}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Notes</span><span className="font-semibold">{step2.notes || "None"}</span></div>
        </div>
      </div>

      {/* Section 3: Dry Area (Acrylic) - Step 3 */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dry Area (Acrylic)</h4>
          <button onClick={() => onGoToStep(3)} className="text-xs font-bold text-[#E8621A]">
            Edit
          </button>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between"><span className="text-slate-500">Package</span><span className="font-semibold">{step3.package || "None"}</span></div>
          {step3.packageNotes && (
            <div className="flex justify-between"><span className="text-slate-500">Package Notes</span><span className="font-semibold">{step3.packageNotes}</span></div>
          )}
          <div className="flex justify-between"><span className="text-slate-500">Vanity Style</span><span className="font-semibold">{step3.vanityStyle ? `${step3.vanityStyle}${step3.vanityDetails ? ` (${step3.vanityDetails})` : ""}` : "None"}</span></div>
          {step3.vanityNotes && (
            <div className="flex justify-between"><span className="text-slate-500">Vanity Notes</span><span className="font-semibold">{step3.vanityNotes}</span></div>
          )}
          <div className="flex justify-between"><span className="text-slate-500">Mirror</span><span className="font-semibold">{step3.mirror || "None"}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Vanity Lighting</span><span className="font-semibold">{step3.vanityLighting || "None"}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Upgrade Lighting</span><span className="font-semibold">{step3.upgradeLighting || "None"}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Towel Bars</span><span className="font-semibold">{step3.towelBars || "None"}</span></div>
          {step3.mirrorLightingNotes && (
            <div className="flex justify-between"><span className="text-slate-500">Mirror / Lighting Notes</span><span className="font-semibold">{step3.mirrorLightingNotes}</span></div>
          )}
          <div className="flex justify-between"><span className="text-slate-500">Notes & Comments</span><span className="font-semibold">{step3.comments || "None"}</span></div>
        </div>
      </div>

      {/* Section 4: Tiled Wet Area - Step 4 */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tiled Wet Area</h4>
          <button onClick={() => onGoToStep(4)} className="text-xs font-bold text-[#E8621A]">
            Edit
          </button>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between"><span className="text-slate-500">Type</span><span className="font-semibold">{stepTiledWet.bathOrShower || "None"}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Size</span><span className="font-semibold">{stepTiledWet.wetAreaSize || "None"}</span></div>
          {stepTiledWet.bathOrShowerNotes && (
            <div className="flex justify-between"><span className="text-slate-500">Bath/Shower Notes</span><span className="font-semibold">{stepTiledWet.bathOrShowerNotes}</span></div>
          )}
          <div className="flex justify-between"><span className="text-slate-500">Upgrades</span><span className="font-semibold">{stepTiledWet.upgrades?.length ? stepTiledWet.upgrades.join(", ") : "None"}</span></div>
          {stepTiledWet.upgradesNotes && (
            <div className="flex justify-between"><span className="text-slate-500">Upgrades Notes</span><span className="font-semibold">{stepTiledWet.upgradesNotes}</span></div>
          )}
          <div className="flex justify-between"><span className="text-slate-500">Notes</span><span className="font-semibold">{stepTiledWet.notes || "None"}</span></div>
        </div>
      </div>

      {/* Section 5: Tiled Dry Area - Step 5 */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tiled Dry Area</h4>
          <button onClick={() => onGoToStep(5)} className="text-xs font-bold text-[#E8621A]">
            Edit
          </button>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between"><span className="text-slate-500">Flooring</span><span className="font-semibold">{stepTiledDry.flooringSelection || "None"}</span></div>
          {stepTiledDry.flooringNotes && (
            <div className="flex justify-between"><span className="text-slate-500">Flooring Notes</span><span className="font-semibold">{stepTiledDry.flooringNotes}</span></div>
          )}
          <div className="flex justify-between"><span className="text-slate-500">Toilet</span><span className="font-semibold">{stepTiledDry.toiletSelection || "None"}</span></div>
          {stepTiledDry.toiletNotes && (
            <div className="flex justify-between"><span className="text-slate-500">Toilet Notes</span><span className="font-semibold">{stepTiledDry.toiletNotes}</span></div>
          )}
          <div className="flex justify-between">
            <span className="text-slate-500">Vanity</span>
            <span className="font-semibold">
              {!stepTiledDry.vanityStyle || stepTiledDry.vanityStyle === "None"
                ? "None"
                : `${stepTiledDry.vanityStyle}${stepTiledDry.vanitySize ? ` (${stepTiledDry.vanitySize})` : ""}`}
            </span>
          </div>
          {stepTiledDry.vanityNotes && (
            <div className="flex justify-between"><span className="text-slate-500">Vanity Notes</span><span className="font-semibold">{stepTiledDry.vanityNotes}</span></div>
          )}
          <div className="flex justify-between"><span className="text-slate-500">Mirror</span><span className="font-semibold">{stepTiledDry.mirrorChoice || "None"}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Lighting</span><span className="font-semibold">{stepTiledDry.lightingChoice || "None"}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Towel Bar Finish</span><span className="font-semibold">{stepTiledDry.towelBarFinish || "None"}</span></div>
          {stepTiledDry.mirrorLightingNotes && (
            <div className="flex justify-between"><span className="text-slate-500">Mirror / Lighting Notes</span><span className="font-semibold">{stepTiledDry.mirrorLightingNotes}</span></div>
          )}
          <div className="flex justify-between"><span className="text-slate-500">Upgrades</span><span className="font-semibold">{stepTiledDry.upgrades?.length ? stepTiledDry.upgrades.join(", ") : "None"}</span></div>
          {stepTiledDry.upgradesNotes && (
            <div className="flex justify-between"><span className="text-slate-500">Upgrades Notes</span><span className="font-semibold">{stepTiledDry.upgradesNotes}</span></div>
          )}
          <div className="flex justify-between"><span className="text-slate-500">Notes</span><span className="font-semibold">{stepTiledDry.notes || "None"}</span></div>
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
            disabled={generatingPdf || submitting}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#E8621A] py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 active:scale-[0.98] disabled:opacity-50"
          >
            <FileText className="h-4 w-4" /> {generatingPdf ? "Generating PDF..." : "Generate PDF"}
          </button>
        )}

        <button
          onClick={handleSubmitAssessment}
          disabled={submitting || generatingPdf}
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
