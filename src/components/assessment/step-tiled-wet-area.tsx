"use client";

import { Switch } from "@/components/ui/switch";

export interface StepTiledWetAreaData {
  includeBathOrShower: boolean;
  bathOrShower: string; // "Bath" | "Shower" | ""
  wetAreaSize: string;
  bathOrShowerNotes: string;
  includeUpgrades: boolean;
  upgrades: string[];
  upgradesNotes: string;
  notes: string;
}

interface Props {
  data: StepTiledWetAreaData;
  onUpdate: (data: Partial<StepTiledWetAreaData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const WET_UPGRADES_OPTIONS = [
  {
    id: "Premium Glass Door",
    title: "Premium Glass Door",
    subtext: "Frameless • Frosted • Black Frame",
  },
  {
    id: "Shower Wand",
    title: "Shower Wand",
    subtext: "5-Spray • Slide Bar Option",
  },
  {
    id: "Shower Niche",
    title: "Shower Niche",
    subtext: "Built-in Recess • Single/Double/Triple",
  },
  {
    id: "Glass Shelves",
    title: "Glass Shelves",
    subtext: "Tempered Glass • Corner or Rectangular",
  },
  {
    id: "Grab Bar",
    title: "Grab Bar",
    subtext: "Safety grab bar • Non-slip grip • Brushed Nickel",
  },
  {
    id: "Quartz Stone Base",
    title: "Quartz Stone Base",
    subtext: "Premium quartz base • Durable • Easy to clean",
  },
];

export function StepTiledWetArea({ data, onUpdate, onNext, onPrev }: Props) {
  const handleSelectType = (type: string) => {
    if (data.bathOrShower === type) {
      onUpdate({ bathOrShower: "" });
    } else {
      onUpdate({ bathOrShower: type });
    }
  };

  const toggleUpgrade = (upgradeId: string) => {
    const current = data.upgrades || [];
    if (current.includes(upgradeId)) {
      onUpdate({ upgrades: current.filter((item) => item !== upgradeId) });
    } else {
      onUpdate({ upgrades: [...current, upgradeId] });
    }
  };

  return (
    <div className="space-y-5">
      {/* Title / Section Card */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Tile Wet Area</h2>
          <Switch checked={data.includeBathOrShower} onCheckedChange={(c) => onUpdate({ includeBathOrShower: c })} />
        </div>

        <div className={`space-y-4 transition-opacity ${!data.includeBathOrShower ? 'opacity-40 pointer-events-none' : ''}`}>
          {/* Bath or Shower? */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-900">Bath or Shower?</label>
            <p className="text-xs text-slate-400">Select the type (tap again to unselect)</p>

            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* Bath Card */}
              <div
                onClick={() => handleSelectType("Bath")}
                className={`cursor-pointer rounded-2xl border p-4 text-center transition-all ${
                  data.bathOrShower === "Bath"
                    ? "border-[#D4AF37] bg-amber-50/40 ring-1 ring-[#D4AF37]/50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="font-bold text-sm text-slate-900">Bath</div>
                <div className="text-[11px] text-slate-400">Freestanding or Built-in</div>
                {data.bathOrShower === "Bath" && (
                  <div className="mt-1 text-[11px] font-semibold text-emerald-600">Selected</div>
                )}
              </div>

              {/* Shower Card */}
              <div
                onClick={() => handleSelectType("Shower")}
                className={`cursor-pointer rounded-2xl border p-4 text-center transition-all ${
                  data.bathOrShower === "Shower"
                    ? "border-[#D4AF37] bg-amber-50/40 ring-1 ring-[#D4AF37]/50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="font-bold text-sm text-slate-900">Shower</div>
                <div className="text-[11px] text-slate-400">Walk-in or Enclosed</div>
                {data.bathOrShower === "Shower" && (
                  <div className="mt-1 text-[11px] font-semibold text-emerald-600">Selected</div>
                )}
              </div>
            </div>
          </div>

          {/* Wet Area Size */}
          <div className="space-y-1.5 pt-2">
            <label className="block text-xs font-semibold text-slate-700">Wet Area Size:</label>
            <textarea
              rows={2}
              value={data.wetAreaSize}
              onChange={(e) => onUpdate({ wetAreaSize: e.target.value })}
              placeholder="Enter size, dimensions, or special requirements..."
              className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#E8621A] focus:outline-none"
            />
          </div>

          {/* Bath or Shower Notes */}
          <div className="pt-2">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Bath/Shower Notes:</label>
            <textarea
              rows={2}
              value={data.bathOrShowerNotes}
              onChange={(e) => onUpdate({ bathOrShowerNotes: e.target.value })}
              placeholder="Enter details about bath or shower..."
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#E8621A] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Upgrades */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold text-slate-900">Upgrades</h3>
          <Switch checked={data.includeUpgrades} onCheckedChange={(c) => onUpdate({ includeUpgrades: c })} />
        </div>

        <div className={`space-y-4 transition-opacity ${!data.includeUpgrades ? 'opacity-40 pointer-events-none' : ''}`}>
          <div className="space-y-3">
            {WET_UPGRADES_OPTIONS.map((item) => {
              const isChecked = (data.upgrades || []).includes(item.id);
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/40 p-3.5"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-900">{item.title}</div>
                    <div className="text-[11px] text-slate-400">{item.subtext}</div>
                  </div>
                  <Switch checked={isChecked} onCheckedChange={() => toggleUpgrade(item.id)} />
                </div>
              );
            })}
          </div>

          {/* Upgrades Notes */}
          <div className="pt-2">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Upgrades Notes:</label>
            <textarea
              rows={2}
              value={data.upgradesNotes}
              onChange={(e) => onUpdate({ upgradesNotes: e.target.value })}
              placeholder="Enter notes about upgrades..."
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#E8621A] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100 space-y-2">
        <h3 className="text-base font-bold text-slate-900">Notes</h3>
        <textarea
          rows={3}
          value={data.notes}
          onChange={(e) => onUpdate({ notes: e.target.value })}
          placeholder="Enter notes about this tile wet area..."
          className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#E8621A] focus:outline-none"
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onPrev}
          className="flex-1 rounded-2xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-600"
        >
          ← Previous
        </button>
        <button
          onClick={onNext}
          className="flex-1 rounded-2xl bg-[#E8621A] py-3 text-sm font-semibold text-white shadow-md hover:bg-orange-600"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
