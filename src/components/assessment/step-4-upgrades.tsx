"use client";

export interface Step4Data {
  glassDoor: string;
}

interface Props {
  data: Step4Data;
  onUpdate: (data: Partial<Step4Data>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const GLASS_DOOR_OPTIONS = [
  "Sliding Door",
  "Hinged Pivot Door",
  "Fixed Panel",
  "Pivoting Fixed Panel",
];

export function Step4Upgrades({ data, onUpdate, onNext, onPrev }: Props) {
  return (
    <div className="space-y-5">
      {/* Glass Door Card */}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Glass Door</h3>

        <div className="space-y-3 pt-1">
          {GLASS_DOOR_OPTIONS.map((door) => (
            <label key={door} className="flex items-center gap-3 text-sm font-medium text-slate-800 cursor-pointer">
              <input
                type="radio"
                name="glassDoor"
                value={door}
                checked={data.glassDoor === door}
                onChange={(e) => onUpdate({ glassDoor: e.target.value })}
                className="h-4 w-4 accent-[#E8621A]"
              />
              {door}
            </label>
          ))}
        </div>
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
