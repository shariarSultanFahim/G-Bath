"use client";

import { Step3Data } from "./step-3-dry-area";
import { Step4Data } from "./step-5-review";
import { Switch } from "@/components/ui/switch";

export interface Step2Data {
  includeBath: boolean;
  bathDetails: string;
  includeShower: boolean;
  showerDetails: string;
  includeAcrylicTilePanel: boolean;
  acrylicTilePanel: string;
  notes: string;
}

interface Props {
  data: Step2Data;
  packageUpgrades?: string[];
  glassDoor?: string;
  includeGlassDoor?: boolean;
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
  includeGlassDoor = true,
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

  const toggleGlassDoor = (door: string) => {
    const currentList = glassDoor ? glassDoor.split(", ").filter(Boolean) : [];
    let newList: string[];
    if (currentList.includes(door)) {
      newList = currentList.filter((d) => d !== door);
    } else {
      newList = [...currentList, door];
    }
    const joined = newList.join(", ");
    onUpdateStep4({ glassDoor: joined, includeGlassDoor: Boolean(joined) });
  };

  const toggleAcrylicPanel = (panel: string) => {
    const currentList = data.acrylicTilePanel ? data.acrylicTilePanel.split(", ").filter(Boolean) : [];
    let newList: string[];
    if (currentList.includes(panel)) {
      newList = currentList.filter((p) => p !== panel);
    } else {
      newList = [...currentList, panel];
    }
    const joined = newList.join(", ");
    onUpdate({ acrylicTilePanel: joined, includeAcrylicTilePanel: Boolean(joined) });
  };

  return (
    <div className="space-y-5">
      {/* Wet Area Package */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100 space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-400">Wet Area Package</h3>

        {/* Bath Section */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900">Bath Details</h4>
            {data.bathDetails && (
              <button
                type="button"
                onClick={() => onUpdate({ bathDetails: "", includeBath: false })}
                className="text-[11px] font-semibold text-rose-500 hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          <div>
            <input
              type="text"
              value={data.bathDetails}
              onChange={(e) =>
                onUpdate({
                  bathDetails: e.target.value,
                  includeBath: Boolean(e.target.value.trim()),
                })
              }
              placeholder="Enter bath details (e.g. Standard 5ft Acrylic Bath)..."
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#E8621A] focus:outline-none"
            />
          </div>
        </div>

        {/* Shower Section */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900">Shower Details</h4>
            {data.showerDetails && (
              <button
                type="button"
                onClick={() => onUpdate({ showerDetails: "", includeShower: false })}
                className="text-[11px] font-semibold text-rose-500 hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          <div>
            <input
              type="text"
              value={data.showerDetails}
              onChange={(e) =>
                onUpdate({
                  showerDetails: e.target.value,
                  includeShower: Boolean(e.target.value.trim()),
                })
              }
              placeholder="Enter shower details (e.g. 36x36 Acrylic Shower Base)..."
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#E8621A] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Glass Door (under Wet Area Package) */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Glass Door</h3>
          <p className="text-xs text-slate-400">Tap to select / deselect</p>
        </div>

        <div className="space-y-2 pt-1">
          {GLASS_DOOR_OPTIONS.map((door) => {
            const currentList = glassDoor ? glassDoor.split(", ").filter(Boolean) : [];
            const isSelected = currentList.includes(door);
            return (
              <div
                key={door}
                onClick={() => toggleGlassDoor(door)}
                className={`cursor-pointer rounded-2xl border p-3.5 flex items-center justify-between transition-all ${
                  isSelected
                    ? "border-[#D4AF37] bg-amber-50/40 ring-1 ring-[#D4AF37]/50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="text-xs font-bold text-slate-900">{door}</div>
                {isSelected && <span className="text-[10px] font-semibold text-emerald-600">Selected</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Acrylic Tile Panel System */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Acrylic Tile Panel System</h3>
          <p className="text-xs text-slate-400">Tap to select / deselect</p>
        </div>

        <div className="space-y-2 pt-1">
          {ACRYLIC_PANELS.map((panel) => {
            const currentList = data.acrylicTilePanel ? data.acrylicTilePanel.split(", ").filter(Boolean) : [];
            const isSelected = currentList.includes(panel);
            return (
              <div
                key={panel}
                onClick={() => toggleAcrylicPanel(panel)}
                className={`cursor-pointer rounded-2xl border p-3.5 flex items-center justify-between transition-all ${
                  isSelected
                    ? "border-[#D4AF37] bg-amber-50/40 ring-1 ring-[#D4AF37]/50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="text-xs font-bold text-slate-900">{panel}</div>
                {isSelected && <span className="text-[10px] font-semibold text-emerald-600">Selected</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Package Upgrades */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Package Upgrades</h3>
        <div className="space-y-3">
          {UPGRADES_LIST.map((item) => {
            const isChecked = packageUpgrades.includes(item);
            return (
              <div
                key={item}
                onClick={() => toggleUpgrade(item)}
                className={`cursor-pointer flex items-center justify-between rounded-2xl border p-3.5 transition-all ${
                  isChecked
                    ? "border-[#D4AF37] bg-amber-50/40 ring-1 ring-[#D4AF37]/50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="text-xs font-bold text-slate-900">{item}</div>
                <Switch checked={isChecked} onCheckedChange={() => toggleUpgrade(item)} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100 space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Wet Area Notes</h3>
        <textarea
          rows={3}
          value={data.notes}
          onChange={(e) => onUpdate({ notes: e.target.value })}
          placeholder="Additional observations about wet area..."
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
