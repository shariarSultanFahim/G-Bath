"use client";

import { Switch } from "@/components/ui/switch";

export interface Step3Data {
  includePackage: boolean;
  package: string;
  packageNotes: string;
  includeVanity: boolean;
  vanityStyle: string;
  vanityDetails: string;
  vanityNotes: string;
  packageUpgrades: string[];
  includeMirrorLighting: boolean;
  mirror: string;
  vanityLighting: string;
  upgradeLighting: string;
  towelBars: string;
  mirrorLightingNotes: string;
  comments: string;
}

interface Props {
  data: Step3Data;
  onUpdate: (data: Partial<Step3Data>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const VANITY_STYLES = ["None", "Modern", "Classic"];
const TOWEL_BAR_FINISHES = ["None", "Chrome", "Black"];

export function Step3DryArea({ data, onUpdate, onNext, onPrev }: Props) {
  return (
    <div className="space-y-5">
      {/* Dry Area Package */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-slate-900">Dry Area Package</h3>
          <Switch checked={data.includePackage} onCheckedChange={(c) => onUpdate({ includePackage: c })} />
        </div>

        <div className={`space-y-3 transition-opacity ${!data.includePackage ? 'opacity-40 pointer-events-none' : ''}`}>
          <div className="space-y-2 pt-1">
            {["Acrylic Flooring", "Paint Finishes"].map((pkg) => {
              const selectedList = data.package ? data.package.split(", ").filter(Boolean) : [];
              const isChecked = selectedList.includes(pkg);
              return (
                <div
                  key={pkg}
                  onClick={() => {
                    let updated: string[];
                    if (isChecked) {
                      updated = selectedList.filter((p) => p !== pkg);
                    } else {
                      updated = [...selectedList, pkg];
                    }
                    onUpdate({ package: updated.join(", ") });
                  }}
                  className={`cursor-pointer rounded-2xl border p-3.5 flex items-center justify-between transition-all ${
                    isChecked
                      ? "border-[#D4AF37] bg-amber-50/40 ring-1 ring-[#D4AF37]/50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900">{pkg}</div>
                  {isChecked && <span className="text-[10px] font-semibold text-emerald-600">Selected</span>}
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Package Notes:</label>
            <textarea
              rows={2}
              value={data.packageNotes}
              onChange={(e) => onUpdate({ packageNotes: e.target.value })}
              placeholder="Enter notes about the dry area package..."
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#E8621A] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Vanity Selection */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-slate-900">Vanity Selection</h3>
          <Switch checked={data.includeVanity} onCheckedChange={(c) => onUpdate({ includeVanity: c })} />
        </div>

        <div className={`space-y-4 transition-opacity ${!data.includeVanity ? 'opacity-40 pointer-events-none' : ''}`}>
          {/* Style */}
          <div className="space-y-2">
            <label className="block text-[11px] font-semibold text-slate-700">Style:</label>
            <div className="flex gap-2">
              {VANITY_STYLES.map((style) => {
                const isSelected = data.vanityStyle === style;
                return (
                  <button
                    key={style}
                    type="button"
                    onClick={() => onUpdate({ vanityStyle: style })}
                    className={`rounded-xl px-4 py-2 text-xs font-medium transition-all ${
                      isSelected
                        ? (style === "None" ? "bg-rose-500 text-white shadow-sm" : "bg-[#C4A47C] text-white shadow-sm")
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {style}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Vanity Details */}
          {data.vanityStyle !== "None" && (
            <div className="space-y-1.5 pt-1">
              <label className="block text-[11px] font-semibold text-slate-700">Vanity Details:</label>
              <input
                type="text"
                value={data.vanityDetails}
                onChange={(e) => onUpdate({ vanityDetails: e.target.value })}
                placeholder="Enter vanity details..."
                className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#E8621A] focus:outline-none"
              />
            </div>
          )}

          {/* Vanity Notes */}
          <div className="pt-2">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Vanity Notes:</label>
            <textarea
              rows={2}
              value={data.vanityNotes}
              onChange={(e) => onUpdate({ vanityNotes: e.target.value })}
              placeholder="Enter vanity details or special instructions..."
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#E8621A] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Mirror & Lighting & Towel Bars */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-slate-900">Mirror / Cabinet & Lighting Choice</h3>
          <Switch checked={data.includeMirrorLighting} onCheckedChange={(c) => onUpdate({ includeMirrorLighting: c })} />
        </div>

        <div className={`space-y-6 transition-opacity ${!data.includeMirrorLighting ? 'opacity-40 pointer-events-none' : ''}`}>
          
          {/* Mirror */}
          <div className="space-y-2 pt-1">
            <h4 className="text-[11px] font-semibold text-slate-700">Mirror:</h4>
            {["LED", "Framed"].map((m) => {
              const isSelected = data.mirror === m;
              return (
                <div
                  key={m}
                  onClick={() => onUpdate({ mirror: m })}
                  className={`cursor-pointer rounded-2xl border p-3.5 flex items-center justify-between transition-all ${
                    isSelected
                      ? "border-[#D4AF37] bg-amber-50/40 ring-1 ring-[#D4AF37]/50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900">{m}</div>
                  {isSelected && <span className="text-[10px] font-semibold text-emerald-600">Selected</span>}
                </div>
              );
            })}
          </div>

          {/* Vanity Lighting */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-semibold text-slate-700">Vanity Lighting:</h4>
            <div className="flex gap-2">
              {["Pendant Style", "LED"].map((l) => {
                const isSelected = data.vanityLighting === l;
                return (
                  <button
                    key={l}
                    type="button"
                    onClick={() => onUpdate({ vanityLighting: l })}
                    className={`rounded-xl px-4 py-2 text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-[#C4A47C] text-white shadow-sm"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {l}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upgrade Lighting */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-semibold text-slate-700">Upgrade Lighting:</h4>
            <div className="flex gap-2">
              {["POT Lights", "LED"].map((l) => {
                const isSelected = data.upgradeLighting === l;
                return (
                  <button
                    key={l}
                    type="button"
                    onClick={() => onUpdate({ upgradeLighting: l })}
                    className={`rounded-xl px-4 py-2 text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-[#C4A47C] text-white shadow-sm"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {l}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Towel Bar Finish */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-semibold text-slate-700">Towel Bar Finish:</h4>
            <div className="flex gap-2">
              {TOWEL_BAR_FINISHES.map((finish) => {
                const isSelected = data.towelBars === finish;
                return (
                  <button
                    key={finish}
                    type="button"
                    onClick={() => onUpdate({ towelBars: finish })}
                    className={`rounded-xl px-4 py-2 text-xs font-medium transition-all ${
                      isSelected
                        ? (finish === "None" ? "bg-rose-500 text-white shadow-sm" : "bg-[#C4A47C] text-white shadow-sm")
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {finish}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mirror / Lighting Notes */}
          <div className="pt-2">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Mirror, Lighting & Towel Bar Notes:</label>
            <textarea
              rows={2}
              value={data.mirrorLightingNotes}
              onChange={(e) => onUpdate({ mirrorLightingNotes: e.target.value })}
              placeholder="Enter notes about mirrors, lighting or towel bars..."
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#E8621A] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Additional Comments */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100 space-y-2">
        <h3 className="text-base font-bold text-slate-900">Additional Comments</h3>
        <textarea
          rows={3}
          value={data.comments}
          onChange={(e) => onUpdate({ comments: e.target.value })}
          placeholder="Any additional comments..."
          className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#E8621A] focus:outline-none"
        />
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-2">
        <button onClick={onPrev} className="flex-1 rounded-2xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-600">
          ← Previous
        </button>
        <button onClick={onNext} className="flex-1 rounded-2xl bg-[#E8621A] py-3 text-sm font-semibold text-white shadow-md hover:bg-orange-600">
          Next →
        </button>
      </div>
    </div>
  );
}
