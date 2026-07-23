"use client";

export interface Step3Data {
  package: string;
  vanityStyle: string;
  vanityDetails: string;
  packageUpgrades: string[];
  mirror: string;
  vanityLighting: string;
  upgradeLighting: string;
  towelBars: string;
  comments: string;
}

interface Props {
  data: Step3Data;
  onUpdate: (data: Partial<Step3Data>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const UPGRADES_LIST = [
  "Shower Wand",
  "Shower Wand Rain/Head",
  "Niche",
  "Grab Bar",
  "Glass Shelf",
  "Cultured Stone Base (Marble, White)",
];

export function Step3DryArea({ data, onUpdate, onNext, onPrev }: Props) {
  const toggleUpgrade = (item: string) => {
    const current = data.packageUpgrades || [];
    const exists = current.includes(item);
    if (exists) {
      onUpdate({ packageUpgrades: current.filter((i) => i !== item) });
    } else {
      onUpdate({ packageUpgrades: [...current, item] });
    }
  };

  return (
    <div className="space-y-5">
      {/* Dry Area Package */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100 space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dry Area Package</h3>
        <div className="space-y-2">
          {["Acrylic Flooring", "Paint Finishes"].map((pkg) => (
            <label key={pkg} className="flex items-center gap-3 text-sm font-medium text-slate-700 cursor-pointer">
              <input
                type="radio"
                name="dryPackage"
                value={pkg}
                checked={data.package === pkg}
                onChange={(e) => onUpdate({ package: e.target.value })}
                className="h-4 w-4 accent-[#E8621A]"
              />
              {pkg}
            </label>
          ))}
        </div>
      </div>

      {/* Vanity Style */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100 space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vanity Style</h3>
        <div className="space-y-2">
          {["Modern", "Classic"].map((style) => (
            <label key={style} className="flex items-center gap-3 text-sm font-medium text-slate-700 cursor-pointer">
              <input
                type="radio"
                name="vanityStyle"
                value={style}
                checked={data.vanityStyle === style}
                onChange={(e) => onUpdate({ vanityStyle: e.target.value })}
                className="h-4 w-4 accent-[#E8621A]"
              />
              {style}
            </label>
          ))}
        </div>
        <input
          type="text"
          value={data.vanityDetails}
          onChange={(e) => onUpdate({ vanityDetails: e.target.value })}
          placeholder="Vanity details..."
          className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#E8621A] focus:outline-none"
        />
      </div>

      {/* Package Upgrades */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100 space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Package Upgrades</h3>
        <div className="space-y-2.5">
          {UPGRADES_LIST.map((item) => (
            <label key={item} className="flex items-center gap-3 text-sm font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={(data.packageUpgrades || []).includes(item)}
                onChange={() => toggleUpgrade(item)}
                className="h-4 w-4 rounded accent-[#E8621A]"
              />
              {item}
            </label>
          ))}
        </div>
      </div>

      {/* Mirror & Lighting & Towel Bars */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100 space-y-4">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Mirror</h3>
          <div className="flex gap-4">
            {["LED", "Framed"].map((m) => (
              <label key={m} className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="mirror"
                  value={m}
                  checked={data.mirror === m}
                  onChange={(e) => onUpdate({ mirror: e.target.value })}
                  className="h-4 w-4 accent-[#E8621A]"
                />
                {m}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Vanity Lighting</h3>
          <div className="flex gap-4">
            {["Pendant Style", "LED"].map((l) => (
              <label key={l} className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="vanityLighting"
                  value={l}
                  checked={data.vanityLighting === l}
                  onChange={(e) => onUpdate({ vanityLighting: e.target.value })}
                  className="h-4 w-4 accent-[#E8621A]"
                />
                {l}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Upgrade Lighting</h3>
          <div className="flex gap-4">
            {["POT Lights", "LED"].map((l) => (
              <label key={l} className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="upgradeLighting"
                  value={l}
                  checked={data.upgradeLighting === l}
                  onChange={(e) => onUpdate({ upgradeLighting: e.target.value })}
                  className="h-4 w-4 accent-[#E8621A]"
                />
                {l}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Towel Bars</h3>
          <div className="flex gap-4">
            {["Black", "Chrome"].map((t) => (
              <label key={t} className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="towelBars"
                  value={t}
                  checked={data.towelBars === t}
                  onChange={(e) => onUpdate({ towelBars: e.target.value })}
                  className="h-4 w-4 accent-[#E8621A]"
                />
                {t}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Comments */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Additional Comments</label>
        <textarea
          rows={2}
          value={data.comments}
          onChange={(e) => onUpdate({ comments: e.target.value })}
          placeholder="Any additional comments..."
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
