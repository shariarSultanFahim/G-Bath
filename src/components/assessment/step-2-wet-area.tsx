"use client";

import { Step3Data } from "./step-3-dry-area";
import { Step4Data } from "./step-5-review";

export interface Step2Data {
  includeBath: boolean;
  bathDetails: string;
  includeShower: boolean;
  showerDetails: string;
  acrylicTilePanel: string;
  notes: string;
}

interface Props {
  data: Step2Data;
  packageUpgrades?: string[];
  glassDoor?: string;
  onUpdate: (data: Partial<Step2Data>) => void;
  onUpdateStep3: (data: Partial<Step3Data>) => void;
  onUpdateStep4: (data: Partial<Step4Data>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ACRYLIC_PANELS = [
  "Acrylic Subway Tile",
  "Acrylic Large Tile",
  "Acrylic Carrera Marble",
  "Acrylic Calcutta Marble",
  "Acrylic Gilded Marble",
];

const GLASS_DOOR_OPTIONS = [
  "Sliding Door",
  "Hinged Pivot Door",
  "Fixed Panel",
  "Pivoting Fixed Panel",
];

const UPGRADES_LIST = [
  "Shower Wand",
  "Shower Wand Rain/Head",
  "Niche",
  "Grab Bar",
  "Glass Shelf",
  "Cultured Stone Base (Marble, White)",
];

export function Step2WetArea({
  data,
  packageUpgrades = [],
  glassDoor = "",
  onUpdate,
  onUpdateStep3,
  onUpdateStep4,
  onNext,
  onPrev,
}: Props) {
  const toggleUpgrade = (item: string) => {
    const exists = packageUpgrades.includes(item);
    if (exists) {
      onUpdateStep3({ packageUpgrades: packageUpgrades.filter((i) => i !== item) });
    } else {
      onUpdateStep3({ packageUpgrades: [...packageUpgrades, item] });
    }
  };

  return (
    <div className="space-y-5">
      {/* Wet Area Package */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100 space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Wet Area Package</h3>

        {/* Bath Section */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-900 cursor-pointer">
            <input
              type="checkbox"
              checked={data.includeBath}
              onChange={(e) => onUpdate({ includeBath: e.target.checked })}
              className="h-4 w-4 rounded accent-[#E8621A]"
            />
            Include Bath
          </label>

          {data.includeBath && (
            <input
              type="text"
              value={data.bathDetails}
              onChange={(e) => onUpdate({ bathDetails: e.target.value })}
              placeholder="Bath details..."
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#E8621A] focus:outline-none"
            />
          )}
        </div>

        {/* Shower Section */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-900 cursor-pointer">
            <input
              type="checkbox"
              checked={data.includeShower}
              onChange={(e) => onUpdate({ includeShower: e.target.checked })}
              className="h-4 w-4 rounded accent-[#E8621A]"
            />
            Include Shower
          </label>

          {data.includeShower && (
            <input
              type="text"
              value={data.showerDetails}
              onChange={(e) => onUpdate({ showerDetails: e.target.value })}
              placeholder="Shower details..."
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#E8621A] focus:outline-none"
            />
          )}
        </div>
      </div>

      {/* Glass Door (under Wet Area Package) */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100 space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Glass Door</h3>
        <div className="space-y-3 pt-1">
          {GLASS_DOOR_OPTIONS.map((door) => (
            <label key={door} className="flex items-center gap-3 text-sm font-medium text-slate-800 cursor-pointer">
              <input
                type="radio"
                name="glassDoor"
                value={door}
                checked={glassDoor === door}
                onChange={(e) => onUpdateStep4({ glassDoor: e.target.value })}
                className="h-4 w-4 accent-[#E8621A]"
              />
              {door}
            </label>
          ))}
        </div>
      </div>

      {/* Acrylic Tile Panel System */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100 space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Acrylic Tile Panel System</h3>

        <div className="space-y-2.5 pt-1">
          {ACRYLIC_PANELS.map((panel) => (
            <label key={panel} className="flex items-center gap-3 text-sm font-medium text-slate-700 cursor-pointer">
              <input
                type="radio"
                name="acrylicPanel"
                value={panel}
                checked={data.acrylicTilePanel === panel}
                onChange={(e) => onUpdate({ acrylicTilePanel: e.target.value })}
                className="h-4 w-4 accent-[#E8621A]"
              />
              {panel}
            </label>
          ))}
        </div>
      </div>

      {/* Package Upgrades (Moved to Step 2) */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100 space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Package Upgrades</h3>
        <div className="space-y-2.5">
          {UPGRADES_LIST.map((item) => (
            <label key={item} className="flex items-center gap-3 text-sm font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={packageUpgrades.includes(item)}
                onChange={() => toggleUpgrade(item)}
                className="h-4 w-4 rounded accent-[#E8621A]"
              />
              {item}
            </label>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Notes</label>
        <textarea
          rows={2}
          value={data.notes}
          onChange={(e) => onUpdate({ notes: e.target.value })}
          placeholder="Additional observations..."
          className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 focus:border-[#E8621A] focus:outline-none"
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
